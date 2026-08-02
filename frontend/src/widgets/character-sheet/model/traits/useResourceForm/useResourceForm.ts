import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';

import { ResetTrigger } from '@shared/api/characters';

import {
  CUSTOM_RESOURCE_VALUE,
  KNOWN_RESET_TRIGGERS,
  KNOWN_RESOURCE_LABELS,
  RESET_TRIGGER_LABELS,
} from '@widgets/character-sheet/config/traits';

import { resourceFormSchema } from './resourceForm.schema';
import type { UseResourceFormOptions } from './useResourceForm.types';

const MAX_HINT_CUSTOM = 'How big is the pool?';

/**
 * The known-resource maxima table (rage by level, ki = level, …) was never
 * sourced from the SRD, so there is nothing to derive from and nothing safe to
 * guess. A known resource gets the same manual box as a homebrew one.
 */
const MAX_HINT_KNOWN =
  'The per-level table for official resources is not in the app yet, so enter the max yourself. Leave it blank to keep the pool untracked.';

export const useResourceForm = (options: UseResourceFormOptions) => {
  const { getResource, isOpen, onSubmit } = options;

  const form = useForm({
    validationSchema: resourceFormSchema,
    initialValues: {
      customName: '',
      maxValue: '',
      current: '',
      description: '',
      quickReference: false,
    },
  });

  const isEditing = computed(() => {
    return getResource() !== null;
  });

  const title = computed(() => {
    return isEditing.value ? 'Edit resource' : 'Add a class resource';
  });

  const selectedResource = computed(() => {
    return form.values.resource;
  });

  const isCustomResource = computed(() => {
    return selectedResource.value === CUSTOM_RESOURCE_VALUE;
  });

  const maxHint = computed(() => {
    return isCustomResource.value ? MAX_HINT_CUSTOM : MAX_HINT_KNOWN;
  });

  const sourcedTriggerHint = computed(() => {
    const key = selectedResource.value;

    if (!key || key === CUSTOM_RESOURCE_VALUE) return null;

    const name = KNOWN_RESOURCE_LABELS[key] ?? key;
    const sourced = KNOWN_RESET_TRIGGERS[key];

    if (!sourced) {
      return `The reset rule for ${name} is not recorded here — pick it yourself.`;
    }

    return `${name} resets on: ${RESET_TRIGGER_LABELS[sourced].toLowerCase()}.`;
  });

  const submit = form.handleSubmit((values) => {
    const isCustomName = values.resource === CUSTOM_RESOURCE_VALUE;
    const maxValue = values.maxValue === '' ? null : Number(values.maxValue);

    const entered = values.current === '' ? 0 : Number(values.current);
    const nextCurrent = isEditing.value ? entered : (maxValue ?? 0);

    onSubmit({
      resourceKey: isCustomName ? values.customName : values.resource,
      isCustom: isCustomName || maxValue !== null,
      maxValue,
      current: maxValue === null ? nextCurrent : Math.min(nextCurrent, maxValue),
      resetTrigger: values.resetTrigger,
      description: values.description.trim() || null,
      quickReference: values.quickReference,
    });
  });

  const handleSubmit = (event?: Event) => {
    void submit(event);
  };

  /**
   * Only while adding: prefilling on an edit would overwrite a trigger the player
   * deliberately changed, and only the six triggers the design doc states are in
   * the map at all — the rest land on manual for the player to correct.
   */
  watch(selectedResource, (key) => {
    if (isEditing.value || !key) return;

    form.setFieldValue('resetTrigger', KNOWN_RESET_TRIGGERS[key] ?? ResetTrigger.MANUAL);
  });

  watch(isOpen, (open) => {
    if (!open) return;

    const row = getResource();
    const isKnown = row ? KNOWN_RESOURCE_LABELS[row.resourceKey] !== undefined : false;

    form.resetForm({
      values: {
        resource: row ? (isKnown ? row.resourceKey : CUSTOM_RESOURCE_VALUE) : undefined,
        customName: row && !isKnown ? row.resourceKey : '',
        maxValue: row === null || row.maxValue === null ? '' : String(row.maxValue),
        current: row ? String(row.current) : '',
        resetTrigger: row?.resetTrigger,
        description: row?.description ?? '',
        quickReference: row?.quickReference ?? false,
      },
    });
  });

  return {
    title,
    isEditing,
    isCustomResource,
    maxHint,
    sourcedTriggerHint,
    handleSubmit,
  };
};
