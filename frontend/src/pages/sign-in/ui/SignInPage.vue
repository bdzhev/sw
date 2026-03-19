<script setup lang="ts">
import { signInWithGoogle } from '@shared/api/auth';
</script>

<template>
  <div>
    <button @click="signInWithGoogle">Sign in with Google</button>
  </div>
</template>
