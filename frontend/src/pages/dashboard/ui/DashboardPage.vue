<script setup lang="ts">
import { CharactersList } from './characters-list';
import { HeaderMenu } from './header-menu';
</script>

<template>
  <HeaderMenu />

  <CharactersList class="pt-4 pb-6 md:pt-6 md:pb-12" />
</template>
