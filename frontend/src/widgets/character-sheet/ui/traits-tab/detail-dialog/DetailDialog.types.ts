export interface DetailDialogProps {
  open: boolean;
  title: string;
  description: string | null;
  /** Rendered under the title — the tag, or a resource's reset trigger. */
  meta?: string;
}
