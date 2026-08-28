/** Level 0 is a cantrip and is never written as "Level 0" on a sheet. */
export const spellLevelLabel = (level: number): string => {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
};

export const slotLevelLabel = (slotLevel: number): string => {
  return `Level ${slotLevel}`;
};

/** The one-line summary under a spell name: "Level 3 · Evocation · Concentration". */
export const spellMetaLine = (parts: (string | false | null | undefined)[]): string => {
  return parts
    .filter((part): part is string => {
      return Boolean(part);
    })
    .join(' · ');
};

/** Components arrive folded — `M (bat guano and sulfur)` is one entry. */
export const spellComponentsLabel = (components: string[]): string => {
  return components.join(', ');
};
