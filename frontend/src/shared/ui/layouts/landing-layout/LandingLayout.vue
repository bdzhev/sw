<template>
  <div id="layout" class="relative z-10 flex flex-col bg-radial">
    <slot name="header" />

    <div class="flex flex-1 flex-col" id="content">
      <main class="w-full pt-16 md:pt-20">
        <slot />
      </main>

      <slot name="footer" />
    </div>
  </div>
</template>
