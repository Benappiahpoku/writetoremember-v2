<!--
  WalkthroughModal.vue
  Improved: focus-trap, keyboard (Esc/Tab) navigation, aria-live step updates,
  progress bar, smooth step transitions, and better a11y.
  - Minimal, focused changes per Stratonea guidelines.
  - All code is copy-paste ready.
-->

<template>
  <!-- ===== Modal Overlay ===== -->
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      @click.self="handleClose"
      aria-modal="true"
      role="dialog"
      :aria-labelledby="'walkthrough-title'"
      ref="overlayRef"
    >
      <!-- ===== Modal Container ===== -->
      <div
        class="bg-white rounded-stratonea shadow-2xl w-full max-w-lg mx-4 p-6 relative flex flex-col items-center animate-modal
          md:max-w-2xl"
        ref="modalRef"
      >
        <!-- Close Button (first focusable) -->
        <button
          ref="closeBtn"
          @click="handleClose"
          class="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold"
          aria-label="Close walkthrough"
        >
          &times;
        </button>

        <!-- Title -->
        <h2 id="walkthrough-title" class="text-xl font-bold text-primary mb-4 text-center w-full">
          How It Works – Step by Step
        </h2>

        <!-- Progress bar -->
        <div class="w-full mb-4" aria-hidden="false">
          <div class="h-2 bg-gray-200 rounded overflow-hidden">
            <div
              class="h-2 bg-primary transition-all duration-300"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <div class="text-xs text-gray-500 mt-2 text-center" aria-hidden="true">
            Step {{ currentStep + 1 }} of {{ steps.length }}
          </div>
        </div>

        <!-- ===== Step Content with smooth transition & aria-live ===== -->
        <div class="w-full">
          <transition name="step" mode="out-in">
            <div :key="currentStep" class="flex gap-4 items-start" >
              <!-- Numeric badge -->
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-white text-lg font-bold">
                  {{ currentStep + 1 }}
                </div>
              </div>

              <!-- Text block -->
              <div class="flex-1">
                <h3 class="font-semibold text-primary text-lg mb-1">
                  {{ steps[currentStep].title }}
                </h3>
                <p class="text-gray-700 text-base mb-2">
                  {{ steps[currentStep].description }}
                </p>

                <!-- aria-live region: announces step changes for screen readers -->
                <div class="sr-only" role="status" aria-live="polite">
                  {{ steps[currentStep].title }}. {{ steps[currentStep].description }}
                </div>
              </div>

              <!-- Decorative icon (FontAwesome) kept small visual only -->
              <div class="hidden md:flex items-center justify-center w-20 h-20 bg-gray-100 rounded-lg">
                <FontAwesomeIcon :icon="steps[currentStep].icon" class="text-3xl text-secondary" aria-hidden="true" />
              </div>
            </div>
          </transition>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center w-full mt-6 gap-2">
          <button
            ref="backBtn"
            @click="prevStep"
            :disabled="currentStep === 0"
            :aria-disabled="currentStep === 0 ? 'true' : 'false'"
            class="bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-stratonea shadow transition active:scale-95 min-w-[48px] disabled:opacity-50"
          >
            Back
          </button>

          <div class="flex items-center gap-2">
            <button
              v-if="!isLastStep"
              @click="nextStep"
              class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-stratonea shadow transition active:scale-95 min-w-[48px]"
            >
              Next
            </button>

            <button
              v-else
              @click="handleClose"
              class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-stratonea shadow transition active:scale-95 min-w-[48px]"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// WalkthroughModal.vue - improved accessibility and UX
// - Focus trap (Tab / Shift+Tab) while modal open
// - Esc closes modal
// - Aria-live announces step content changes
// - Progress bar and smooth step transitions
// - Minimal, focused implementation per Stratonea guidelines

// ===== Imports =====
import { ref, watch, computed, onBeforeUnmount, nextTick } from 'vue'
import { FontAwesomeIcon } from '@/plugins/fontawesome'

// ===== Props & Emits =====
const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// ===== Step Data =====
const steps = [
  { title: 'Open Your Notebook', description: 'Start by finding the topic you want to study.', icon: ['fas', 'book-open'] },
  { title: 'Turn Notes Into Questions', description: "Example: 'The capital of Ghana is ___?'", icon: ['fas', 'question'] },
  { title: 'Answer Without Looking', description: 'Test your memory before checking the answer.', icon: ['fas', 'brain'] },
  { title: 'Write Wrong Answers 10 Times', description: 'Reinforce memory with repetition.', icon: ['fas', 'pencil'] },
  { title: 'Repeat Until Correct', description: 'Move on only when you get it right.', icon: ['fas', 'check-circle'] },
  { title: 'Use Your Textbook Too', description: 'Do the same with textbook questions.', icon: ['fas', 'book'] }
]

// ===== State =====
const currentStep = ref(0)
const modalRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
const backBtn = ref<HTMLButtonElement | null>(null)

// ===== Computed =====
const isLastStep = computed(() => currentStep.value === steps.length - 1)
const progressPercentage = computed(() => Math.round(((currentStep.value + 1) / steps.length) * 100))

// ===== Focus trap helpers =====
// Initialize onKeyDown to point at the real handler to avoid an unused parameter.
// The handleKeydown function is declared below (function declaration is hoisted), so this is safe.
let onKeyDown: (e: KeyboardEvent) => void = handleKeydown
function getFocusableElements(container: HTMLElement | null) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.show) return
  // Close on Escape
  if (e.key === 'Escape') {
    e.preventDefault()
    handleClose()
    return
  }

  // Focus trap on Tab / Shift+Tab
  if (e.key === 'Tab') {
    const focusable = getFocusableElements(modalRef.value)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (e.shiftKey) {
      // Shift + Tab
      if (active === first || active === modalRef.value) {
        e.preventDefault()
        last.focus()
      }
    } else {
      // Tab
      if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
}

// ===== Navigation =====
function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

// ===== Close logic =====
function handleClose() {
  emit('close')
  currentStep.value = 0
}

// ===== Watchers & lifecycle =====
watch(() => props.show, async (val) => {
  if (val) {
    // Modal opened: focus first control and bind keydown
    await nextTick()
    // focus close button if available
    if (closeBtn.value) closeBtn.value.focus()
    onKeyDown = handleKeydown
    window.addEventListener('keydown', onKeyDown)
    // prevent background scroll
    document.body.style.overflow = 'hidden'
  } else {
    // Modal closed: cleanup
    window.removeEventListener('keydown', onKeyDown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ===== Modal Animations & Step Transition ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

/* Slide transition for step content */
.step-enter-active,
.step-leave-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.step-enter-from {
  transform: translateX(8px);
  opacity: 0;
}
.step-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.step-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.step-leave-to {
  transform: translateX(-8px);
  opacity: 0;
}

/* Subtle modal scale in */
.animate-modal {
  animation: modalIn 0.24s cubic-bezier(0.2, 0, 0, 1);
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Small helpers */
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}
</style>