<script setup lang="ts">
import {
  CharCardRoot,
  CharCardHeader,
  CharCardFooter,
  CoreInfoLine,
  CtaButton,
  DeleteActionItem,
  DropdownActionsList,
  EditActionItem,
} from '@features/character-card';

import type { CharacterCardProps } from './CharacterCard.types';

const props = defineProps<CharacterCardProps>();
</script>

<template>
  <CharCardRoot v-bind="props.character" class="min-h-50">
    <CharCardHeader>
      <CoreInfoLine label="Class" field="characterClass" />

      <CoreInfoLine label="Race" field="race" />
    </CharCardHeader>

    <CharCardFooter class="mt-auto">
      <div class="flex flex-row items-center justify-between">
        <DropdownActionsList>
          <DeleteActionItem />

          <EditActionItem />
        </DropdownActionsList>

        <CtaButton />
      </div>
    </CharCardFooter>
  </CharCardRoot>
</template>
