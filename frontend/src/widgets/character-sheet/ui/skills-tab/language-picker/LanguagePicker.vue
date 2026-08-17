<script setup lang="ts">
import { Label } from 'reka-ui';
import { computed, ref, watch } from 'vue';

import type { Languages } from '@shared/api/characters';
import { Input } from '@shared/ui/input';
import { Text } from '@shared/ui/text';
import { ToggleChipGroup } from '@shared/ui/toggle-chip-group';

import { STANDARD_LANGUAGE_OPTIONS } from '@widgets/character-sheet/config/skills';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { LanguagePickerProps } from './LanguagePicker.types';

const OTHER_INPUT_ID = 'languages-other';

const props = defineProps<LanguagePickerProps>();

const emit = defineEmits<{ update: [languages: Languages, immediate?: boolean] }>();

const otherDraft = ref(props.languages.other);
const isEditingOther = ref(false);

// An acked save writes the row back through the query cache; adopting that while
// the field has focus would discard whatever was typed since the request left.
watch(
  () => {
    return props.languages.other;
  },
  (value) => {
    if (!isEditingOther.value) otherDraft.value = value;
  },
);

/** Picking a language is a single-shot edit, so it skips the debounce. */
const standard = computed({
  get: (): string[] => {
    return [...props.languages.standard];
  },
  set: (value: string[]): void => {
    emit('update', { standard: value, other: otherDraft.value }, true);
  },
});

const handleOtherFocus = (): void => {
  isEditingOther.value = true;
};

const handleOtherInput = (value: string | number): void => {
  otherDraft.value = String(value);

  emit('update', { standard: [...props.languages.standard], other: otherDraft.value });
};

const handleOtherBlur = (): void => {
  isEditingOther.value = false;

  if (otherDraft.value === props.languages.other) return;

  emit(
    'update',
    { standard: [...props.languages.standard], other: otherDraft.value },
    true,
  );
};
</script>

<template>
  <SheetSection title="Languages">
    <ToggleChipGroup
      v-model="standard"
      :options="STANDARD_LANGUAGE_OPTIONS"
      legend="Standard languages"
    />

    <div class="mt-4 flex flex-col gap-1">
      <Label :for="OTHER_INPUT_ID" class="text-xs text-secondary uppercase">
        Other languages
      </Label>

      <Input
        :id="OTHER_INPUT_ID"
        :model-value="otherDraft"
        placeholder="Thieves' cant, homebrew tongues…"
        @update:model-value="handleOtherInput"
        @focus="handleOtherFocus"
        @blur="handleOtherBlur"
      />

      <Text size="xs" theme="secondary">Free text — anything not on the list above.</Text>
    </div>
  </SheetSection>
</template>
