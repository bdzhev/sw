<template>
  <!--
    No `navigation` slot on purpose. App.vue passes SidebarNavigation to every
    layout, and a slot a layout never renders is never created — so the rail and
    the mobile burger are simply absent here, at every width. The sheet is a
    focused surface: its own header carries the one way out, back to the
    dashboard. That is also why the main element takes the full svh rather than
    subtracting --spacing-mobile-bar; there is no mobile bar above it.
  -->
  <div id="layout" class="flex min-h-svh w-full flex-col">
    <main class="relative flex min-h-svh w-full min-w-0 flex-1 flex-col page-x">
      <slot />
    </main>
  </div>
</template>
