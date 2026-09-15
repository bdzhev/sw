import { describe, expect, it } from 'vitest';

import {
  ResetTrigger,
  RestType,
  SpellcastingProgression,
  type CharacterSheet,
  type ClassResource,
  type InventoryItem,
} from '@shared/api/characters';

import { restSummary } from '../restSummary';
import type { RestSnapshot } from '../restSummary';

const sheet = (overrides: Partial<CharacterSheet> = {}): CharacterSheet => {
  return {
    hpCurrent: 4,
    hpMax: 13,
    tempHp: 0,
    level: 5,
    hitDiceRemaining: 5,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    spellcastingProgression: SpellcastingProgression.NONE,
    spellSlots: { current: {} },
    ...overrides,
  } as CharacterSheet;
};

const resource = (overrides: Partial<ClassResource> = {}): ClassResource => {
  return {
    id: 'r1',
    resourceKey: 'ki-points',
    maxValue: 5,
    current: 0,
    resetTrigger: ResetTrigger.SHORT,
    ...overrides,
  } as ClassResource;
};

const item = (overrides: Partial<InventoryItem> = {}): InventoryItem => {
  return {
    id: 'i1',
    name: 'Healing potion charges',
    maxUses: 3,
    usesRemaining: 0,
    resetOnLongRest: true,
    ...overrides,
  } as InventoryItem;
};

const snapshot = (overrides: Partial<RestSnapshot> = {}): RestSnapshot => {
  return {
    sheet: sheet(),
    classResources: [],
    inventoryItems: [],
    ...overrides,
  };
};

const detailOf = (lines: ReturnType<typeof restSummary>, label: string): string => {
  return (
    lines.find((entry) => {
      return entry.label === label;
    })?.detail ?? ''
  );
};

describe('restSummary', () => {
  it('reports the hp and hit-dice movement of a short rest', () => {
    const lines = restSummary(
      RestType.SHORT,
      snapshot(),
      snapshot({ sheet: sheet({ hpCurrent: 13, hitDiceRemaining: 3 }) }),
    );

    expect(detailOf(lines, 'Hit points')).toBe('4 → 13 of 13');
    expect(detailOf(lines, 'Hit dice')).toBe('5 → 3 of 5');
  });

  it('says so when a value did not move', () => {
    const lines = restSummary(RestType.SHORT, snapshot(), snapshot());

    expect(detailOf(lines, 'Hit points')).toContain('unchanged');
    expect(
      lines.every((entry) => {
        return !entry.isApplied;
      }),
    ).toBe(true);
  });

  it('names a resource with no max instead of dropping it', () => {
    const rows = [resource({ maxValue: null, current: 0 })];
    const lines = restSummary(
      RestType.SHORT,
      snapshot({ classResources: rows }),
      snapshot({ classResources: rows }),
    );

    expect(detailOf(lines, 'Ki Points')).toBe('No max recorded — not restored');
  });

  it('restores both-trigger resources on either rest', () => {
    const before = [resource({ resetTrigger: ResetTrigger.BOTH, current: 1 })];
    const after = [resource({ resetTrigger: ResetTrigger.BOTH, current: 5 })];

    expect(
      detailOf(
        restSummary(
          RestType.LONG,
          snapshot({ classResources: before }),
          snapshot({ classResources: after }),
        ),
        'Ki Points',
      ),
    ).toBe('1 → 5 of 5');
  });

  it('leaves a long-trigger resource out of a short rest', () => {
    const rows = [resource({ resetTrigger: ResetTrigger.LONG })];
    const lines = restSummary(
      RestType.SHORT,
      snapshot({ classResources: rows }),
      snapshot({ classResources: rows }),
    );

    expect(detailOf(lines, 'Ki Points')).toBe('');
  });

  it('tells a non-pact caster their slots wait for a long rest', () => {
    const slots = { current: { '1': 0 }, max: { '1': 4 } };
    const lines = restSummary(
      RestType.SHORT,
      snapshot({
        sheet: sheet({
          spellSlots: slots,
          spellcastingProgression: SpellcastingProgression.FULL,
        }),
      }),
      snapshot({
        sheet: sheet({
          spellSlots: slots,
          spellcastingProgression: SpellcastingProgression.FULL,
        }),
      }),
    );

    expect(detailOf(lines, 'Spell slots')).toBe('Come back on a long rest');
  });

  it('counts the pact slots a short rest gave back', () => {
    const pact = { spellcastingProgression: SpellcastingProgression.PACT };
    const lines = restSummary(
      RestType.SHORT,
      snapshot({
        sheet: sheet({ ...pact, spellSlots: { current: { '3': 0 }, max: { '3': 2 } } }),
      }),
      snapshot({
        sheet: sheet({ ...pact, spellSlots: { current: { '3': 2 }, max: { '3': 2 } } }),
      }),
    );

    expect(detailOf(lines, 'Spell slots')).toBe('2 restored');
  });

  it('names a pool with no maxima recorded', () => {
    const slots = { current: { '1': 1 } };
    const lines = restSummary(
      RestType.LONG,
      snapshot({ sheet: sheet({ spellSlots: slots }) }),
      snapshot({ sheet: sheet({ spellSlots: slots }) }),
    );

    expect(detailOf(lines, 'Spell slots')).toBe('No maxima recorded — not restored');
  });

  it('says nothing about slots for a character who has none', () => {
    const lines = restSummary(RestType.LONG, snapshot(), snapshot());

    expect(detailOf(lines, 'Spell slots')).toBe('');
  });

  it('reports cleared death saves and spent temp hp on a long rest', () => {
    const lines = restSummary(
      RestType.LONG,
      snapshot({ sheet: sheet({ hpCurrent: 0, tempHp: 4, deathSaveFailures: 2 }) }),
      snapshot({ sheet: sheet({ hpCurrent: 13, tempHp: 0 }) }),
    );

    expect(detailOf(lines, 'Death saves')).toBe('Cleared');
    expect(detailOf(lines, 'Temp hp')).toContain('4 → 0');
  });

  it('only reports item uses on a long rest', () => {
    const before = [item({ usesRemaining: 0 })];
    const after = [item({ usesRemaining: 3 })];

    expect(
      detailOf(
        restSummary(
          RestType.LONG,
          snapshot({ inventoryItems: before }),
          snapshot({ inventoryItems: after }),
        ),
        'Healing potion charges',
      ),
    ).toBe('0 → 3 of 3 uses');

    expect(
      detailOf(
        restSummary(
          RestType.SHORT,
          snapshot({ inventoryItems: before }),
          snapshot({ inventoryItems: after }),
        ),
        'Healing potion charges',
      ),
    ).toBe('');
  });

  it('names a long-rest item with no max uses', () => {
    const rows = [item({ maxUses: null, usesRemaining: null })];
    const lines = restSummary(
      RestType.LONG,
      snapshot({ inventoryItems: rows }),
      snapshot({ inventoryItems: rows }),
    );

    expect(detailOf(lines, 'Healing potion charges')).toBe(
      'No max uses recorded — not restored',
    );
  });
});
