import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

import { signOut } from '@shared/api/auth';

export const useSignOut = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.replace('/');
    },
  });

  return { signOut: mutate, isSigningOut: isPending };
};
