export const ITEM_NAME_MAX_LENGTH = 60;
export const ITEM_DESCRIPTION_MAX_LENGTH = 2000;

/** A ceiling only so a typo cannot store six digits. */
export const ITEM_QUANTITY_LIMIT = 999;
export const ITEM_USES_LIMIT = 999;
export const CURRENCY_LIMIT = 9999;

/**
 * Matches `MAX_MODIFIER` in the backend's collections/items/items.schemas.ts.
 * Kept in step so the form cannot offer a value the server rejects.
 */
export const STAT_MODIFIER_LIMIT = 20;
