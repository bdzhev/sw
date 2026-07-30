<template>
  <!--
    Two shells rather than one responsive box. Below md the *document* scrolls:
    no viewport-height container and no nested scroll container, which is what
    lets the mobile browser chrome collapse and pull-to-refresh work at all. From
    md up the shell is the viewport and `main` scrolls inside it, as before.

    `svh` rather than `vh`/`dvh`, and no `w-screen` — see rules.md §5.
  -->
  <div id="layout" class="flex min-h-[100svh] w-full flex-col md:h-[100svh] md:flex-row">
    <slot name="navigation" />

    <main class="relative w-full min-w-0 flex-1 md:h-full md:overflow-y-scroll">
      <slot />
    </main>
  </div>
</template>
