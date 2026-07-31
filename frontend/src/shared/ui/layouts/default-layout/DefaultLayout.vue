<template>
  <div id="layout" class="flex min-h-[100svh] w-full flex-col md:h-[100svh] md:flex-row">
    <slot name="navigation" />

    <main class="relative w-full min-w-0 flex-1 md:h-full md:overflow-y-scroll">
      <slot />
    </main>
  </div>
</template>
