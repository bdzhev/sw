<template>
  <!-- `svh`, not `vh`, plus a gutter so the card is not edge-to-edge on a phone. -->
  <div class="grid min-h-[100svh] place-items-center page-x py-8">
    <slot />
  </div>
</template>
