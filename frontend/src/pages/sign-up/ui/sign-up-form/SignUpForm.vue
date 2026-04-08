<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import { signUp } from '@shared/api/auth';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { SensitiveInput } from '@shared/ui/sensitive-input';

import { useUser } from '@entities/user';

const router = useRouter();
const { setUser } = useUser();

const schema = toTypedSchema(
  z
    .object({
      username: z.string().min(1, 'Username is required'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string(),
    })
    .refine((d) => { return d.password === d.confirmPassword; }, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
);

const form = useForm({ validationSchema: schema });

const handleSubmit = form.handleSubmit(async (values) => {
  const user = await signUp(values.username, values.password);
  setUser(user);
  router.replace('/app');
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Input name="username" placeholder="Username" autocomplete="username" />
    <SensitiveInput
      name="password"
      placeholder="Password"
      autocomplete="new-password"
    />
    <SensitiveInput
      name="confirmPassword"
      placeholder="Confirm password"
      autocomplete="new-password"
    />
    <Button class="w-full!" type="submit">Sign up</Button>
  </form>
</template>
