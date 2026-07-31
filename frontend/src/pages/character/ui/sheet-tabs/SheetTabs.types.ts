import type { SheetTab, SheetTabDefinition } from '../../model/useSheetTabs';

export interface SheetTabsProps {
  tabs: readonly SheetTabDefinition[];
  activeTab: SheetTab;
}
