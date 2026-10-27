<script setup lang="ts">
import { FormInput } from '@shared/ui/form-input';
import { FormSelect } from '@shared/ui/form-select';
import { Text } from '@shared/ui/text';
import { Textarea } from '@shared/ui/textarea';

import { SPELL_LEVEL_OPTIONS } from '@widgets/character-sheet/config/spellcasting';
</script>

<template>
  <!-- A third path, not a fallback: homebrew and a spell the library never had
       both land in the same list as everything else. -->
  <div class="flex flex-col gap-2">
    <Text size="xs" theme="secondary">
      Anything the library does not have — homebrew, a DM's ruling, a half-remembered
      scroll.
    </Text>

    <FormInput name="name" placeholder="Spell name" />

    <!-- Asked for, not defaulted: the level is what a cast spends. -->
    <FormSelect
      name="level"
      :options="SPELL_LEVEL_OPTIONS"
      placeholder="Level — cantrip through 9th"
    />

    <Textarea
      name="description"
      label="Description"
      :rows="5"
      placeholder="What it does, in your own words."
    />
  </div>
</template>
