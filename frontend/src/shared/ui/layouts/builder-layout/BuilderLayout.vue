<template>
  <!--
    No `navigation` slot, as in SheetLayout: a slot a layout never renders is
    never created, so the rail and the mobile bar are absent at every width. The
    quiz is a focused surface — its own header carries the one way out, back to
    the character list.

    `h-svh` + `overflow-hidden` because this page must never scroll the document:
    the card scrolls, not the page. A definite height is also what the carousel's
    height chain resolves against, so a `min-h` here collapses it. `svh` not
    `dvh` — dvh resizes as the address bar hides, and the carousel re-positions.
  -->
  <div id="layout" class="flex h-svh w-full flex-col overflow-hidden">
    <main class="relative flex min-h-0 w-full min-w-0 flex-1 flex-col">
      <slot />
    </main>
  </div>
</template>
