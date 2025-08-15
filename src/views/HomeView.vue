<template>
  <main class="bg-gray-50 min-h-screen flex flex-col items-center pb-12">
    <!-- ===== Hero Section ===== -->
    <section
      class="w-full max-w-4xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 px-4 py-10"
      aria-labelledby="hero-title"
    >
      <!-- ===== Video / Lazy Embed (mobile-first) ===== -->
      <div class="w-full md:w-1/2">
        <div class="relative rounded-lg overflow-hidden shadow-md">
          <button
            ref="videoPlayBtn"
            v-if="!videoPlaying"
            @click="playVideo"
            @keydown.enter.prevent="playVideo"
            @keydown.space.prevent="playVideo"
            class="relative block w-full text-left focus:outline-none"
            :aria-label="`Play video: ${videoTitle}`"
            aria-pressed="false"
            type="button"
          >
            <picture>
              <source :srcset="thumbnailMaxres" type="image/jpeg" />
              <img
                :src="thumbnail"
                :alt="videoTitle + ' preview'"
                class="w-full h-auto object-cover block transition-transform duration-500 ease-out"
                :class="thumbnailLoaded ? 'blur-0 scale-100' : 'blur-sm scale-105'"
                loading="lazy"
                width="1280"
                height="720"
                @load="onThumbnailLoad"
              />
            </picture>

            <div class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span class="flex items-center justify-center h-16 w-16 rounded-full bg-red-600 shadow-lg">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </div>
          </button>

          <div v-else class="w-full aspect-w-16 aspect-h-9">
            <iframe
              :src="embedUrl"
              :title="videoTitle"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
              allowfullscreen
              class="w-full h-64 md:h-full"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- ===== Hero Text & Actions ===== -->
      <div class="w-full md:w-1/2 flex flex-col items-start justify-center gap-4">
        <h1 id="hero-title" class="text-2xl md:text-3xl font-bold text-primary-dark leading-tight">
          Write to Remember – The Easiest Way to Study
        </h1>

        <p class="text-gray-700 text-base md:text-lg max-w-prose">
          A simple, fun method for kids and parents to study smarter.
          Turn notes into short questions, test memory, and lock learning with repetition.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 mt-3 w-full items-center sm:items-start justify-center sm:justify-start">
          <button
            ref="howItWorksBtn"
            @click="openWalkthrough"
            @click.prevent="trackEvent('how_it_works_clicked')"
            class="btn-touch inline-flex items-center justify-center bg-primary text-white font-semibold py-3 px-8 rounded-stratonea shadow-md hover:bg-primary-hover focus:ring-2 focus:ring-primary/30 transition"
            :aria-expanded="isWalkthroughOpen"
            aria-controls="walkthrough-modal"
            type="button"
          >
            How It Works
          </button>

          <!-- ===== [New Feature] START: use openPdf handler for reliable mobile behavior ===== -->
          <button
            @click="openPdf"
            class="inline-flex items-center justify-center border border-primary text-primary bg-white hover:bg-primary/5 font-semibold py-3 px-6 rounded-stratonea shadow-sm focus:ring-2 focus:ring-primary/20 transition"
            aria-label="Download Free Guide"
            type="button"
          >
            Download Free Guide
          </button>
          <!-- ===== [New Feature] END ===== -->
        </div>
      </div>
    </section>

    <!-- ===== Features Section ===== -->
    <div ref="featuresWrap" :class="featuresInView ? 'features-inview' : ''" class="w-full">
      <FeatureSection />
    </div>

    <DownloadPDF />

    <!-- ===== Walkthrough Modal ===== -->
    <WalkthroughModal id="walkthrough-modal" :show="isWalkthroughOpen" @close="closeWalkthrough" />
  </main>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// HomeView.vue - hero with robust YouTube thumbnail resolution and polling.
// Small reliability change: use openPdf() to open the free guide using window.open on user click,
// avoiding inconsistent download behavior on iOS browsers.

// ===== Imports =====
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import WalkthroughModal from '@/components/layout/WalkthroughModal.vue'
import FeatureSection from '@/components/layout/FeatureSection.vue'
import DownloadPDF from '@/components/layout/DownloadPDF.vue'

// ===== Constants & Config =====
const pdfFileName = 'freeguide.pdf'
const pdfUrl = `${import.meta.env.BASE_URL || '/'}${pdfFileName}`

const videoId = 'FhjKcZF6FXc'
const videoTitle = 'Write to Remember – The Simple Study Trick That Works'

// Polling config
const POLL_INTERVAL_MS = 30_000
const MAX_POLL_ATTEMPTS = 5

// ===== Reactive State =====
const isWalkthroughOpen = ref(false)
const videoPlaying = ref(false)
const thumbnailLoaded = ref(false)

// Refs for focus management and IntersectionObserver
const howItWorksBtn = ref<HTMLElement | null>(null)
const videoPlayBtn = ref<HTMLElement | null>(null)
const featuresWrap = ref<HTMLElement | null>(null)
const featuresInView = ref(false)
let featuresObserver: IntersectionObserver | null = null

