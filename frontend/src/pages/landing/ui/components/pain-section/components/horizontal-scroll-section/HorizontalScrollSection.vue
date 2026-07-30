<template>
  <!--
    Below md this is one card in a vertical stack, so it sizes to its content.
    From md up it becomes a viewport-wide panel in the pinned horizontal row —
    min-w-full, not min-w-screen, because 100vw includes the scrollbar gutter and
    overflows.
  -->
  <article
    class="w-full page-x py-4 md:h-[100svh] md:max-w-full md:min-w-full md:pt-60 md:pb-20"
  >
    <slot />
  </article>
</template>
