<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useBreakpoint } from '@shared/lib/ui';

import { useCharacter } from '@entities/characters';

import { MobileNavHeader } from '@widgets/sidebar-navigation';

const { isMobile } = useBreakpoint();

const route = useRoute();
const id = route.params.id as string;

const { character, isFetchingCharacter } = useCharacter({ id });

const STAT_LABELS: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};
</script>

<template>
  <MobileNavHeader v-if="isMobile" />

  <div v-if="isFetchingCharacter">
    <p>Loading...</p>
  </div>

  <div v-else-if="character">
    <p>{{ character.name }}</p>
    <p>{{ character.characterClass }}</p>
    <p>{{ character.race }}</p>
    <p>{{ character.status }}</p>

    <div v-if="character.stats">
      <p v-for="(value, key) in character.stats" :key="key">
        {{ STAT_LABELS[key] }}: {{ value }}
      </p>
    </div>
  </div>
</template>
