<script setup lang="ts">
import { ChevronRight, Pin } from 'lucide-vue-next';
import { computed } from 'vue';

import type { Attack } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { NumberField } from '@shared/ui/number-field';

import {
  AMMO_LIMIT,
  DAMAGE_TYPE_ICONS,
  DELIVERY_LABELS,
} from '@widgets/character-sheet/config/combat';
import {
  attackTotals,
  formatDamage,
  tracksAmmo,
} from '@widgets/character-sheet/lib/combat';
import { formatSigned } from '@widgets/character-sheet/lib/format';

import { PropertyBadges } from '../property-badges';
import type { AttackRowProps } from './AttackRow.types';

const MIN_AMMO = 0;

const props = withDefaults(defineProps<AttackRowProps>(), { isBusy: false });

/**
 * Each event carries the row's own attack, so the list can bind a bare handler
 * instead of closing over the `v-for` item.
 */
const emit = defineEmits<{
  detail: [attack: Attack];
  'toggle-pin': [attack: Attack];
  'update-ammo': [attack: Attack, value: number];
}>();

const totals = computed(() => {
  return attackTotals(props.totals, props.proficiencyBonus, {
    ability: props.attack.ability,
    proficient: props.attack.proficient,
    additionalBonus: props.attack.additionalBonus,
  });
});

const damageLabel = computed(() => {
  return formatDamage(props.attack.damageDice, totals.value.damageBonus);
});

const damageIcon = computed(() => {
  return props.attack.damageType ? DAMAGE_TYPE_ICONS[props.attack.damageType] : undefined;
});

const showsAmmo = computed(() => {
  return tracksAmmo(props.attack.delivery);
});

const ammo = computed({
  get: (): number => {
    return props.attack.ammoRemaining ?? MIN_AMMO;
  },
  set: (value: number): void => {
    emit('update-ammo', props.attack, value);
  },
});

const pinLabel = computed(() => {
  return props.attack.quickReference ? 'Unpin from quick access' : 'Pin to quick access';
});

const pinClasses = computed(() => {
  return props.attack.quickReference ? 'text-accent-primary' : '';
});

const handleDetailClick = (): void => {
  emit('detail', props.attack);
};

const handleTogglePinClick = (): void => {
  emit('toggle-pin', props.attack);
};
</script>

<template>
  <li class="flex flex-col gap-2 rounded-lg border border-border bg-bg-secondary p-3">
    <div class="flex items-center gap-2">
      <Button
        variant="transparent"
        align="start"
        is-unpadded
        class="min-h-11 min-w-0 flex-1 gap-1 md:min-h-0"
        @click="handleDetailClick"
      >
        <span class="truncate font-semibold text-primary">{{ props.attack.name }}</span>

        <ChevronRight :size="16" class="shrink-0" aria-hidden="true" />
      </Button>

      <Button
        variant="transparent"
        is-icon-only
        class="shrink-0"
        :aria-pressed="props.attack.quickReference"
        :aria-label="pinLabel"
        :is-disabled="props.isBusy"
        @click="handleTogglePinClick"
      >
        <Pin :size="18" :class="pinClasses" aria-hidden="true" />
      </Button>
    </div>

    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span class="font-semibold text-accent-primary tabular-nums">
        {{ formatSigned(totals.attackBonus) }} to hit
      </span>

      <span class="flex items-center gap-1 text-primary">
        <component :is="damageIcon" v-if="damageIcon" :size="14" aria-hidden="true" />

        <span class="tabular-nums">{{ damageLabel }}</span>

        <span v-if="props.attack.damageType" class="text-secondary">
          {{ props.attack.damageType }}
        </span>
      </span>

      <span class="text-xs text-secondary">
        {{ DELIVERY_LABELS[props.attack.delivery] }}
      </span>
    </div>

    <PropertyBadges
      v-if="props.attack.properties.length"
      :properties="props.attack.properties"
    />

    <div
      v-if="showsAmmo"
      class="flex items-center justify-between gap-2 border-t border-border pt-2"
    >
      <span class="text-xs text-secondary uppercase">Ammo</span>

      <NumberField
        v-model="ammo"
        label="Ammo remaining"
        is-label-hidden
        has-stepper
        class="w-40"
        :min="MIN_AMMO"
        :max="AMMO_LIMIT"
        :is-disabled="props.isBusy"
        decrement-label="Spend one"
        increment-label="Recover one"
      />
    </div>
  </li>
</template>
