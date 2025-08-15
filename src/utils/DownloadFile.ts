// ===== File-Level Documentation =====
// Reusable download utility (framework-agnostic)
// - Exports `downloadFile` to fetch any file (public-relative or absolute) and trigger a browser download
// - Reports optional progress via callback, revokes object URLs, and falls back to window.open when configured
// - Strict TypeScript types, no Vue/runtime imports so it can be reused across components/composables

// ===== Types & Interfaces =====
export type ProgressCallback = (loaded: number, total?: number | null) => void

export interface DownloadOptions {
    /**
     * Optional progress callback called with (loadedBytes, totalBytes|null).
     * If the response doesn't expose a Content-Length header, total will be null.
     */
    onProgress?: ProgressCallback
    /**
     * If true (default) and fetch fails, attempt window.open(filePath) as a fallback.
     * Useful on mobile browsers that handle file previews differently.
     */
    fallbackToWindowOpen?: boolean
    /**
     * Allow absolute (remote) URLs. Default true.
     * If false, only allow same-origin / public-relative paths.
     */
    allowRemote?: boolean
    /**
     * Optional fetch init options to pass through (headers, credentials, etc).
     */
    fetchOptions?: RequestInit
}

// ===== Helper: isAbsoluteUrl =====
function isAbsoluteUrl(path: string): boolean {
    try {
        // URL constructor will throw for relative URLs
        // eslint-disable-next-line no-new
        new URL(path)
        return true
    } catch {
        return false
    }
}

// ===== Main Export =====
/**
 * Download a file programmatically and trigger the browser "Save as" dialog without navigating away.
 *
 * @param filePath - Relative path (from public/) or absolute URL to the file (e.g. '/freeguide.pdf' or 'https://…/file.pdf')
 * @param fileName - Desired filename presented to the user (e.g. 'freeguide.pdf')
 * @param opts - Optional behavior controls (progress callback, fallbacks, fetch options)
 */
export async function downloadFile(
    filePath: string,
    fileName: string,
    opts: DownloadOptions = {}
): Promise<void> {
    // ===== Defaults & Validation =====
    const {
        onProgress,
        fallbackToWindowOpen = true,
        allowRemote = true,
        fetchOptions = {}
    } = opts

    console.log(`Downloading ${fileName} at ${new Date().toISOString()}`)

    const absolute = isAbsoluteUrl(filePath)
    if (absolute && !allowRemote) {
        console.error('downloadFile: remote URLs are disabled by options.allowRemote = false')
        return
    }

    // When using a relative path, ensure it starts with a slash for consistent fetch behavior
    const url = absolute ? filePath : filePath.startsWith('/') ? filePath : `/${filePath}`

    try {
        const response = await fetch(url, fetchOptions)

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }

        // If caller wants progress and body is a stream, stream the response and report progress.
        let blob: Blob
        if (onProgress && response.body && typeof response.body.getReader === 'function') {
            const contentLengthHeader = response.headers.get('content-length')
            const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null

            const reader = response.body.getReader()
            const chunks: Uint8Array[] = []
            let loaded = 0

            // Read loop
            // eslint-disable-next-line no-constant-condition
            while (true) {
                // Read a chunk
                // eslint-disable-next-line no-await-in-loop
                const { done, value } = await reader.read()
                if (done) break
                if (value) {
                    chunks.push(value)
                    loaded += value.length
                    try {
                        onProgress(loaded, total)
                    } catch (cbErr) {
                        // Progress callback errors should not break download
                        // Keep quiet but log developer-friendly message
                        // eslint-disable-next-line no-console
                        console.warn('downloadFile: onProgress callback threw', cbErr)
                    }
                }
            }

            // Combine chunks into a blob
            // Convert Uint8Array chunks to ArrayBuffer parts to satisfy TypeScript's BlobPart[] expectation
            const bufferParts = chunks.map((c) => new Uint8Array(c).buffer)
            blob = new Blob(bufferParts)
        } else {
            // Simpler path when no progress requested or streaming not supported
            blob = await response.blob()
            if (onProgress) {
                // If total size known, call once; otherwise pass null
                const contentLengthHeader = response.headers.get('content-length')
                const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null
                try {
                    onProgress(blob.size, total)
                } catch {
                    // ignore
                }
            }
        }

        // Create temporary object URL and trigger download via hidden <a>
        const objectUrl = window.URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = objectUrl
        anchor.download = fileName || ''
        // Ensure element is not visible and won't affect layout
        anchor.style.display = 'none'
        document.body.appendChild(anchor)

        // Programmatic click - must be initiated from user gesture to avoid popup blockers.
        anchor.click()

        // Clean up
        document.body.removeChild(anchor)
        window.URL.revokeObjectURL(objectUrl)
    } catch (err) {
        console.error(`Failed to download ${fileName} from ${url}:`, err)
        // Fallback: attempt to open the file URL in a new tab/window so browser handles preview/download.
        if (fallbackToWindowOpen) {
            try {
                // window.open called as fallback of last resort; it may be blocked if not user-initiated.
                window.open(url, '_blank', 'noopener')
            } catch (openErr) {
                console.error('downloadFile: fallback window.open failed', openErr)
            }
        }
    }
}
// ===== End of File-Level Documentation =====