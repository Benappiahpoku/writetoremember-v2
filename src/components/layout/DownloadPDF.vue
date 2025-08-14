<template>
  <!--
    DownloadPDF.vue
    - Responsive download card for free poster/guide.
    - Uses FeatureSection visual pattern: accent stripe, numeric/letter badge, hover lift.
    - Buttons stack vertically on mobile and align horizontally on md+.
    - No analytics (per request).
    - All changes marked with [New Feature].
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
      <!-- ===== [New Feature] START: responsive buttons ===== -->
      <div class="w-full mt-2 flex flex-col md:flex-row items-center justify-center gap-3">
        <!-- Primary: Download (filled) -->
        <a
          :href="pdfUrl"
          download
          class="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-stratonea shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[160px] text-center"
          aria-label="Download printable poster"
        >
          Download Poster
        </a>

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
      <!-- ===== [New Feature] END ===== -->
    </article>
  </section>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// DownloadPDF.vue - compact, mobile-first download card for the free poster
// - Mirrors FeatureSection visual language (accent stripe + badge)
// - Buttons stack vertically on small screens and display horizontally on md+
// - No analytics instrumentation per request

// ===== Imports & Helpers =====
import { computed } from 'vue'

// ===== Constants & Config =====
const pdfUrl = '/freeguide.pdf' // public path to poster/pdf

// WhatsApp share link: opens chat composer with pre-filled message
const whatsAppShareLink = computed(() => {
  const message = encodeURIComponent(`Get the Write to Remember free poster — download: ${location.origin}${pdfUrl}`)
  return `https://wa.me/?text=${message}`
})
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