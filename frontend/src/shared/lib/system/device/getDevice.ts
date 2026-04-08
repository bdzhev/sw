import { Device } from './types';

export const getDevice = (): Device => {
  if (window.matchMedia('(max-width: 768px)').matches) {
    return Device.Mobile;
  }

  if (window.matchMedia('(max-width: 1024px)').matches) {
    return Device.Tablet;
  }

  return Device.Desktop;
};
