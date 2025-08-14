<template>
  <main class="min-h-screen p-4 max-w-4xl mx-auto">
    <!-- ===== [PROFILE IMAGE] START ===== -->
    <!-- Simple profile image with fallback for slow connections -->
    <div class="mb-8 flex justify-center">
      <div class="w-48 h-48 rounded-full overflow-hidden shadow-lg">
        <img
          v-if="!imageError"
          src="/src/assets/images/benjaminprofilepicOriginal.jpg"
          alt="Benjamin Appiah-Poku"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="imageError = true"
        />
        <!-- Fallback when image fails to load (common on slow connections) -->
        <div v-else class="w-full h-full bg-primary flex items-center justify-center text-white">
          <span class="text-4xl">👤</span>
        </div>
      </div>
    </div>
    <!-- ===== [PROFILE IMAGE] END ===== -->

    <!-- ===== [ABOUT CONTENT] START ===== -->
    <!-- Main content section -->
    <section class="space-y-6 text-center">
      <!-- Page title -->
      <h1 class="text-3xl font-bold text-primary mb-6">
        <span class="mr-2">👤</span> About Benjamin
      </h1>

      <!-- Bio paragraphs - simple and clean -->
      <div class="space-y-4 text-lg text-gray-700">
        <p class="bg-white p-4 rounded-lg shadow-sm">
          Benjamin is an entrepreneur and consultant in construction, mining, and pharmaceuticals.
        </p>

        <p class="bg-white p-4 rounded-lg shadow-sm">
          He consults on hotel developments across Africa with a background in Management, Economics, Law, and Computer Science.
        </p>

        <p class="bg-white p-4 rounded-lg shadow-sm">
          Through Stratonea Ltd, he helps businesses improve strategy, operations, and digital systems.
        </p>
      </div>

      <!-- Contact buttons with Ghana-optimized WhatsApp -->
      <div class="mt-8 space-y-4">
        <!-- Website link -->
        <a
          href="https://www.benappiahpoku.com"
          target="_blank"
          rel="noopener noreferrer"
          class=" w-full max-w-sm mx-auto px-6 py-3 text-white bg-primary hover:bg-primary-dark rounded-full transition-colors min-h-[48px] flex items-center justify-center"
        >
          🌐 Visit Website
        </a>

        <!-- WhatsApp button -->
        <button
          @click="openWhatsApp"
          class="block w-full max-w-sm mx-auto px-6 py-3 text-primary bg-white border-2 border-primary hover:bg-primary hover:text-white rounded-full transition-colors min-h-[48px]"
        >
          💬 WhatsApp Me
        </button>
      </div>
    </section>
    <!-- ===== [ABOUT CONTENT] END ===== -->
  </main>
</template>

<script setup lang="ts">
import {ref} from 'vue'
// ===== SIMPLE STATE =====
// Track if image fails to load (common on slow Ghana connections)
const imageError = ref<boolean>(false)

// ===== WHATSAPP FUNCTION =====
// Simple WhatsApp function optimized for Ghana users
function openWhatsApp(): void {
  const message = "Hi Benjamin, I'd like to connect about business consulting."
  // Using Ghana country code (+233) - replace with your actual number
  const phoneNumber = "+233" // Add your phone number here
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank')
}
</script>

<style scoped>
/* ===== SIMPLE STYLES ===== */
/* Smooth transitions for buttons */
.transition-colors {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Ensure minimum touch targets for mobile users */
button, a {
  min-height: 48px;
  min-width: 48px;
}
</style>