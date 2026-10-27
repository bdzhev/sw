import type { InfiniteData } from '@tanstack/vue-query';

import type { CharactersPage } from '@shared/api/characters';

/** Shape `setQueryData` hands back for the paginated characters list. */
export type CharactersCache = InfiniteData<CharactersPage> | undefined;
