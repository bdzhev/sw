import type { useForm } from 'vee-validate';

export interface CfProviderProps {
  onSubmit: (e?: Event) => void | Promise<void>;
  formContext: ReturnType<typeof useForm>;
}
