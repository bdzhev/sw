<script setup lang="ts">
import { EllipsisVertical, Info, Pencil, Pin, PinOff, Trash2 } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import type { InventoryItem } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Checkbox } from '@shared/ui/checkbox';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { Text } from '@shared/ui/text';

import { modifierSummary, usesPool } from '@widgets/character-sheet/lib/equipment';
import { useEquipmentUi } from '@widgets/character-sheet/model/equipment';

import type { ItemCardProps } from './ItemCard.types';

const props = withDefaults(defineProps<ItemCardProps>(), { isSaving: false });

/** Writes leave the card; dialogs are opened on the store directly. */
const emit = defineEmits<{
  togglePin: [item: InventoryItem];
  toggleEquipped: [item: InventoryItem];
  spend: [item: InventoryItem];
}>();

const ui = useEquipmentUi();

const pool = computed(() => {
  return usesPool(props.item);
});

const bonuses = computed(() => {
  return modifierSummary(props.item);
});

/** Quantity is only worth showing when there is more than one. */
const quantityLabel = computed(() => {
  return props.item.quantity > 1 ? `×${props.item.quantity}` : null;
});

const metaLine = computed(() => {
  return [quantityLabel.value, bonuses.value].filter(Boolean).join(' · ');
});

const canSpend = computed(() => {
  return pool.value !== null && (props.item.usesRemaining ?? 0) > 0;
});

const isMenuOpen = ref(false);

/**
 * The pinned state as of the moment the menu opened, not as of now.
 *
 * Selecting the pin item both fires the toggle and starts the menu's close
 * animation, and the content stays mounted until that animation ends (~100ms).
 * Against a local backend the mutation resolves inside that window, so the live
 * value flips first: the icon swaps and the label changes width while the box is
 * still on screen, which reads as a jiggle. Freezing on open makes the menu inert
 * to the row's state, so it can only animate out with the text it opened with.
 */
const menuPinned = ref(false);

watch(isMenuOpen, (open) => {
  if (open) {
    menuPinned.value = props.item.quickReference;
  }
});

const pinLabel = computed(() => {
  return menuPinned.value ? 'Unpin from quick reference' : 'Pin to quick reference';
});

const equippedModel = computed({
  get: (): boolean => {
    return props.item.isEquipped;
  },
  set: (): void => {
    emit('toggleEquipped', props.item);
  },
});

const handleInfoSelect = (): void => {
  ui.openItemDetail(props.item);
};

const handleEditSelect = (): void => {
  ui.openItemDialog(props.item);
};

const handleRemoveSelect = (): void => {
  ui.askDeleteItem(props.item);
};

const handleTogglePinSelect = (): void => {
  emit('togglePin', props.item);
};

const handleSpendClick = (): void => {
  emit('spend', props.item);
};
</script>

<template>
  <!--
    The <li> is the grid item and Card is the surface inside it: Card renders a
    plain div with no `as`, and the list semantics have to survive. Grid items
    stretch by default, so `h-full` on the Card makes a row's cards equal height.
  -->
  <li class="min-w-0">
    <Card class="flex h-full min-w-0 flex-col gap-2 p-3">
      <!-- items-center, so the name, the pin marker and the menu trigger share a
           centre line rather than three different top edges. -->
      <div class="flex min-w-0 items-center gap-1">
        <span class="min-w-0 flex-1 truncate text-sm font-medium text-primary">
          {{ props.item.name }}
        </span>

        <Pin
          v-if="props.item.quickReference"
          :size="14"
          class="shrink-0 text-accent-primary"
          aria-label="Pinned to quick reference"
        />

        <!--
        Every secondary action lives behind this menu at every width. The card is
        half a 360px viewport, so four 44px targets cannot sit in a row — which is
        why this inverts DropdownActionsList, whose two actions go flat on mobile.
      -->
        <DropdownMenuRoot v-model:open="isMenuOpen">
          <DropdownMenuTrigger as-child>
            <Button
              variant="neutral"
              size="xs"
              is-icon-only
              :aria-label="`Actions for ${props.item.name}`"
            >
              <EllipsisVertical :size="16" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @select="handleInfoSelect">
                <Info :size="16" aria-hidden="true" />
                Details
              </DropdownMenuItem>

              <DropdownMenuItem
                :disabled="props.isSaving"
                @select="handleTogglePinSelect"
              >
                <PinOff v-if="menuPinned" :size="16" aria-hidden="true" />

                <Pin v-else :size="16" aria-hidden="true" />

                {{ pinLabel }}
              </DropdownMenuItem>

              <DropdownMenuItem @select="handleEditSelect">
                <Pencil :size="16" aria-hidden="true" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem @select="handleRemoveSelect">
                <Trash2 :size="16" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>

      <Text v-if="metaLine" size="xs" theme="secondary" class="truncate">
        {{ metaLine }}
      </Text>

      <!-- Pushes the controls to the bottom so cards in a row line up. -->
      <div class="mt-auto flex flex-col gap-2">
        <template v-if="pool">
          <span class="text-xs text-secondary tabular-nums">{{ pool }}</span>

          <Button
            variant="secondary"
            size="xs"
            width="full"
            :is-disabled="!canSpend || props.isSaving"
            @click="handleSpendClick"
          >
            Use
          </Button>
        </template>

        <Checkbox
          v-model="equippedModel"
          :is-disabled="props.isSaving"
          label="Equipped"
        />
      </div>
    </Card>
  </li>
</template>
