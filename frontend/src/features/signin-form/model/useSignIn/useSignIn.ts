import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

import { signIn as signInRequest } from '@shared/api/auth';

export const useSignIn = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: signInRequest,
    onSuccess: () => {
      router.replace('/app');
    },
  });

  return { signIn: mutate, isSigningIn: isPending };
};
