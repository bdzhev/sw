<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const shouldShowFooter = computed(() => route.name === 'home');
</script>

<template>
  <footer
    v-if="shouldShowFooter"
    class="h-20"
  >
    footer
  </footer>
</template>
