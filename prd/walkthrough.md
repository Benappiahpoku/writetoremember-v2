# PRD – WalkthroughModal.vue

1. Purpose

The WalkthroughModal.vue component provides a guided, interactive explanation of the “Write to Remember” method. It is meant to be simple enough for kids to follow, visually appealing for parents, and impressive for clients.

Goals & Success Criteria

Goals:

Clearly explain each step of the “Write to Remember” method.

Be easy to use and navigate (Back/Next buttons).

Use icons & illustrations to make steps engaging.

Fit seamlessly into HomeView.vue with TailwindCSS styling and Stratonea brand colors.

Success Criteria:

Users can easily understand the process without reading long paragraphs.

Modal opens with smooth animation.

Works on desktop & mobile with full responsiveness.

Steps have visual cues (icons, numbers, illustrations).

Key Features

Triggering the Modal

Button in HomeView.vue labeled: "See How It Works"

On click → modal appears (fade + scale animation).

Modal Layout

Header:

Title: "How It Works – Step by Step"

Close button (X) in top-right.

Body:

Six steps, each with:

Step number in a circle (icon or text).

Short headline (max 6 words).

One-sentence description.

Placeholder illustration/icon.

Footer Navigation:

"Back" button (disabled on step 1).

"Next" button (disabled on final step).

"Got It" button on final step.

Navigation Logic

Steps stored in an array for easy iteration.

Clicking “Next” moves forward, “Back” moves backward.

Closing modal resets step to 1.

Animations

Modal appears with fade-in and scale-up transition.

Step transitions with slide left/right.

Branding & Style

Colors from tailwind.config.js (primary.600 for main, secondary.500 for highlights).

Rounded edges (rounded-stratonea).

Shadows for depth (shadow-lg).

Friendly typography (font-semibold headlines, text-gray-600 descriptions).

Technical Requirements

Props:

show (Boolean): Controls visibility.

Events:

@close: Emitted when modal is closed.

State Variables:

currentStep (Number) → Active step index.

steps (Array) → Step data (title, description, icon).

Dependencies:

TailwindCSS (already in project).

Font Awesome (for step icons & close button).

Step Content (Example Data)
[
  {
    title: "Open Your Notebook",
    description: "Start by finding the topic you want to study.",
    icon: "fa-solid fa-book-open"
  },
  {
    title: "Turn Notes Into Questions",
    description: "Example: 'The capital of Ghana is ___?'",
    icon: "fa-solid fa-question"
  },
  {
    title: "Answer Without Looking",
    description: "Test your memory before checking the answer.",
    icon: "fa-solid fa-brain"
  },
  {
    title: "Write Wrong Answers 10 Times",
    description: "Reinforce memory with repetition.",
    icon: "fa-solid fa-pencil"
  },
  {
    title: "Repeat Until Correct",
    description: "Move on only when you get it right.",
    icon: "fa-solid fa-check-circle"
  },
  {
    title: "Use Your Textbook Too",
    description: "Do the same with textbook questions.",
    icon: "fa-solid fa-book"
  }
]

Responsive Behavior

Desktop:

Modal centered, 60% width, 80% height.

Step layout: icon + text side-by-side.

Mobile:

Modal full-width, 90% height.

Step layout: icon above text (stacked vertically).

Future Enhancements

Add audio narration for each step.

Include embedded short animations instead of static illustrations.

Add progress indicator bar at top.
