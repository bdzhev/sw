<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

import { signIn } from '@shared/api/auth';
import { ImageFolder } from '@shared/lib/assets';
import { Button } from '@shared/ui/button';
import { Card, CardHeader, HeaderTitle } from '@shared/ui/card';
import { Image } from '@shared/ui/image';
import { Input } from '@shared/ui/input';
import { SensitiveInput } from '@shared/ui/sensitive-input';

import { useUser } from '@entities/user';

const router = useRouter();
const { setUser } = useUser();

const form = useForm<{ username: string; password: string }>();

const handleSubmit = form.handleSubmit(async (values) => {
  const user = await signIn(values.username, values.password);
  setUser(user);
  router.replace('/app');
});
</script>

<template>
  <Card size="lg" class="w-full max-w-sm p-8">
    <CardHeader class="mb-6">
      <div class="flex flex-col">
        <div class="mb-8 flex flex-row items-center gap-3">
          <Image
            :folder="ImageFolder.Base"
            name="goblin-fairy"
            alt="Flying goblin fairy"
            class="h-8 w-8"
          />

          <span class="font-alegreya text-3xl font-bold text-primary">
            Statwizard
          </span>
        </div>

        <HeaderTitle>Sign in</HeaderTitle>
      </div>
    </CardHeader>

    <form @submit.prevent="handleSubmit">
      <Input name="username" placeholder="Username" autocomplete="username" />

      <SensitiveInput
        name="password"
        placeholder="Password"
        autocomplete="current-password"
      />
      <Button class="w-full!" type="submit">Sign in</Button>
    </form>
  </Card>
</template>
