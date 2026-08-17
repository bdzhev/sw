<template>
  <div id="layout" class="flex min-h-svh w-full flex-col md:flex-row">
    <slot name="navigation" />

    <main
      class="relative flex min-h-[calc(100svh-var(--spacing-mobile-bar))] w-full min-w-0 flex-1 flex-col page-x md:min-h-svh"
    >
      <slot />
    </main>
  </div>
</template>
