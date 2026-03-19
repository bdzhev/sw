const BASE_QUERY_KEY = 'quiz';

export const quizQueries = {
  quizItems: () => {
    return [BASE_QUERY_KEY, 'questions'];
  },
  quizResults: (characterId: string) => {
    return [BASE_QUERY_KEY, characterId, 'results'];
  },
  generateStats: (characterId: string) => {
    return [BASE_QUERY_KEY, characterId, 'generateStats'];
  },
};
