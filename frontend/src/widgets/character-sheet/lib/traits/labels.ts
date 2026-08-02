import type { ClassResource } from '@shared/api/characters';

import { KNOWN_RESOURCE_LABELS } from '@widgets/character-sheet/config/traits';

/** A homebrew resource has no entry in the SRD map, so its key is its name. */
export const resourceLabel = (resource: ClassResource): string => {
  return KNOWN_RESOURCE_LABELS[resource.resourceKey] ?? resource.resourceKey;
};
