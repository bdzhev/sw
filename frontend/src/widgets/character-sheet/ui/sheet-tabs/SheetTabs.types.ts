import type { SheetTab, SheetTabLink } from '@widgets/character-sheet/model/sheet-tabs';

export interface SheetTabsProps {
  tabs: readonly SheetTabLink[];
  activeTab: SheetTab;
}
