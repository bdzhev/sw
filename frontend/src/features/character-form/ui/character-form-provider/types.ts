import type { FormContext } from 'vee-validate';

/**
 * What the provider shares with its buttons. One spelling for the channel: the
 * provide site used to say `ReturnType<typeof useForm>` while both inject sites
 * said `FormContext`.
 */
export type CharacterFormContext = FormContext;
