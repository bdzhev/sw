<script setup lang="ts">
import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';

import { AttackAbility, AttackDelivery, type Attack } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import { FormInput } from '@shared/ui/form-input';
import { FormSwitch } from '@shared/ui/form-switch';
import { Select } from '@shared/ui/select';
import { Text } from '@shared/ui/text';
import { ToggleChipGroup } from '@shared/ui/toggle-chip-group';

import {
  ABILITY_OPTIONS,
  ATTACK_PROPERTY_OPTIONS,
  DAMAGE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
} from '@widgets/character-sheet/config/combat';
import type {
  AttackBody,
  AttackFormValues,
} from '@widgets/character-sheet/config/combat';
import {
  attackBreakdown,
  attackTotals,
  formatDamage,
  parseBonus,
  tracksAmmo,
} from '@widgets/character-sheet/lib/combat';
import { formatSigned } from '@widgets/character-sheet/lib/format';
import { attackFormSchema } from '@widgets/character-sheet/model/combat';

import { AttackField } from './attack-field';
import type { AttackDialogProps } from './AttackDialog.types';

const props = withDefaults(defineProps<AttackDialogProps>(), { isSaving: false });

const emit = defineEmits<{
  'update:open': [open: boolean];
  submit: [body: AttackBody];
}>();

const valuesFromAttack = (attack: Attack | null): AttackFormValues => {
  return {
    name: attack?.name ?? '',
    ability: attack?.ability ?? AttackAbility.STRENGTH,
    delivery: attack?.delivery ?? AttackDelivery.MELEE,
    proficient: attack?.proficient ?? false,
    damageDice: attack?.damageDice ?? '',
    damageType: attack?.damageType ?? '',
    additionalBonus: attack?.additionalBonus ? String(attack.additionalBonus) : '',
    ammoRemaining:
      attack?.ammoRemaining === null || attack?.ammoRemaining === undefined
        ? ''
        : String(attack.ammoRemaining),
    properties: attack ? [...attack.properties] : [],
  };
};

const form = useForm({
  validationSchema: attackFormSchema,
  initialValues: valuesFromAttack(null),
});

const { meta, values } = form;

watch(
  () => {
    return props.open;
  },
  (open) => {
    if (open) form.resetForm({ values: valuesFromAttack(props.attack) });
  },
);

const showsAmmo = computed(() => {
  return tracksAmmo(values.delivery ?? AttackDelivery.MELEE);
});

const isProficient = computed(() => {
  return Boolean(values.proficient);
});

/** Live as the player types, so the calculated result is visible before saving. */
const preview = computed(() => {
  return attackTotals(
    props.sheet,
    {
      ability: values.ability ?? AttackAbility.STRENGTH,
      proficient: isProficient.value,
      additionalBonus: parseBonus(values.additionalBonus ?? ''),
    },
    props.items,
  );
});

const damagePreview = computed(() => {
  return formatDamage(values.damageDice || null, preview.value.damageBonus);
});

/** `meta.valid` alone is true on a freshly reset form that has never validated. */
const canSubmit = computed(() => {
  return meta.value.valid && Boolean(values.name?.trim());
});

const proficientLabel = computed(() => {
  return isProficient.value ? 'Proficient' : 'Not proficient';
});

/** The chips write straight into the vee-validate field the form submits. */
const properties = computed({
  get: (): string[] => {
    return [...(values.properties ?? [])];
  },
  set: (value: string[]): void => {
    form.setFieldValue('properties', value);
  },
});

const submitAttack = form.handleSubmit((values) => {
  const ammo = values.ammoRemaining === '' ? null : Number(values.ammoRemaining);

  emit('submit', {
    name: values.name,
    ability: values.ability,
    delivery: values.delivery,
    proficient: values.proficient,
    damageDice: values.damageDice || null,
    damageType: values.damageType || null,
    additionalBonus: parseBonus(values.additionalBonus),
    ammoRemaining: tracksAmmo(values.delivery) ? ammo : null,
    properties: values.properties,
  });
});

const handleSubmit = (event?: Event): void => {
  void submitAttack(event);
};

const handleOpenChange = (next: boolean): void => {
  emit('update:open', next);
};

const handleCancelClick = (): void => {
  emit('update:open', false);
};
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        :disable-outside-close="props.isSaving"
        :aria-describedby="undefined"
      >
        <DialogHeader>
          <DialogTitle>{{ props.attack ? 'Edit attack' : 'Add attack' }}</DialogTitle>
        </DialogHeader>

        <form class="flex min-h-0 flex-col" @submit.prevent="handleSubmit">
          <DialogBody>
            <div class="flex flex-col">
              <AttackField label="Name">
                <FormInput name="name" placeholder="Longsword, claws, unarmed strike…" />
              </AttackField>

              <AttackField label="Ability">
                <Select name="ability" :options="ABILITY_OPTIONS" class="mb-2" />
              </AttackField>

              <Text size="xs" theme="secondary" class="pb-4">
                Finesse uses whichever of Strength or Dexterity is higher — the same one
                for the attack roll and the damage roll, never mixed.
              </Text>

              <AttackField label="Delivery">
                <Select name="delivery" :options="DELIVERY_OPTIONS" class="mb-6" />
              </AttackField>

              <div class="flex flex-col gap-1 pb-6">
                <span class="text-xs text-secondary uppercase">Proficient</span>

                <FormSwitch name="proficient" :label="proficientLabel" />
              </div>

              <AttackField label="Damage dice">
                <FormInput name="damageDice" placeholder="1d8" />
              </AttackField>

              <AttackField label="Damage type">
                <Select
                  name="damageType"
                  :options="DAMAGE_TYPE_OPTIONS"
                  placeholder="Select a damage type…"
                  class="mb-6"
                />
              </AttackField>

              <AttackField label="Additional bonus">
                <FormInput
                  name="additionalBonus"
                  placeholder="Magic weapon bonus, etc."
                />
              </AttackField>

              <div
                class="mb-6 flex flex-col gap-2 rounded-md border border-border bg-bg-primary p-3"
              >
                <span class="text-xs text-secondary uppercase">Preview</span>

                <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span class="text-sm text-secondary">
                    Attack

                    <strong
                      class="text-base font-semibold text-accent-primary tabular-nums"
                    >
                      {{ formatSigned(preview.attackBonus) }}
                    </strong>
                  </span>

                  <span class="text-sm text-secondary">
                    Damage

                    <strong class="text-base font-semibold text-primary tabular-nums">
                      {{ damagePreview }}
                    </strong>
                  </span>
                </div>

                <span class="text-xs text-secondary">{{ attackBreakdown(preview) }}</span>
              </div>

              <AttackField v-if="showsAmmo" label="Ammo remaining">
                <FormInput name="ammoRemaining" input-mode="numeric" placeholder="0" />
              </AttackField>

              <div class="flex flex-col gap-2 pb-2">
                <span class="text-xs text-secondary uppercase">Properties</span>

                <ToggleChipGroup
                  v-model="properties"
                  :options="ATTACK_PROPERTY_OPTIONS"
                  legend="Attack properties"
                />
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                width="fullOnMobile"
                :is-disabled="props.isSaving"
                @click="handleCancelClick"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                width="fullOnMobile"
                :is-loading="props.isSaving"
                :is-disabled="!canSubmit"
              >
                {{ props.attack ? 'Save' : 'Add attack' }}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
