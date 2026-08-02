<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';

import { AttackAbility } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import {
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import { Text } from '@shared/ui/text';

import {
  ABILITY_LABELS,
  ATTACK_PROPERTIES,
  DELIVERY_LABELS,
  STAT_LABELS,
} from '@widgets/character-sheet/config/combat';
import {
  attackBreakdown,
  attackTotals,
  formatDamage,
  tracksAmmo,
} from '@widgets/character-sheet/lib/combat';
import { formatSigned } from '@widgets/character-sheet/lib/format';

import type { AttackDetailDialogProps } from './AttackDetailDialog.types';

const props = defineProps<AttackDetailDialogProps>();

const emit = defineEmits<{
  'update:open': [open: boolean];
  edit: [];
  remove: [];
}>();

const totals = computed(() => {
  if (!props.attack) return null;

  return attackTotals(
    props.sheet,
    {
      ability: props.attack.ability,
      proficient: props.attack.proficient,
      additionalBonus: props.attack.additionalBonus,
    },
    props.items,
  );
});

const abilityLabel = computed(() => {
  if (!props.attack || !totals.value) return '';

  const label = ABILITY_LABELS[props.attack.ability];

  return props.attack.ability === AttackAbility.FINESSE
    ? `${label} → ${STAT_LABELS[totals.value.stat]}`
    : label;
});

const damageLabel = computed(() => {
  if (!props.attack || !totals.value) return '';

  return formatDamage(props.attack.damageDice, totals.value.damageBonus);
});

/** Known tags carry their rules text; an unrecognised one still gets a row. */
const propertyDetails = computed(() => {
  if (!props.attack) return [];

  return props.attack.properties.map((key) => {
    const known = ATTACK_PROPERTIES.find((property) => {
      return property.key === key;
    });

    return {
      key,
      label: known?.label ?? key,
      description: known?.description ?? 'No description for this tag.',
      icon: known?.icon ?? null,
    };
  });
});

const handleOpenChange = (next: boolean): void => {
  emit('update:open', next);
};

const handleEditClick = (): void => {
  emit('edit');
};

const handleRemoveClick = (): void => {
  emit('remove');
};
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <DialogTitle class="min-w-0 truncate">
            {{ props.attack?.name ?? 'Attack' }}
          </DialogTitle>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody v-if="props.attack && totals">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="flex min-w-0 flex-col gap-1">
                <span class="text-xs text-secondary uppercase">To hit</span>

                <p class="text-2xl font-semibold text-accent-primary tabular-nums">
                  {{ formatSigned(totals.attackBonus) }}
                </p>
              </div>

              <div class="flex min-w-0 flex-col gap-1">
                <span class="text-xs text-secondary uppercase">Damage</span>

                <p class="text-2xl font-semibold text-primary tabular-nums">
                  {{ damageLabel }}
                </p>

                <span v-if="props.attack.damageType" class="text-xs text-secondary">
                  {{ props.attack.damageType }}
                </span>
              </div>
            </div>

            <Text size="sm" theme="secondary">{{ attackBreakdown(totals) }}</Text>

            <dl class="flex flex-col gap-2 border-t border-border pt-3 text-sm">
              <div class="flex items-baseline justify-between gap-3">
                <dt class="text-secondary">Ability</dt>

                <dd class="min-w-0 truncate text-right text-primary">
                  {{ abilityLabel }}
                </dd>
              </div>

              <div class="flex items-baseline justify-between gap-3">
                <dt class="text-secondary">Delivery</dt>

                <dd class="text-right text-primary">
                  {{ DELIVERY_LABELS[props.attack.delivery] }}
                </dd>
              </div>

              <div class="flex items-baseline justify-between gap-3">
                <dt class="text-secondary">Proficient</dt>

                <dd class="text-right text-primary">
                  {{ props.attack.proficient ? 'Yes' : 'No' }}
                </dd>
              </div>

              <div
                v-if="tracksAmmo(props.attack.delivery)"
                class="flex items-baseline justify-between gap-3"
              >
                <dt class="text-secondary">Ammo remaining</dt>

                <dd class="text-right text-primary tabular-nums">
                  {{ props.attack.ammoRemaining ?? 0 }}
                </dd>
              </div>
            </dl>

            <div class="flex flex-col gap-3 border-t border-border pt-3">
              <span class="text-xs text-secondary uppercase">Properties</span>

              <Text v-if="!propertyDetails.length" size="sm" theme="secondary">
                No properties on this attack.
              </Text>

              <ul v-else class="flex flex-col gap-3">
                <li
                  v-for="property in propertyDetails"
                  :key="property.key"
                  class="flex flex-col gap-1"
                >
                  <span
                    class="flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    <component
                      :is="property.icon"
                      v-if="property.icon"
                      :size="14"
                      aria-hidden="true"
                    />

                    {{ property.label }}
                  </span>

                  <span class="text-sm text-secondary">{{ property.description }}</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="danger" width="fullOnMobile" @click="handleRemoveClick">
              <Trash2 :size="16" class="mr-1" aria-hidden="true" />

              Delete
            </Button>

            <Button width="fullOnMobile" @click="handleEditClick">
              <Pencil :size="16" class="mr-1" aria-hidden="true" />

              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
