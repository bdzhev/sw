<script setup lang="ts">
import { ChevronRight, Minus, Pin, Plus } from 'lucide-vue-next';
import { computed } from 'vue';

import {
  AMMO_LIMIT,
  DAMAGE_TYPE_ICONS,
  DELIVERY_LABELS,
} from '@widgets/character-sheet/config/combat/constants';
import {
  attackTotals,
  formatDamage,
  formatSigned,
  tracksAmmo,
} from '@widgets/character-sheet/lib/combat/attack-math';

import { PropertyBadges } from '../property-badges';
import type { AttackRowProps } from './AttackRow.types';

const props = withDefaults(defineProps<AttackRowProps>(), { isBusy: false });

const emit = defineEmits<{
  detail: [];
  'toggle-pin': [];
  'update-ammo': [value: number];
}>();

const totals = computed(() => {
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

const damageLabel = computed(() => {
  return formatDamage(props.attack.damageDice, totals.value.damageBonus);
});

const damageIcon = computed(() => {
  return props.attack.damageType ? DAMAGE_TYPE_ICONS[props.attack.damageType] : undefined;
});

const showsAmmo = computed(() => {
  return tracksAmmo(props.attack.delivery);
});

const ammo = computed(() => {
  return props.attack.ammoRemaining ?? 0;
});

const stepAmmo = (delta: number) => {
  emit('update-ammo', Math.min(AMMO_LIMIT, Math.max(0, ammo.value + delta)));
};
</script>

<template>
  <li class="flex flex-col gap-2 rounded-lg border border-border bg-bg-secondary p-3">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-1 text-left md:min-h-0"
        @click="emit('detail')"
      >
        <span class="truncate font-semibold text-primary">{{ props.attack.name }}</span>

        <ChevronRight :size="16" class="shrink-0 text-secondary" aria-hidden="true" />
      </button>

      <button
        type="button"
        :aria-pressed="props.attack.quickReference"
        :aria-label="
          props.attack.quickReference ? 'Unpin from quick access' : 'Pin to quick access'
        "
        :disabled="props.isBusy"
        class="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-50"
        :class="
          props.attack.quickReference
            ? 'text-accent-primary'
            : 'text-secondary hover:text-primary'
        "
        @click="emit('toggle-pin')"
      >
        <Pin :size="18" aria-hidden="true" />
      </button>
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

      <div class="flex items-center gap-1">
        <button
          type="button"
          aria-label="Spend one"
          :disabled="props.isBusy || ammo === 0"
          class="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border text-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          @click="stepAmmo(-1)"
        >
          <Minus :size="16" aria-hidden="true" />
        </button>

        <span class="min-w-10 text-center font-semibold text-primary tabular-nums">
          {{ ammo }}
        </span>

        <button
          type="button"
          aria-label="Recover one"
          :disabled="props.isBusy || ammo >= AMMO_LIMIT"
          class="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border text-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          @click="stepAmmo(1)"
        >
          <Plus :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
  </li>
</template>
