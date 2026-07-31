<template>
  <div id="layout" class="flex min-h-[100svh] flex-col bg-radial">
    <!-- `h-[screen]` was here: not a Tailwind value, so it emitted an invalid
         declaration and did nothing. Content height is what is wanted. -->
    <main class="w-full pt-12 md:pt-20">
      <slot />
    </main>
  </div>
</template>
