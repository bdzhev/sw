import { useForm } from 'vee-validate';

import { createQuizSchema } from './quiz.schema';
import type { UseQuizFormOptions } from './useQuizForm.types';

export const useQuizForm = (options: UseQuizFormOptions) => {
  const { initialValues, items } = options;

  const quizForm = useForm({
    initialValues,
    validationSchema: createQuizSchema(items),
    validateOnMount: true,
    keepValuesOnUnmount: true,
  });

  return quizForm;
};
