<template>
  <!-- Need z-index to be higher than the z-0 of the 3d background -->
  <div id="layout" class="z-10 flex flex-col bg-radial">
    <slot name="header" />

    <div class="flex flex-1 flex-col" id="content">
      <main class="h-[screen] w-full pt-20">
        <slot />
      </main>

      <slot name="footer" />
    </div>
  </div>
</template>
