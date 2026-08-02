<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { Languages } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { STANDARD_LANGUAGES } from '@entities/characters';

import type { LanguagePickerProps } from './LanguagePicker.types';

const props = defineProps<LanguagePickerProps>();

const emit = defineEmits<{ update: [languages: Languages, immediate?: boolean] }>();

const selected = computed(() => {
  return new Set(props.languages.standard);
});

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

const toggleLanguage = (language: string) => {
  const next = props.languages.standard.filter((entry) => {
    return entry !== language;
  });

  if (next.length === props.languages.standard.length) next.push(language);

  emit('update', { standard: next, other: otherDraft.value }, true);
};

const onOtherInput = (event: Event) => {
  otherDraft.value = (event.target as HTMLInputElement).value;

  emit('update', { standard: [...props.languages.standard], other: otherDraft.value });
};

const onOtherBlur = () => {
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
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <h2 class="text-sm font-semibold text-primary">Languages</h2>

    <fieldset class="flex flex-col gap-2">
      <legend class="sr-only">Standard languages</legend>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="language in STANDARD_LANGUAGES"
          :key="language"
          type="button"
          :aria-pressed="selected.has(language)"
          class="min-h-11 rounded-full border px-3 text-sm transition-colors md:min-h-9"
          :class="
            selected.has(language)
              ? 'border-accent-primary bg-accent-primary/15 text-primary'
              : 'border-border text-secondary hover:text-primary'
          "
          @click="toggleLanguage(language)"
        >
          {{ language }}
        </button>
      </div>
    </fieldset>

    <div class="flex flex-col gap-1">
      <label for="languages-other" class="text-xs text-secondary uppercase">
        Other languages
      </label>

      <input
        id="languages-other"
        type="text"
        :value="otherDraft"
        placeholder="Thieves' cant, homebrew tongues…"
        class="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-base text-primary outline-none placeholder:text-secondary focus:border-accent-primary md:text-sm"
        @focus="isEditingOther = true"
        @input="onOtherInput"
        @blur="onOtherBlur"
      />

      <Text size="xs" theme="secondary">Free text — anything not on the list above.</Text>
    </div>
  </section>
</template>
