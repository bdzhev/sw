import { mediaFrom } from '../../ui/breakpoints';
import { Device } from './types';

/**
 * Queried from the smallest device up with min-width, mirroring how the
 * Tailwind variants resolve. The previous max-width form overlapped the CSS by
 * a pixel — at exactly 768px an element was both Device.Mobile and `md:`.
 */
export const getDevice = (): Device => {
  if (window.matchMedia(mediaFrom('lg')).matches) {
    return Device.Desktop;
  }

  if (window.matchMedia(mediaFrom('md')).matches) {
    return Device.Tablet;
  }

  return Device.Mobile;
};
