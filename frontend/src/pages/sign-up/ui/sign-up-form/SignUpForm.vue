<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import { getApiErrorMessage } from '@shared/lib/http';
import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { FormInput } from '@shared/ui/form-input';
import { SensitiveInput } from '@shared/ui/sensitive-input';
import { Text } from '@shared/ui/text';

import { useSignUp } from '@entities/user';

const router = useRouter();

const schema = toTypedSchema(
  z
    .object({
      username: z.string().min(1, 'Username is required'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string(),
    })
    .refine(
      (d) => {
        return d.password === d.confirmPassword;
      },
      {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      },
    ),
);

const form = useForm({ validationSchema: schema });

const handleSignUpSuccess = () => {
  router.replace({ name: RouteName.APP_HOME });
};

const { signUp, isSigningUp, signUpError, resetSignUpError } = useSignUp({
  onSuccess: handleSignUpSuccess,
});

const handleSubmit = form.handleSubmit((values) => {
  resetSignUpError();
  signUp(values);
});

const errorMessage = computed(() => {
  if (!signUpError.value) {
    return null;
  }

  return getApiErrorMessage(signUpError.value, 'Could not sign up. Please try again.');
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <FormInput name="username" placeholder="Username" autocomplete="username" />

    <SensitiveInput name="password" placeholder="Password" autocomplete="new-password" />

    <SensitiveInput
      name="confirmPassword"
      placeholder="Confirm password"
      autocomplete="new-password"
    />

    <Text v-if="errorMessage" theme="danger" size="sm" role="alert" class="mb-4">
      {{ errorMessage }}
    </Text>

    <Button
      width="full"
      type="submit"
      class="min-h-11 md:min-h-0"
      :is-loading="isSigningUp"
    >
      Sign up
    </Button>
  </form>
</template>
