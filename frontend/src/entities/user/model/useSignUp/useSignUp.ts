import { noop, useMutation } from '@tanstack/vue-query';

import { authQueries, signUp as signUpRequest } from '@shared/api/auth';

import { useUser } from '../useUser';
import type { SignUpPayload, UseSignUpOptions } from './useSignUp.types';

export const useSignUp = (options?: UseSignUpOptions) => {
  const { onSuccess = noop } = options || {};

  const { setUser } = useUser();

  const { mutate, isPending, error, reset } = useMutation({
    mutationKey: authQueries.signUp(),
    mutationFn: (payload: SignUpPayload) => {
      return signUpRequest(payload.username, payload.password);
    },
    onSuccess: (user) => {
      setUser(user);
      onSuccess();
    },
  });

  return {
    signUp: mutate,
    isSigningUp: isPending,
    signUpError: error,
    resetSignUpError: reset,
  };
};
