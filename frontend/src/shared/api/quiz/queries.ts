const BASE_QUERY_KEY = 'quiz';

export const quizQueries = {
  quizItems: () => {
    return [BASE_QUERY_KEY, 'questions'];
  },
};
