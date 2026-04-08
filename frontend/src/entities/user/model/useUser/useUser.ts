import { ref, readonly, computed } from "vue";

import { getMe, refreshToken } from "@shared/api/auth";
import type { User } from "@shared/api/auth";

const user = ref<User | null>(null);
const isLoading = ref(true);

const loadUser = async (): Promise<void> => {
  try {
    await refreshToken();
    user.value = await getMe();
  } catch {
    user.value = null;
  } finally {
    isLoading.value = false;
  }
};

loadUser();

export const useUser = () => {
  return {
    user: readonly(user),
    isLoggedIn: computed(() => {
      return Boolean(user.value);
    }),
    isLoading: readonly(isLoading),
    loadUser,
    setUser: (u: User | null): void => {
      user.value = u;
    },
  };
};
