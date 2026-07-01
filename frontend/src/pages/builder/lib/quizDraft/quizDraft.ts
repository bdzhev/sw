import type { QuizResults } from '@shared/api/quiz';

const draftKey = (characterId: string) => {
  return `builder:quiz-draft:${characterId}`;
};

export const readQuizDraft = (characterId: string): QuizResults => {
  try {
    const raw = localStorage.getItem(draftKey(characterId));

    return raw ? (JSON.parse(raw) as QuizResults) : {};
  } catch {
    return {};
  }
};

export const writeQuizDraft = (
  characterId: string,
  results: QuizResults,
): void => {
  try {
    localStorage.setItem(draftKey(characterId), JSON.stringify(results));
  } catch {
    /* ignore write failures (quota, private mode) */
  }
};

export const clearQuizDraft = (characterId: string): void => {
  try {
    localStorage.removeItem(draftKey(characterId));
  } catch {
    /* ignore */
  }
};
