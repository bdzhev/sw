// Two routers, one module: the path split is deliberate.
// Symbol name always matches its mount path segment + `Routes`.
export { charactersRoutes } from './characters.routes'; // /characters - collection
export { characterRoutes } from './character.routes'; // /character  - single resource
