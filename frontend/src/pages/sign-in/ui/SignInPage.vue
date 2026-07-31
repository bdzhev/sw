<script setup lang="ts">
import { ImageFolder } from '@shared/lib/assets';
import { Card, CardHeader, HeaderTitle } from '@shared/ui/card';
import { Image } from '@shared/ui/image';

import { SignInForm } from './sign-in-form';
</script>

<template>
  <Card size="lg" class="w-full max-w-sm p-5 md:p-8">
    <CardHeader class="mb-6">
      <div class="flex flex-col">
        <div class="mb-8 flex flex-row items-center gap-3">
          <Image
            :folder="ImageFolder.Base"
            name="goblin-fairy"
            alt="Flying goblin fairy"
            class="h-8 w-8"
          />

          <span class="font-alegreya text-2xl font-bold text-primary md:text-3xl">
            Statwizard
          </span>
        </div>

        <HeaderTitle>Sign in</HeaderTitle>
      </div>
    </CardHeader>

    <SignInForm />
  </Card>
</template>
