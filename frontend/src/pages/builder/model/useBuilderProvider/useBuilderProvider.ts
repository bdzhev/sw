import { inject } from "vue";

import { BUILDER_QUIZ_CTX_KEY } from "../../config";
import { type BuilderContextValues } from "../BuilderProvider";

export const useBuilderProvider = () => {
  const ctx = inject<BuilderContextValues>(BUILDER_QUIZ_CTX_KEY);

  return ctx;
};
