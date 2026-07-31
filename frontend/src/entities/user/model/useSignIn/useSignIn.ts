import { noop, useMutation } from '@tanstack/vue-query';

import { authQueries, signIn as signInRequest } from '@shared/api/auth';

import { useUser } from '../useUser';
import type { SignInPayload, UseSignInOptions } from './useSignIn.types';

export const useSignIn = (options?: UseSignInOptions) => {
  const { onSuccess = noop } = options || {};

  const { setUser } = useUser();

  const { mutate, isPending, error, reset } = useMutation({
    mutationKey: authQueries.signIn(),
    mutationFn: (payload: SignInPayload) => {
      return signInRequest(payload.username, payload.password);
    },
    onSuccess: (user) => {
      setUser(user);
      onSuccess();
    },
  });

  return {
    signIn: mutate,
    isSigningIn: isPending,
    signInError: error,
    resetSignInError: reset,
  };
};
