import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

import { CharacterStatus, type SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';

import { useCharacter, useSheetAutosave } from '@entities/characters';

import type { UseSheetShell } from './useSheetShell.types';

/**
 * Everything a top-level character surface needs to own: the query, the two
 * redirects, and the autosave lifecycle.
 *
 * Extracted because there are now **two** such surfaces — the sheet and the
 * items page — and both write sheet fields. Duplicating the teardown listeners
 * is how one of them ends up silently losing the last edit before a tab close,
 * which is the exact failure the save strategy exists to prevent.
 *
 * `attach` is idempotent for the same character, so moving between the two does
 * not clear a pending patch mid-flight.
 */
export const useSheetShell = (): UseSheetShell => {
  const route = useRoute();
  const router = useRouter();
  const characterId = route.params.id as string;

  const { character, isFetchingCharacter, isCharacterNotFound } = useCharacter({
    id: characterId,
  });
  const autosave = useSheetAutosave();

  const sheet = computed(() => {
    return character.value?.sheet;
  });

  watch(
    character,
    (detail) => {
      if (!detail) {
        return;
      }

      // The quiz is the only path to a character with scores, so a pending one
      // goes back to it rather than being shown an all-tens sheet.
      if (detail.character.status === CharacterStatus.PENDING) {
        void router.replace({ name: RouteName.APP_BUILDER, params: { id: characterId } });

        return;
      }

      autosave.attach(characterId, detail.sheet);
    },
    { immediate: true },
  );

  watch(isCharacterNotFound, (notFound) => {
    if (notFound) {
      void router.replace({ name: RouteName.NOT_FOUND });
    }
  });

  const handlePatch = (patch: SheetPatch, immediate = false): void => {
    autosave.patchSheet(patch, immediate);
  };

  const handleVisibilityChange = (): void => {
    // visibilitychange is the only teardown signal iOS reliably fires, and this
    // app is explicitly for phones at a table.
    if (document.visibilityState === 'hidden') {
      autosave.flushOnTeardown();
    }
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', autosave.flushOnTeardown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', autosave.flushOnTeardown);
    autosave.stopBadgeTimer();
  });

  onBeforeRouteLeave(() => {
    autosave.detach();
  });

  return { characterId, character, sheet, isFetchingCharacter, handlePatch };
};
