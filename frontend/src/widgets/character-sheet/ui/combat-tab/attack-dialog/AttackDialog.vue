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
import { Input } from '@shared/ui/input';
import { Select } from '@shared/ui/select';
import { Text } from '@shared/ui/text';

import {
  ABILITY_OPTIONS,
  ATTACK_PROPERTIES,
  DAMAGE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
} from '@widgets/character-sheet/config/combat/constants';
import type {
  AttackBody,
  AttackFormValues,
} from '@widgets/character-sheet/config/combat/types';
import {
  attackBreakdown,
  attackTotals,
  formatDamage,
  formatSigned,
  parseBonus,
  tracksAmmo,
} from '@widgets/character-sheet/lib/combat/attack-math';
import { attackFormSchema } from '@widgets/character-sheet/model/combat/attackForm.schema';

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

const isPropertyOn = (key: string): boolean => {
  return (values.properties ?? []).includes(key);
};

const toggleProperty = (key: string) => {
  const current = values.properties ?? [];

  form.setFieldValue(
    'properties',
    isPropertyOn(key)
      ? current.filter((entry) => {
          return entry !== key;
        })
      : [...current, key],
  );
};

const toggleProficient = () => {
  form.setFieldValue('proficient', !values.proficient);
};

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

const onSubmit = (event?: Event) => {
  void submitAttack(event);
};
</script>

<template>
  <DialogRoot
    :open="props.open"
    @update:open="
      (next) => {
        return emit('update:open', next);
      }
    "
  >
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        :disable-outside-close="props.isSaving"
        :aria-describedby="undefined"
      >
        <DialogHeader>
          <DialogTitle>{{ props.attack ? 'Edit attack' : 'Add attack' }}</DialogTitle>
        </DialogHeader>

        <form class="flex min-h-0 flex-col" @submit.prevent="onSubmit">
          <DialogBody>
            <div class="flex flex-col">
              <AttackField label="Name">
                <Input name="name" placeholder="Longsword, claws, unarmed strike…" />
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

                <button
                  type="button"
                  role="switch"
                  :aria-checked="isProficient"
                  class="flex min-h-11 w-fit cursor-pointer items-center gap-2 md:min-h-0"
                  @click="toggleProficient"
                >
                  <span
                    class="flex h-6 w-11 shrink-0 items-center rounded-full transition-all"
                    :class="isProficient ? 'bg-accent-primary' : 'bg-fg'"
                  >
                    <span
                      class="ml-1 block h-4 w-4 rounded-full bg-primary transition-all"
                      :class="{ 'translate-x-5': isProficient }"
                    />
                  </span>

                  <span class="text-sm text-primary">
                    {{ isProficient ? 'Proficient' : 'Not proficient' }}
                  </span>
                </button>
              </div>

              <AttackField label="Damage dice">
                <Input name="damageDice" placeholder="1d8" />
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
                <Input
                  name="additionalBonus"
                  type="number"
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
                <Input name="ammoRemaining" type="number" placeholder="0" />
              </AttackField>

              <div class="flex flex-col gap-2 pb-2">
                <span class="text-xs text-secondary uppercase">Properties</span>

                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="property in ATTACK_PROPERTIES"
                    :key="property.key"
                    type="button"
                    :aria-pressed="isPropertyOn(property.key)"
                    class="flex min-h-11 cursor-pointer items-center gap-1 rounded-full border px-3 text-sm md:min-h-0 md:py-1"
                    :class="
                      isPropertyOn(property.key)
                        ? 'border-accent-primary bg-accent-primary/15 text-primary'
                        : 'border-border text-secondary'
                    "
                    @click="toggleProperty(property.key)"
                  >
                    <component :is="property.icon" :size="14" aria-hidden="true" />

                    {{ property.label }}
                  </button>
                </div>
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
                @click="emit('update:open', false)"
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
