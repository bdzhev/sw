import { DEFAULT_QUIZ_STEP, LAST_STEP } from '../config';

export const getQuizProgress = (
  progressStep: number | null,
  currentStep: number,
) => {
  /**
   * If the last properly filled step was the one before the last.
   */
  if (progressStep === null) {
    return DEFAULT_QUIZ_STEP;
  }

  if (currentStep === LAST_STEP) {
    return LAST_STEP;
  }

  if (currentStep > progressStep) {
    return currentStep;
  } else {
    return progressStep;
  }
};
