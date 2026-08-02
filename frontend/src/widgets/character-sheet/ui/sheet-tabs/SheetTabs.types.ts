import type {
  SheetTab,
  SheetTabDefinition,
} from '@widgets/character-sheet/model/sheet-tabs';

export interface SheetTabsProps {
  tabs: readonly SheetTabDefinition[];
  activeTab: SheetTab;
}
