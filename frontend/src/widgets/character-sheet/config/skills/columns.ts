import { createColumnHelper } from '@tanstack/vue-table';

import type { DataTableColumns, DataTableFeatures } from '@shared/ui/data-table';

import type { SkillRowView } from './types';

const helper = createColumnHelper<DataTableFeatures, SkillRowView>();

/**
 * Headers only — the body is rendered by `SkillGroup`/`SkillRow`, because a
 * proficiency cell is a control that emits and the rows are sectioned by
 * governing ability. Keep the order in step with `SkillRow`'s cells.
 */
export const SKILL_COLUMNS: DataTableColumns<SkillRowView> = [
  helper.accessor('label', { header: 'Skill' }),
  helper.accessor('abilityLabel', { header: 'Ability' }),
  helper.accessor('proficiency', { header: 'Prof' }),
  helper.accessor('modifier', { header: 'Mod' }),
] as DataTableColumns<SkillRowView>;
