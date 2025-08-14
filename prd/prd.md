# **Product Requirements Document (PRD)**

## **1. Purpose**

The goal is to create a **modern, fun, and interactive one-page learning website** for the “Write to Remember” method, appealing to both **kids** and **parents** while remaining professional enough to impress educational stakeholders and clients. The site will present:

* A **hero section** with a clear title, explainer text, and embedded YouTube animation (desktop: text left, video right; mobile: video top, text below).
* A **"How It Works" Walkthrough Modal** with an animated, step-by-step guide.
* A **downloadable PDF** resource for offline study.
* Simple **feature highlights** to explain benefits of the method.

---

## **2. Components Overview**

### **A. HomeView\.vue**

**Role:** Main landing page with all primary elements.

#### **Sections & Features**

1. **Hero Section**

   * **Desktop layout:**

     * Left: Headline, subtext, action buttons.
     * Right: Placeholder for animation/video embed (YouTube).
   * **Mobile layout:**

     * Video appears first.
     * Headline and text follow below.
   * **Buttons:**

     * “How it Works” → Opens walkthrough modal.
     * “Download Free Guide” → Triggers PDF download.

2. **Features Section**

   * Three **card-style feature blocks** with icons and short descriptions.
   * **Icons:** Placeholder illustrations (later replaced with relevant icons/graphics).
   * Hover states for slight visual feedback.

3. **Downloadable PDF Section**

   * Button triggers download of `/free-guide.pdf` from `/public` directory.

4. **Walkthrough Modal Integration**

   * Controlled via `isWalkthroughOpen` boolean in `data()`.
   * Opens with smooth fade/scale animation.
   * Closes via "X" button or backdrop click.

---

### **B. WalkthroughModal.vue**

**Role:** Provide an engaging, visual explanation of the “Write to Remember” method.

#### **Modal Requirements**

* **Style:** Modern, clean, playful for kids but professional enough for parents.
* **Animation:** Smooth entry (fade & scale-up). Smooth exit (fade & scale-down).
* **Layout:**

  * Title at the top.
  * Step-by-step visual guide using Font Awesome icons or placeholder images.
  * Each step has a short headline and 1–2 sentences of explanation.
  * Bottom has “Got it!” or “Close” button in **primary Stratonea blue**.

#### **Steps Content**

1. **Open Your Notebook** – Find the topic you want to study.
2. **Turn Notes into Questions** – Example: “The capital of Ghana is \_\_\_?”
3. **Answer Without Looking** – Try it from memory.
4. **Write Wrong Answers 10 Times** – Helps lock it in.
5. **Repeat Until Correct** – Move to the next question only when right.
6. **Use Your Textbook Too** – Reinforce from multiple sources.

---

## **3. Design Requirements**

* **Color Palette:** Use Stratonea brand colors from Tailwind config (`primary`, `secondary`, `gray`).
* **Typography:** Clear, large headings for readability.
* **Spacing:** Comfortable touch targets for Ghanaian mobile users (3–4rem min).
* **Responsiveness:** Fully mobile-optimized, tablet-friendly, and desktop-optimized.
* **Illustrations:** Fun and lighthearted — placeholder images until final assets ready.
* **Buttons:** Rounded corners (`stratonea` radius), shadows, hover effects.

---

## **4. Technical Requirements**

* **Framework:** Vue.js 3 (Composition API optional, using Options API in current example).
* **Styling:** Tailwind CSS (as per provided config).
* **Icons:** Font Awesome placeholders (replaceable later).
* **PDF Download:** Uses an `<a>` element in JS to trigger file download.
* **Animation:** Tailwind `transition`, `transform`, `opacity` utilities for modal effects.

---

## **5. User Flow**

1. User lands on homepage.
2. **Mobile:** Sees video first → scrolls to text → sees features → CTA buttons.
3. **Desktop:** Sees text left, video right.
4. Clicks “How it Works” → Modal opens with interactive steps.
5. Clicks “Download Free Guide” → PDF downloads.
6. Closes modal → returns to homepage.

---

## **6. Success Metrics**

* High engagement rate (modal opens frequently).
* Increased PDF downloads (tracked in analytics).
* Positive feedback from kids, parents, and client.
