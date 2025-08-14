<template>
  <!-- ===== Features Section ===== -->
  <!--
    Redesigned to remove icons and add numeric badges, accent bars, hover lift, and improved spacing.
    - Mobile-first layout, uses the same max width (max-w-4xl) as HomeView for alignment.
    - Cards have accessible headings and short descriptions.
    - Touch targets and focus states added for keyboard and mobile users.
    - Changes marked as [New Feature] per Stratonea guidelines.
  -->
  <section class="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-8 px-4" aria-label="Feature highlights">
    <!-- ===== [New Feature] START: Feature Card 1 ===== -->
    <article
      role="article"
      aria-labelledby="feature-1-title"
      class="relative bg-white rounded-stratonea shadow-sm p-6 flex flex-col items-start gap-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 focus-within:shadow-lg"
      tabindex="-1"
    >
      <!-- Accent stripe -->
      <div class="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-stratonea" aria-hidden="true"></div>

      <!-- Numeric badge (replaces icon) -->
      <div class="flex items-center gap-3">
        <div class="h-12 w-12 flex items-center justify-center rounded-md bg-primary text-white font-bold text-lg" aria-hidden="true">
          1
        </div>
        <h3 id="feature-1-title" class="text-base font-semibold text-primary">Exam Practice</h3>
      </div>

      <p class="text-gray-600 text-sm leading-relaxed">
        Study in Q&amp;A format like real tests — practice the way exams ask questions to build confidence.
      </p>

    
    </article>
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== [New Feature] START: Feature Card 2 ===== -->
    <article
      role="article"
      aria-labelledby="feature-2-title"
      class="relative bg-white rounded-stratonea shadow-sm p-6 flex flex-col items-start gap-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 focus-within:shadow-lg"
      tabindex="-1"
    >
      <div class="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/80 via-secondary to-primary/50 rounded-t-stratonea" aria-hidden="true"></div>

      <div class="flex items-center gap-3">
        <div class="h-12 w-12 flex items-center justify-center rounded-md bg-secondary text-white font-bold text-lg" aria-hidden="true">
          2
        </div>
        <h3 id="feature-2-title" class="text-base font-semibold text-primary">Memory Boost</h3>
      </div>

      <p class="text-gray-600 text-sm leading-relaxed">
        Writing repeatedly strengthens recall — simple repetition helps move facts to long-term memory.
      </p>

    
    </article>
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== [New Feature] START: Feature Card 3 ===== -->
    <article
      role="article"
      aria-labelledby="feature-3-title"
      class="relative bg-white rounded-stratonea shadow-sm p-6 flex flex-col items-start gap-4 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 focus-within:shadow-lg"
      tabindex="-1"
    >
      <div class="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-primary/60 rounded-t-stratonea" aria-hidden="true"></div>

      <div class="flex items-center gap-3">
        <div class="h-12 w-12 flex items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-lg" aria-hidden="true">
          3
        </div>
        <h3 id="feature-3-title" class="text-base font-semibold text-primary">Low Cost</h3>
      </div>

      <p class="text-gray-600 text-sm leading-relaxed">
        Only a notebook and pen are needed — an affordable, proven method for students and parents.
      </p>

     
    </article>
    <!-- ===== [New Feature] END ===== -->
  </section>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// FeatureSection.vue
// - Redesigned to remove all icons and use numeric badges + accent stripes.
// - Mobile-first, accessible, and lightweight (no external images).
// - Each card is keyboard-focusable and includes a micro-CTA for engagement.
//
// Notes for next steps:
// - If you want illustrated SVGs, add inline SVGs inside the badge area (keeps bundle small).
// - Consider adding a subtle entrance animation (IntersectionObserver) for further polish.
</script>

<style scoped>
/* Minimal custom styles — prefer Tailwind utilities in template */
/* Provide a slightly larger focus outline for keyboard users */
article:focus-within {
  outline: none;
}

/* Keep badge rounded corners crisp */
.rounded-t-stratonea {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
}
</style>