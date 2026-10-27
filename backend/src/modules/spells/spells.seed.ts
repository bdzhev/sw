/**
 * Fills the `spells` reference library from the committed snapshot.
 *
 * Run with `bun run db:seed`. No network: the SRD data is checked in, so a
 * fresh clone can seed offline and gets byte-identical rows to everyone else.
 * `bun run spells:refresh` is what re-pulls it from the API.
 *
 * Safe to re-run — every row is upserted on `slug`, so this is a no-op the
 * second time and a resume if it dies halfway.
 */
import { sql } from 'drizzle-orm';

import { spells, db } from '@shared/db';

import { SPELLS_DATA_PATH, type SpellRow } from './spells.data';

/** Postgres caps a statement at 65535 bound parameters; 13 columns per row. */
const CHUNK_SIZE = 500;

const seed = async (): Promise<void> => {
  const rows = (await Bun.file(SPELLS_DATA_PATH).json()) as SpellRow[];

  if (rows.length === 0) {
    throw new Error('spells.data.json is empty — run `bun run spells:refresh`');
  }

  console.log(`Seeding ${rows.length} spells...`);

  for (let offset = 0; offset < rows.length; offset += CHUNK_SIZE) {
    const chunk = rows.slice(offset, offset + CHUNK_SIZE);

    // `slug` is unique, so a naive insert throws on the second run. The upsert
    // is what makes re-running a no-op and a failed run resumable.
    await db
      .insert(spells)
      .values(chunk)
      .onConflictDoUpdate({
        target: spells.slug,
        set: {
          name: sql`excluded.name`,
          level: sql`excluded.level`,
          school: sql`excluded.school`,
          classes: sql`excluded.classes`,
          castingTime: sql`excluded.casting_time`,
          rangeText: sql`excluded.range_text`,
          components: sql`excluded.components`,
          duration: sql`excluded.duration`,
          concentration: sql`excluded.concentration`,
          ritual: sql`excluded.ritual`,
          description: sql`excluded.description`,
          higherLevel: sql`excluded.higher_level`,
        },
      });
  }

  console.log(`Done — ${rows.length} spells upserted.`);
};

try {
  await seed();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
