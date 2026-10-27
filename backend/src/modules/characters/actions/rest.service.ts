import { and, asc, eq, inArray, isNotNull, sql } from 'drizzle-orm';

import {
  assertOwnedCharacter,
  characterSheets,
  classResources,
  db,
  inventoryItems,
} from '@shared/db';

import { nextSheetAfterRest } from './rest.math';
import type { RestInput } from './rest.schemas';

type SheetRow = typeof characterSheets.$inferSelect;
type ResourceRow = typeof classResources.$inferSelect;
type ItemRow = typeof inventoryItems.$inferSelect;

/**
 * `both` is in each list because a long rest restores everything a short rest
 * does. That is the whole reason `reset_trigger` has four values rather than
 * being a short/long flag.
 */
const RESET_TRIGGERS = {
  short: ['short', 'both'],
  long: ['long', 'both'],
} as const;

export type RestOutcome =
  | { status: 'not-found' }
  | { status: 'too-many-dice'; remaining: number }
  | {
      status: 'ok';
      sheet: SheetRow;
      classResources: ResourceRow[];
      inventoryItems: ItemRow[];
    };

/**
 * One rest, one transaction, across three tables.
 *
 * The backend owns no rules data here: `class_resources.max_value` and
 * `spell_slots.max` are stored per row, so a reset is `current = max` read off
 * the rows themselves. Rows with no max recorded are left alone — the traits
 * tab refuses to guess a pool size and this must not guess on its behalf.
 */
export const applyRest = async (
  characterId: string,
  userId: number,
  input: RestInput
): Promise<RestOutcome> => {
  return db.transaction(async (tx): Promise<RestOutcome> => {
    if (!(await assertOwnedCharacter(tx, characterId, userId))) {
      return { status: 'not-found' };
    }

    // FOR UPDATE is defence in depth: the client freezes autosave for the round
    // trip, but a second tab's PATCH should queue behind this rather than
    // interleave with the read-compute-write below.
    const current = await tx
      .select()
      .from(characterSheets)
      .where(eq(characterSheets.characterId, characterId))
      .for('update');

    const sheet = current[0];

    if (!sheet) {
      return { status: 'not-found' };
    }

    if (input.type === 'short' && input.diceSpent > sheet.hitDiceRemaining) {
      // A clamp would spend dice the player did not have and say nothing.
      return { status: 'too-many-dice', remaining: sheet.hitDiceRemaining };
    }

    const updated = await tx
      .update(characterSheets)
      .set({
        ...nextSheetAfterRest(sheet, input),
        lastWriteSeq: sql`${characterSheets.lastWriteSeq} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(characterSheets.characterId, characterId))
      .returning();

    await tx
      .update(classResources)
      .set({ current: sql<number>`${classResources.maxValue}` })
      .where(
        and(
          eq(classResources.characterId, characterId),
          isNotNull(classResources.maxValue),
          inArray(classResources.resetTrigger, [...RESET_TRIGGERS[input.type]])
        )
      );

    if (input.type === 'long') {
      await tx
        .update(inventoryItems)
        .set({ usesRemaining: sql<number>`${inventoryItems.maxUses}` })
        .where(
          and(
            eq(inventoryItems.characterId, characterId),
            eq(inventoryItems.resetOnLongRest, true),
            isNotNull(inventoryItems.maxUses)
          )
        );
    }

    // Read both collections whole rather than keeping the UPDATEs' RETURNING:
    // the client adopts entire lists, and a partial list would drop every row
    // the rest did not touch.
    const [resourceRows, itemRows] = await Promise.all([
      tx
        .select()
        .from(classResources)
        .where(eq(classResources.characterId, characterId))
        .orderBy(asc(classResources.sortOrder), asc(classResources.createdAt)),
      tx
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.characterId, characterId))
        .orderBy(asc(inventoryItems.sortOrder), asc(inventoryItems.createdAt)),
    ]);

    return {
      status: 'ok',
      sheet: updated[0],
      classResources: resourceRows,
      inventoryItems: itemRows,
    };
  });
};
