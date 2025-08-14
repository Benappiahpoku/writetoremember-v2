<template>
  <!--
    Footer.vue
    - Visual consistency: uses FeatureSection / DownloadPDF card vocabulary (accent stripe, badge).
    - Primary purpose: Download Poster CTA (opens WalkthroughModal) and WhatsApp feedback (no donations).
    - Changes:
      - Download Poster button now matches HomeView "How It Works" button styling and behavior.
      - Download button opens the WalkthroughModal and restores focus on close.
      - Accessibility attributes (aria-expanded / aria-controls) added.
      - All changes marked with [New Feature]
  -->
  <footer class="w-full bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <article role="contentinfo" aria-labelledby="footer-title"
        class="relative bg-white rounded-stratonea shadow-sm p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-all duration-200">
        <!-- Accent stripe to tie visually with FeatureSection -->
        <div class="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-stratonea"
          aria-hidden="true"></div>

        <!-- Badge + Title -->
        <div class="flex items-center gap-3">


          <div class="text-left">
            <h3 id="footer-title" class="text-lg  text-center font-semibold text-primary">Write to Remember — Free for
              children</h3>
            <p class="text-gray-600 text-sm text-center">A simple method for kids and parents to study smarter. Feedback
              helps us improve — thank you for supporting this free resource.</p>
          </div>
        </div>

        <!-- Buttons: vertical on mobile, horizontal on md+ -->
        <div class="w-full mt-2 flex flex-col md:flex-row items-center justify-center gap-3">

          <!-- Secondary: WhatsApp feedback (no donations) -->
          <a :href="whatsAppFeedbackLink" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center justify-center border border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 font-semibold py-3 px-6 rounded-stratonea shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[160px] text-center"
            aria-label="Send feedback via WhatsApp">
            Send Feedback (WhatsApp)
          </a>
          <!-- ===== [New Feature] START: Match HomeView How It Works button & open modal ===== -->
          <button ref="downloadBtn" @click="openWalkthrough"
            class="btn-touch inline-flex items-center justify-center bg-primary text-white font-semibold py-3 px-8 rounded-stratonea shadow-md hover:bg-primary-hover focus:ring-2 focus:ring-primary/30 transition"
            :aria-expanded="isWalkthroughOpen" aria-controls="walkthrough-modal" type="button">
            How it Works
          </button>
          <!-- ===== [New Feature] END ===== -->


        </div>

        <!-- Credit line + Ghana flag -->
        <div class="w-full flex flex-col md:flex-row items-center justify-between gap-3 mt-4 text-gray-500 text-sm">
          <div class="flex items-center gap-2">
            <!-- Ghana flag (inline emoji keeps asset-free) -->
            <span role="img" aria-label="Ghana flag" class="text-lg">🇬🇭</span>
            <span>Free for children — feedback welcome</span>
          </div>

          <div class="text-right">
            <span>Created by TekLumin</span>
            <span class="mx-2">•</span>
            <a href="https://teklumin.com" class="text-primary hover:underline" target="_blank"
              rel="noopener noreferrer">TekLumin</a>
          </div>
        </div>
      </article>
    </div>

    <!-- Walkthrough modal instance local to footer (opens when user clicks Download Poster) -->
    <WalkthroughModal id="walkthrough-modal" :show="isWalkthroughOpen" @close="closeWalkthrough" />
  </footer>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// Footer.vue - updated to open WalkthroughModal from footer "Download Poster" button.
// - Restores focus to the triggering button after modal close.
// - Matches HomeView How It Works button styles and accessibility attrs.
// - Minimal, focused changes per Stratonea guidelines.

// ===== Imports =====
import { ref, nextTick } from 'vue'
import WalkthroughModal from '@/components/layout/WalkthroughModal.vue'
import { computed } from 'vue'

// ===== State =====
const isWalkthroughOpen = ref(false)
const downloadBtn = ref<HTMLElement | null>(null)

// WhatsApp feedback link: opens chat composer. Message is simple and focused on feedback.
const whatsAppFeedbackLink = computed(() => {
  const message = encodeURIComponent(`Hi — I'd like to share feedback about the "Write to Remember" poster and site.`)
  return `https://wa.me/?text=${message}`
})

// ===== Methods =====
/**
 * Open the walkthrough modal (used here as a lightweight "how to use / download" flow).
 * Keeping logic minimal: modal handles its own focus trap; footer restores focus on close.
 */
function openWalkthrough() {
  isWalkthroughOpen.value = true
}

/**
 * Close handler for WalkthroughModal: restore focus to the triggering button.
 */
function closeWalkthrough() {
  isWalkthroughOpen.value = false
  nextTick(() => {
    if (downloadBtn.value) downloadBtn.value.focus()
  })
}
</script>

<style scoped>
/* Keep small helpers local — majority styling via Tailwind utilities */

/* Consistent top stripe rounding used across components */
.rounded-t-stratonea {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

/* Ensure comfortable touch target width on small screens */
@media (max-width: 767px) {
  .min-w-\[160px\] {
    min-width: 160px;
  }
}

/* Touch target helper reused across project (keeps button sizes consistent) */
.btn-touch {
  min-height: 3rem;
  min-width: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>