// ===== Thumbnail resolver state =====
const thumbnailUrl = ref<string>(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
let pollTimer: number | null = null
let pollAttempts = 0

// Exposed computed values
const thumbnail = computed(() => thumbnailUrl.value)
const thumbnailMaxres = computed(() => thumbnailUrl.value)
const embedUrl = computed(() => `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`)

// ===== Helper: check if image exists and looks valid =====
async function imageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      // Consider image valid only if naturalWidth is reasonable (avoids tiny gray placeholders)
      resolve(Boolean(img.naturalWidth && img.naturalWidth > 80))
    }
    img.onerror = () => resolve(false)
    img.src = url
  })
}

// ===== Resolve best available thumbnail (tries common YouTube names) =====
async function resolveBestThumbnail(id: string): Promise<string> {
  const immediateVariants = ['hqdefault', 'mqdefault', 'sddefault', 'default']
  for (const v of immediateVariants) {
    const url = `https://i.ytimg.com/vi/${id}/${v}.jpg`
    // eslint-disable-next-line no-await-in-loop
    if (await imageExists(url)) {
      thumbnailUrl.value = url
      return v
    }
  }
  thumbnailUrl.value = `https://i.ytimg.com/vi/${id}/default.jpg`
  return 'default'
}

// ===== Polling: periodically check for maxresdefault and update if available =====
function startThumbnailPolling(id: string) {
  if (pollTimer != null) return
  pollAttempts = 0
  pollTimer = window.setInterval(async () => {
    pollAttempts += 1
    const maxUrl = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    try {
      if (await imageExists(maxUrl)) {
        thumbnailUrl.value = maxUrl
        stopThumbnailPolling()
      } else if (pollAttempts >= MAX_POLL_ATTEMPTS) {
        stopThumbnailPolling()
      }
    } catch {
      if (pollAttempts >= MAX_POLL_ATTEMPTS) stopThumbnailPolling()
    }
  }, POLL_INTERVAL_MS)
}

function stopThumbnailPolling() {
  if (pollTimer != null) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

// ===== Analytics (minimal hook) =====
function trackEvent(eventName: string, payload: Record<string, any> = {}) {
  console.log('[analytics]', eventName, payload)
  if (typeof (window as any).__trackEvent === 'function') {
    ;(window as any).__trackEvent(eventName, payload)
  }
}

// ===== Methods =====
function onThumbnailLoad() {
  thumbnailLoaded.value = true
}

function playVideo() {
  videoPlaying.value = true
  trackEvent('video_played', { videoId })
  nextTick(() => {})
}

function openWalkthrough() {
  isWalkthroughOpen.value = true
  trackEvent('walkthrough_opened')
}

function closeWalkthrough() {
  isWalkthroughOpen.value = false
  nextTick(() => {
    if (howItWorksBtn.value) howItWorksBtn.value.focus()
  })
}

// ===== [New Feature] START: reliable PDF opener =====
function openPdf() {
  try {
    window.open(pdfUrl, '_blank', 'noopener')
  } catch {
    window.location.href = pdfUrl
  }
}
// ===== [New Feature] END =====

// ===== Lifecycle: resolve thumbnail, start polling if needed; autoplay muted on mount =====
onMounted(async () => {
  try {
    const chosen = await resolveBestThumbnail(videoId)
    if (chosen !== 'maxresdefault') {
      startThumbnailPolling(videoId)
    }
  } catch {
    // ignore
  }

  // autoplay muted on visit (browser permitting)
  videoPlaying.value = true

  // FeatureSection entrance observer
  if ('IntersectionObserver' in window && featuresWrap.value) {
    featuresObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            featuresInView.value = true
            featuresObserver?.disconnect()
          }
        })
      },
      { root: null, threshold: 0.12 }
    )
    featuresObserver.observe(featuresWrap.value)
  } else {
    featuresInView.value = true
  }
})

onBeforeUnmount(() => {
  stopThumbnailPolling()
  if (featuresObserver) {
    featuresObserver.disconnect()
    featuresObserver = null
  }
})
</script>

<style scoped>
/* Preserve 16:9 aspect for iframe container before iframe loads */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
}
.aspect-w-16 iframe,
.aspect-w-16>* {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Touch target helper */
.btn-touch {
  min-height: 3rem;
  min-width: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Blur-up visual helpers for thumbnail */
img.blur-sm {
  filter: blur(6px);
  transform: scale(1.03);
}
img.blur-0 {
  filter: blur(0);
  transform: scale(1);
}

/* FeatureSection entrance animation */
.features-inview .max-w-4xl>section article,
.features-inview article {
  opacity: 1;
  transform: translateY(0);
}

/* Default (hidden) state for feature cards */
.max-w-3xl .max-w-4xl>section article,
.max-w-4xl section article,
article {
  transition: transform 380ms cubic-bezier(.2,.9,.2,1), opacity 380ms ease;
  opacity: 0;
  transform: translateY(12px);
}

/* Staggering */
.features-inview .max-w-4xl>section article:nth-child(1),
.features-inview article:nth-child(1) { transition-delay: 40ms; }
.features-inview .max-w-4xl>section article:nth-child(2),
.features-inview article:nth-child(2) { transition-delay: 120ms; }
.features-inview .max-w-4xl>section article:nth-child(3),
.features-inview article:nth-child(3) { transition-delay: 200ms; }

/* Modal animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>