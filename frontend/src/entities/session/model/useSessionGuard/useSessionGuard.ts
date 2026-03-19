import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

import type { UseSessionGuardOptions } from './useSessionGuard.types';

export const useSessionGuard = (options: UseSessionGuardOptions) => {
  const { key, redirectTo = '/' } = options;

  const router = useRouter();

  const signUpSuccessFlag = useStorage(key, false, sessionStorage);

  const allowAccess = () => {
    signUpSuccessFlag.value = true;
  };

  const checkAccess = () => {
    if (!signUpSuccessFlag.value) {
      router.replace(redirectTo);
    } else {
      signUpSuccessFlag.value = false;
    }
  };

  return { allowAccess, checkAccess };
};
