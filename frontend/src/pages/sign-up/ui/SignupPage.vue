<script setup lang="ts">
import { Card, CardHeader, HeaderTitle } from '@shared/ui/card';

import { SignUpForm } from './sign-up-form';
</script>

<template>
  <Card size="lg" class="w-full max-w-sm p-8">
    <CardHeader class="mb-6">
      <HeaderTitle>Sign up</HeaderTitle>
    </CardHeader>

    <SignUpForm />
  </Card>
</template>
