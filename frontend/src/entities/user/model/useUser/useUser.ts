import { ref, readonly, computed } from 'vue';

import { getMe, refreshToken } from '@shared/api/auth';
import type { User } from '@shared/api/auth';

const user = ref<User | null>(null);
const isLoading = ref(true);

async function loadUser() {
  try {
    await refreshToken();
    user.value = await getMe();
  } catch {
    user.value = null;
  } finally {
    isLoading.value = false;
  }
}

loadUser();

export function useUser() {
  return {
    user: readonly(user),
    isLoggedIn: computed(() => Boolean(user.value)),
    isLoading: readonly(isLoading),
    loadUser,
    setUser: (u: User | null) => { user.value = u; },
  };
}
