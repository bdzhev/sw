<template>
  <div id="layout" class="min-h-100svh flex w-full flex-col md:flex-row">
    <slot name="navigation" />

    <main class="relative w-full min-w-0 flex-1">
      <slot />
    </main>
  </div>
</template>
