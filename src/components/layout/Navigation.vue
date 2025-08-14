<template>
  <!-- ===== Stratonea App Header (redesigned to match site feel) ===== -->
  <nav class="w-full shadow">
    <!-- ===== [New Feature] START: gradient background, larger header, pill active state, micro-interactions ===== -->
    <div class="bg-gradient-to-r from-primary to-secondary">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Row: mobile-first -->
        <div class="flex items-center justify-between py-4 md:py-5">
          <!-- LEFT: Logo + app name (kept as before) -->
          <router-link to="/" class="flex items-center gap-3">
            <StratoneaLogo white class="h-8 md:h-10 w-auto" />
            <span class="text-white text-lg md:text-xl font-semibold tracking-wide">Stratonea Study Tip</span>
          </router-link>

          <!-- RIGHT: Desktop nav + Mobile menu button -->
          <div class="flex items-center space-x-3">
            <!-- Desktop Navigation (right-aligned) -->
            <div class="hidden sm:flex sm:items-center sm:space-x-3">
              <router-link
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                
                class="inline-flex items-center text-white text-base font-medium transition transform duration-150 hover:translate-y-[-2px] px-4 py-2 rounded-full hover:bg-white/10"
                :class="{
                  /* Active state: use same rounded/pill geometry + subtle highlight & shadow */
                  'bg-white/20 shadow-sm': $route.path === item.path
                }"
                :aria-current="$route.path === item.path ? 'page' : undefined"
              >
                {{ item.name }}
              </router-link>
            </div>

            <!-- Mobile menu button (keeps same semantics, visually updated) -->
            <div class="sm:hidden">
              <button
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/25"
                aria-controls="mobile-menu"
                :aria-expanded="isMobileMenuOpen"
                aria-label="Toggle navigation"
              >
                <span class="sr-only">Open main menu</span>
                <svg v-if="!isMobileMenuOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== Mobile menu (slide + fade) ===== -->
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-150 transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div v-show="isMobileMenuOpen" class="sm:hidden bg-primary-700">
        <div class="max-w-4xl mx-auto px-4 py-3 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-600 transition-colors"
            :class="{ 'bg-primary-600': $route.path === item.path }"
            @click="isMobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// Navigation.vue - redesigned header to better match site feel
// - Visual updates only: gradient background, larger header, pill-shaped active nav item,
//   hover lift micro-interactions, animated mobile menu.
// - Content and element positions preserved (logo left, nav right).
// - Mobile-first and Tailwind-first: styling via utility classes for clarity.

// ===== Imports =====
import { ref } from 'vue'
import StratoneaLogo from '@/components/base/StratoneaLogo.vue'

// ===== State =====
/* Mobile menu open state */
const isMobileMenuOpen = ref(false)

// ===== Navigation items (kept as existing) =====
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
]
</script>
<style scoped>
/* ===== Local helpers =====
   Keep most styling in Tailwind utilities. Small CSS here supports micro-interaction compatibility.
*/

/* Tailwind does not support hover:translate-y-[-2px] in some setups; provide a safe utility fallback */
@media (hover: hover) {
  .hover\:translate-y-\[-2px\]:hover {
    transform: translateY(-0.125rem);
  }
}

/* Slight shadow to separate header from content */
nav {
  /* lightweight shadow is applied via utility but reinforce in CSS fallback */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}
</style>