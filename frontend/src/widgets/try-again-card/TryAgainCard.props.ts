export interface TryAgainCardProps {
  title?: string;
  decription: string;
  onTryAgainClick: () => void | Promise<void>;
}
