<template>
  <div id="layout" class="flex h-screen w-screen flex-row" ref="app">
    <slot name="navigation" />

    <main class="relative h-screen w-screen overflow-y-scroll">
      <slot />
    </main>
  </div>
</template>
