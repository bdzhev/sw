import { useFadeInAnimation, useTextAnimation } from '@shared/lib/animations';

export const useTopSectionAnimation = () => {
  /**
   * Reverting to DOM is visible after animation completion in this particular case.
   * Intentionally decided not to revert for the main title to keep things smooth.
   */
  const animateCatchPhrase = useFadeInAnimation({ duration: 1.25, y: 200 });
  const animateDescription = useFadeInAnimation({
    delay: 0.8,
    shouldRevert: true,
  });

  useTextAnimation({
    elementSelector: '#landingSlogan',
    type: 'chars',
    animate: animateCatchPhrase,
  });

  useTextAnimation({
    elementSelector: '#landingSloganDescription1',
    type: 'words',
    animate: animateDescription,
  });

  useTextAnimation({
    elementSelector: '#landingSloganDescription2',
    type: 'words',
    animate: animateDescription,
  });
};
