<script setup lang="ts">
import { CharactersList } from './characters-list';
import { HeaderMenu } from './header-menu';
</script>

<template>
  <HeaderMenu />

  <CharactersList class="py-6 md:py-12" />
</template>
