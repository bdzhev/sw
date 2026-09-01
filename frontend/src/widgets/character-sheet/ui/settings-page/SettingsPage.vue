<script setup lang="ts">
import { computed } from 'vue';

import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { FormInput } from '@shared/ui/form-input';
import { Skeleton } from '@shared/ui/skeleton';
import { Textarea } from '@shared/ui/textarea';

import { useSettingsForm } from '@widgets/character-sheet/model/settings';
import { useSheetShell } from '@widgets/character-sheet/model/sheet-shell';
import { BackButton } from '@widgets/character-sheet/ui/back-button';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { IdentitySummary } from './identity-summary';

/**
 * A page like the items one, but on the other write channel: everything here is
 * an explicit save into the `characters` row, so there is no `StatusBar` — the
 * autosave badge would be reporting on a row this page never touches.
 */
const { characterId, character, isFetchingCharacter } = useSheetShell();

const { isSaving, isDirty, handleSubmit } = useSettingsForm({
  getCharacter: () => {
    return character.value?.character;
  },
});

const sheetLink = computed(() => {
  return { name: RouteName.APP_CHARACTER, params: { id: characterId, tab: 'main' } };
});

const title = computed(() => {
  return character.value ? `${character.value.character.name} · settings` : 'Settings';
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 pb-6">
    <!-- Skeleton hardcodes `h-full w-full`, so its size has to come from a wrapper. -->
    <template v-if="isFetchingCharacter && !character">
      <div class="h-24 w-full">
        <Skeleton class="rounded-lg" />
      </div>

      <div class="h-96 w-full">
        <Skeleton class="rounded-lg" />
      </div>
    </template>

    <template v-else-if="character">
      <header
        class="page-x-bleed flex items-center gap-x-2 border-b border-border bg-bg-secondary py-4 md:py-6"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <BackButton :to="sheetLink" label="Back to the character sheet" class="-ml-1" />

          <h1 class="truncate text-2xl font-semibold text-primary">{{ title }}</h1>
        </div>
      </header>

      <IdentitySummary
        :race="character.character.race"
        :character-class="character.character.characterClass"
        :level="character.sheet.level"
      />

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <SheetSection
          title="Details"
          description="Saved when you press the button — this page does not autosave."
        >
          <div class="mt-4 flex flex-col gap-4">
            <FormInput name="name" label="Name" placeholder="Kara" />

            <Textarea
              name="lore"
              label="Lore"
              :rows="6"
              placeholder="Allies, background, organisations, oaths owed…"
            />

            <Textarea
              name="appearance"
              label="Appearance"
              :rows="4"
              placeholder="Age, height, build, scars, what people notice first…"
            />
          </div>
        </SheetSection>

        <div class="flex justify-end">
          <Button type="submit" :is-disabled="!isDirty" :is-loading="isSaving">
            Save changes
          </Button>
        </div>
      </form>
    </template>
  </div>
</template>
