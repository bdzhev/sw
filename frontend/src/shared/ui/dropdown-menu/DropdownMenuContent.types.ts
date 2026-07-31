export type DropdownMenuAlign = 'start' | 'center' | 'end';

export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left';

export interface DropdownMenuContentProps {
  align?: DropdownMenuAlign;
  side?: DropdownMenuSide;
  sideOffset?: number;
}
