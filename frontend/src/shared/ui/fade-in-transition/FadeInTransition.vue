<template>
  <Transition
    enter-active-class="transition-all duration-100 ease-out"
    leave-active-class="transition-all duration-100 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <slot />
  </Transition>
</template>
