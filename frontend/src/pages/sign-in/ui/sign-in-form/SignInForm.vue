<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import { getApiErrorMessage } from '@shared/lib/http';
import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { SensitiveInput } from '@shared/ui/sensitive-input';
import { Text } from '@shared/ui/text';

import { useSignIn } from '@entities/user';

const router = useRouter();

const schema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
);

const form = useForm({ validationSchema: schema });

const handleSignInSuccess = () => {
  router.replace({ name: RouteName.APP_HOME });
};

const { signIn, isSigningIn, signInError, resetSignInError } = useSignIn({
  onSuccess: handleSignInSuccess,
});

/** A failure is about the credentials just submitted, so a new attempt clears it. */
const handleSubmit = form.handleSubmit((values) => {
  resetSignInError();
  signIn(values);
});

const errorMessage = computed(() => {
  if (!signInError.value) {
    return null;
  }

  return getApiErrorMessage(signInError.value, 'Could not sign in. Please try again.');
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Input name="username" placeholder="Username" autocomplete="username" />

    <SensitiveInput
      name="password"
      placeholder="Password"
      autocomplete="current-password"
    />

    <Text v-if="errorMessage" theme="danger" size="sm" role="alert" class="mb-4">
      {{ errorMessage }}
    </Text>

    <Button
      width="full"
      type="submit"
      class="min-h-11 md:min-h-0"
      :is-loading="isSigningIn"
    >
      Sign in
    </Button>
  </form>
</template>
