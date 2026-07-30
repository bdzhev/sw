export interface UseCreateCharacterOptions {
  /**
   * Callback to be called when request errors.
   */
  onError?: () => void;
  /**
   * Callback to be called when request succeeds.
   */
  onSuccess?: () => void;
}
