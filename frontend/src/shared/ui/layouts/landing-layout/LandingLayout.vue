<template>
  <!--
    Needs a z-index above the z-0 of the 3d background — and `relative`, because
    a z-index on a static box does nothing. ScrollSmoother used to supply the
    positioning as a side effect (it makes the wrapper fixed), so the stacking
    only held on the viewports where the smoother runs.
  -->
  <div id="layout" class="relative z-10 flex flex-col bg-radial">
    <slot name="header" />

    <div class="flex flex-1 flex-col" id="content">
      <!-- Top padding clears the fixed header, which is shorter on mobile. -->
      <main class="w-full pt-16 md:pt-20">
        <slot />
      </main>

      <slot name="footer" />
    </div>
  </div>
</template>
