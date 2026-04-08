import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const getValidationSchema = (confirmationText: string) => {
  return toTypedSchema(
    z.object({
      confirmationText: z.string().refine((val) => {
        return val === confirmationText;
      }),
    }),
  );
};
