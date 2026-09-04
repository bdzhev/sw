import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';

import { traitFormSchema } from './traitForm.schema';
import type { UseTraitFormOptions } from './useTraitForm.types';

export const useTraitForm = (options: UseTraitFormOptions) => {
  const { getTrait, isOpen, onSubmit } = options;

  const form = useForm({
    validationSchema: traitFormSchema,
    initialValues: { name: '', description: '', quickReference: false },
  });

  const title = computed(() => {
    return getTrait() ? 'Edit trait' : 'Add a trait';
  });

  const submit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name,
      tag: values.tag,
      description: values.description.trim() || null,
      quickReference: values.quickReference,
    });
  });

  const handleSubmit = (event?: Event) => {
    void submit(event);
  };

  /**
   * The dialog stays mounted between openings, so the form is reseeded on open
   * rather than at mount — otherwise editing a second trait shows the first one.
   */
  watch(isOpen, (open) => {
    if (!open) {
      return;
    }

    const trait = getTrait();

    form.resetForm({
      values: {
        name: trait?.name ?? '',
        tag: trait?.tag,
        description: trait?.description ?? '',
        quickReference: trait?.quickReference ?? false,
      },
    });
  });

  return { title, handleSubmit };
};
