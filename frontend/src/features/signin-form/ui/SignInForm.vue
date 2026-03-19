<script setup lang="ts">
/**
 * TODO - refactor with composition pattern
 */
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Input } from '@shared/ui/input';

import { signInSchema } from '../model/schemas';
import { useSignIn } from '../model/useSignIn';

const initialValues = {
  email: '',
  password: '',
};

const { signIn, isSigningIn } = useSignIn();

const { handleSubmit: submit, meta } = useForm({
  validationSchema: toTypedSchema(signInSchema),
  initialValues,
});

const handleSubmit = submit((values) => {
  signIn(values);
});
</script>

<template>
  <div>
    <Card class="w-300">
      <form @submit.prevent="handleSubmit" class="max-w-sm space-y-4">
        <Input name="email" />
        <Input
          name="password"
          type="password"
          autocomplete="current-password"
        />
        <Button
          :is-loading="isSigningIn"
          :is-disabled="!meta.dirty || !meta.valid"
        >
          Sign in
        </Button>
      </form>
    </Card>
  </div>
</template>
