export interface UseHasScrolledOptions {
  threshold: number;
  throttle?: number;
  setHasScrolled: (value: boolean) => void;
}
