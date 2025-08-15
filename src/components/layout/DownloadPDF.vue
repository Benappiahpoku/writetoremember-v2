<template>
  <!--
    DownloadPDF.vue
    - Responsive download card for free poster/guide.
    - Uses shared downloadFile utility for reliable downloads on mobile.
  -->
  <section class="w-full max-w-2xl mx-auto py-6 px-4">
    <article
      role="article"
      aria-labelledby="download-title"
      class="relative bg-white rounded-stratonea shadow-sm p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-all duration-200"
      tabindex="0"
    >

      <!-- Badge + Title -->
      <div class="flex items-center gap-3">
        <div class="text-center">
          <h3 id="download-title" class="text-lg font-semibold text-primary">Download Free Poster</h3>
          <p class="text-gray-600 text-sm">Printable poster of the Write to Remember method — perfect for classroom or home study walls.</p>
        </div>
      </div>

      <!-- Buttons: stack on mobile, horizontal on md+ -->
      <div class="w-full mt-2 flex flex-col md:flex-row items-center justify-center gap-3">
        <!-- Primary: Download (filled) -->
        <button
          @click="openPdf"
          class="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-stratonea shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[160px] text-center"
          aria-label="Download printable poster"
          type="button"
        >
          Download Free Poster
        </button>

        <!-- Secondary: Share via WhatsApp (outlined/green) -->
        <a
          :href="whatsAppShareLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center border border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 font-semibold py-3 px-6 rounded-stratonea shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[160px] text-center"
          aria-label="Share poster via WhatsApp"
        >
          Share Poster
        </a>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// DownloadPDF.vue - compact download card that uses the shared downloadFile utility.
// Change: call downloadFile from src/utils/DownloadFile.ts to fetch+download the poster reliably.

// ===== Imports & Helpers =====
import { computed } from 'vue'
// Import the reusable utility (match filename DownloadFile.ts)
import { downloadFile } from '@/utils/DownloadFile'

// ===== Constants & Config =====
const pdfFileName = 'freeguide.pdf'
const pdfUrl = `${import.meta.env.BASE_URL || '/'}${pdfFileName}`

// WhatsApp share link: opens chat composer with pre-filled message
const whatsAppShareLink = computed(() => {
  const message = encodeURIComponent(`Get the Write to Remember free poster — download: ${location.origin}${pdfUrl}`)
  return `https://wa.me/?text=${message}`
})

// ===== [New Feature] START: reliable PDF open handler using downloadFile =====
/**
 * Use the shared downloadFile utility to download the poster without navigating away.
 * This avoids inconsistent anchor+download behavior on iOS and ensures repeated clicks work.
 */
async function openPdf() {
  try {
    await downloadFile(pdfUrl, pdfFileName, {
      fallbackToWindowOpen: true,
      allowRemote: false
    })
  } catch (err) {
    // downloadFile logs detailed errors; keep component lightweight
    // Optionally show a toast here in the future
    console.error('Download failed', err)
  }
}
// ===== [New Feature] END =====
</script>

<style scoped>
/* Minimal scoped helpers — prefer Tailwind utilities in template */

/* Keep consistent rounded top stripe used across Feature components */
.rounded-t-stratonea {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

/* Ensure min-width for buttons on small screens for comfortable touch targets */
@media (max-width: 767px) {
  .min-w-\[160px\] {
    min-width: 160px;
  }
}
</style>