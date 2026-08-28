/**
 * Rebuilds `spells.data.json` from the 5e-bits SRD API.
 *
 * Run with `bun run spells:refresh`, and only when the SRD data itself needs
 * re-pulling — the snapshot it writes is committed, so seeding a database needs
 * no network at all. Keeping the two apart is the point: a fresh clone must not
 * depend on a third-party API being up.
 */
import { SPELLS_DATA_PATH, type SpellRow } from './spells.data';

const API_BASE = 'https://www.dnd5eapi.co/api/2014/spells';

/** Courtesy gap between the ~319 detail calls. */
const REQUEST_DELAY_MS = 60;

interface SpellIndexResponse {
  results: { index: string }[];
}

interface SpellDetailResponse {
  index: string;
  name: string;
  level: number;
  desc?: string[];
  higher_level?: string[];
  range?: string;
  components?: string[];
  material?: string;
  ritual?: boolean;
  concentration?: boolean;
  duration?: string;
  casting_time?: string;
  school?: { name: string };
  classes?: { index: string }[];
}

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} answered ${response.status}`);
  }

  return (await response.json()) as T;
};

/** The API hands back paragraphs; the column is one text blob. */
const joinParagraphs = (paragraphs: string[] | undefined): string | null => {
  return paragraphs?.length ? paragraphs.join('\n\n') : null;
};

/**
 * The API keeps the material text in its own field, but the column is a plain
 * `string[]`. Folding it into the `M` entry — `M (bat guano and sulfur)` —
 * keeps the text without a migration and reads naturally in the detail dialog.
 */
const foldMaterial = (
  components: string[] | undefined,
  material: string | undefined
): string[] => {
  return (components ?? []).map((component) => {
    return component === 'M' && material ? `M (${material})` : component;
  });
};

const toRow = (detail: SpellDetailResponse): SpellRow => {
  return {
    slug: detail.index,
    name: detail.name,
    level: detail.level,
    school: detail.school?.name ?? null,
    // Flattened to bare keys — that is what the `classes` jsonb filter compares
    // the search's `class` param against.
    classes: (detail.classes ?? []).map((entry) => {
      return entry.index;
    }),
    castingTime: detail.casting_time ?? null,
    rangeText: detail.range ?? null,
    components: foldMaterial(detail.components, detail.material),
    duration: detail.duration ?? null,
    concentration: detail.concentration ?? false,
    ritual: detail.ritual ?? false,
    description: joinParagraphs(detail.desc),
    higherLevel: joinParagraphs(detail.higher_level),
  };
};

const refresh = async (): Promise<void> => {
  console.log('Fetching spell index...');

  const index = await fetchJson<SpellIndexResponse>(API_BASE);

  console.log(`${index.results.length} spells to fetch.`);

  const rows: SpellRow[] = [];

  for (const entry of index.results) {
    rows.push(
      toRow(await fetchJson<SpellDetailResponse>(`${API_BASE}/${entry.index}`))
    );

    if (rows.length % 25 === 0) {
      console.log(`  ${rows.length}/${index.results.length}`);
    }

    await delay(REQUEST_DELAY_MS);
  }

  // Sorted by slug so a re-run produces a diff of what actually changed rather
  // than a reshuffle of 319 lines.
  rows.sort((first, second) => {
    return first.slug.localeCompare(second.slug);
  });

  await Bun.write(SPELLS_DATA_PATH, `${JSON.stringify(rows, null, 2)}\n`);

  console.log(`Wrote ${rows.length} spells to ${SPELLS_DATA_PATH.pathname}.`);
};

try {
  await refresh();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
