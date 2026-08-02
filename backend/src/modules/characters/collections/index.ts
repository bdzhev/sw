// The five per-character sub-collections. `character.routes.ts` mounts them onto
// the single-character router; nothing outside this module imports them.
export { attacksRoutes } from './attacks';
export { traitsRoutes } from './traits';
export { resourcesRoutes } from './resources';
export { itemsRoutes } from './items';
export { characterSpellsRoutes } from './spells';
