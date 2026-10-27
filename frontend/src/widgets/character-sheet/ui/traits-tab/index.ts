import TraitsTab from './TraitsTab.vue';

export { TraitsTab };

/**
 * Only the tab itself is public. The sub-components are internal to this folder —
 * re-exporting them would invite an import that skips the tab's state, which is
 * where every mutation lives.
 */
export type {
  KnownResource,
  ResourceSubAbility,
} from '@widgets/character-sheet/config/traits';
