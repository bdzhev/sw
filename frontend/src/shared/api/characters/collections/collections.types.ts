import type {
  Attack,
  CharacterSpell,
  ClassResource,
  InventoryItem,
  Trait,
} from '../types';

/**
 * The five per-character sub-collections.
 *
 * The member value is the **field name on `CharacterDetail`**, not the URL
 * segment — three of them differ (`classResources` is served from `/resources`,
 * `inventoryItems` from `/items`). Keeping the enum on the field name is what
 * lets the cache patch index `old[key]` directly; the segment is a lookup in
 * `COLLECTION_SEGMENTS`.
 */
export enum CollectionKey {
  ATTACKS = 'attacks',
  TRAITS = 'traits',
  CLASS_RESOURCES = 'classResources',
  INVENTORY_ITEMS = 'inventoryItems',
  SPELLS = 'spells',
}

/** Maps a collection key to the row type `GET /character/:id` returns for it. */
export interface CollectionRow {
  [CollectionKey.ATTACKS]: Attack;
  [CollectionKey.TRAITS]: Trait;
  [CollectionKey.CLASS_RESOURCES]: ClassResource;
  [CollectionKey.INVENTORY_ITEMS]: InventoryItem;
  [CollectionKey.SPELLS]: CharacterSpell;
}

/** A create body is the row without the fields the server owns. */
export type CollectionCreate<K extends CollectionKey> = Partial<
  Omit<CollectionRow[K], 'id' | 'characterId' | 'createdAt'>
>;

export type CollectionPatch<K extends CollectionKey> = CollectionCreate<K>;
