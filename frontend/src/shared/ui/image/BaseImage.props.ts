import type { ImageFolder } from '@shared/lib/assets';

export interface ImageProps {
  folder: ImageFolder;
  name: string;
  format?: 'png' | 'svg';
  alt?: string;
}
