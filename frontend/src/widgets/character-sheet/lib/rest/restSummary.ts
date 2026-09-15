import {
  ResetTrigger,
  RestType,
  SpellcastingProgression,
  type CharacterSheet,
  type ClassResource,
  type InventoryItem,
  type SpellSlots,
} from '@shared/api/characters';

import type { RestSummaryLine } from '@widgets/character-sheet/config/rest';
import { resourceLabel } from '@widgets/character-sheet/lib/traits';

/** The three things a rest rewrites, as the sheet held them at one moment. */
export interface RestSnapshot {
  sheet: CharacterSheet;
  classResources: ClassResource[];
  inventoryItems: InventoryItem[];
}

const TRIGGERS: Record<RestType, ResetTrigger[]> = {
  [RestType.SHORT]: [ResetTrigger.SHORT, ResetTrigger.BOTH],
  /** A long rest restores everything a short one does — hence `BOTH`. */
  [RestType.LONG]: [ResetTrigger.LONG, ResetTrigger.BOTH],
};

const line = (label: string, detail: string, isApplied = true): RestSummaryLine => {
  return { label, detail, isApplied };
};

const arrow = (before: number, after: number): string => {
  return `${before} → ${after}`;
};

const slotTotal = (slots: SpellSlots): number => {
  return Object.values(slots.current).reduce<number>((sum, count) => {
    return sum + (count ?? 0);
  }, 0);
};

const hasMaxima = (slots: SpellSlots): boolean => {
  return Object.keys(slots.max ?? {}).length > 0;
};

const hitPointsLine = (
  before: CharacterSheet,
  after: CharacterSheet,
): RestSummaryLine => {
  if (after.hpMax === 0) {
    return line('Hit points', 'No maximum recorded', false);
  }

  if (after.hpCurrent === before.hpCurrent) {
    return line('Hit points', `${after.hpCurrent} / ${after.hpMax} — unchanged`, false);
  }

  return line(
    'Hit points',
    `${arrow(before.hpCurrent, after.hpCurrent)} of ${after.hpMax}`,
  );
};

const hitDiceLine = (before: CharacterSheet, after: CharacterSheet): RestSummaryLine => {
  if (after.hitDiceRemaining === before.hitDiceRemaining) {
    return line(
      'Hit dice',
      `${after.hitDiceRemaining} of ${after.level} — unchanged`,
      false,
    );
  }

  return line(
    'Hit dice',
    `${arrow(before.hitDiceRemaining, after.hitDiceRemaining)} of ${after.level}`,
  );
};

/**
 * Slots are the one pool that can legitimately do nothing on a short rest, so
 * the line says which of the three reasons applies rather than vanishing.
 */
const slotsLine = (
  type: RestType,
  before: CharacterSheet,
  after: CharacterSheet,
): RestSummaryLine | null => {
  const isEligible =
    type === RestType.LONG ||
    before.spellcastingProgression === SpellcastingProgression.PACT;
  const hasPool = hasMaxima(before.spellSlots) || slotTotal(before.spellSlots) > 0;

  if (!hasPool) {
    return null;
  }

  if (!isEligible) {
    return line('Spell slots', 'Come back on a long rest', false);
  }

  if (!hasMaxima(before.spellSlots)) {
    return line('Spell slots', 'No maxima recorded — not restored', false);
  }

  const gained = slotTotal(after.spellSlots) - slotTotal(before.spellSlots);

  if (gained <= 0) {
    return line('Spell slots', 'Already full', false);
  }

  return line('Spell slots', `${gained} restored`);
};

const deathSavesLine = (
  before: CharacterSheet,
  after: CharacterSheet,
): RestSummaryLine | null => {
  const hadMarks = before.deathSaveSuccesses > 0 || before.deathSaveFailures > 0;
  const isCleared = after.deathSaveSuccesses === 0 && after.deathSaveFailures === 0;

  return hadMarks && isCleared ? line('Death saves', 'Cleared') : null;
};

const resourceLines = (
  type: RestType,
  before: ClassResource[],
  after: ClassResource[],
): RestSummaryLine[] => {
  const afterById = new Map(
    after.map((resource) => {
      return [resource.id, resource];
    }),
  );

  return before
    .filter((resource) => {
      return TRIGGERS[type].includes(resource.resetTrigger);
    })
    .map((resource) => {
      const label = resourceLabel(resource);
      const next = afterById.get(resource.id);

      if (!next) {
        return null;
      }

      if (resource.maxValue === null) {
        return line(label, 'No max recorded — not restored', false);
      }

      if (next.current === resource.current) {
        return line(label, `${next.current} / ${next.maxValue} — already full`, false);
      }

      return line(label, `${arrow(resource.current, next.current)} of ${next.maxValue}`);
    })
    .filter((entry): entry is RestSummaryLine => {
      return entry !== null;
    });
};

const itemLines = (
  before: InventoryItem[],
  after: InventoryItem[],
): RestSummaryLine[] => {
  const afterById = new Map(
    after.map((item) => {
      return [item.id, item];
    }),
  );

  return before
    .filter((item) => {
      return item.resetOnLongRest;
    })
    .map((item) => {
      const next = afterById.get(item.id);

      if (!next) {
        return null;
      }

      if (item.maxUses === null) {
        return line(item.name, 'No max uses recorded — not restored', false);
      }

      if ((next.usesRemaining ?? 0) === (item.usesRemaining ?? 0)) {
        return line(
          item.name,
          `${next.usesRemaining ?? 0} / ${next.maxUses} uses — already full`,
          false,
        );
      }

      return line(
        item.name,
        `${arrow(item.usesRemaining ?? 0, next.usesRemaining ?? 0)} of ${next.maxUses} uses`,
      );
    })
    .filter((entry): entry is RestSummaryLine => {
      return entry !== null;
    });
};

/**
 * What the rest meant, read off the before/after pair the client already holds.
 *
 * Deliberately computed here rather than returned by the endpoint: the wording
 * is a UI concern, and the client has both halves anyway — the cache before the
 * action, the response after it.
 */
export const restSummary = (
  type: RestType,
  before: RestSnapshot,
  after: RestSnapshot,
): RestSummaryLine[] => {
  const sheetLines = [
    hitPointsLine(before.sheet, after.sheet),
    hitDiceLine(before.sheet, after.sheet),
    type === RestType.LONG && before.sheet.tempHp > 0
      ? line(
          'Temp hp',
          `${arrow(before.sheet.tempHp, after.sheet.tempHp)} — a long rest ends them`,
        )
      : null,
    deathSavesLine(before.sheet, after.sheet),
    slotsLine(type, before.sheet, after.sheet),
  ].filter((entry): entry is RestSummaryLine => {
    return entry !== null;
  });

  return [
    ...sheetLines,
    ...resourceLines(type, before.classResources, after.classResources),
    ...(type === RestType.LONG
      ? itemLines(before.inventoryItems, after.inventoryItems)
      : []),
  ];
};
