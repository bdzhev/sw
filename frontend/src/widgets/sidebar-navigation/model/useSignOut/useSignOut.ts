import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

import { signOut } from '@shared/api/auth';
import { useUser } from '@entities/user';

export const useSignOut = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      setUser(null);
      router.replace('/');
    },
  });

  return { signOut: mutate, isSigningOut: isPending };
};
