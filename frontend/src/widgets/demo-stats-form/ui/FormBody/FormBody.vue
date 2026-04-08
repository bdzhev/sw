<script setup lang="ts">
import { Input } from '@shared/ui/input';
import { Slider } from '@shared/ui/slider';

import { demoStatInputDemoItems } from '../../config/stats/stats';
</script>

<template>
  <div class="px-8 py-6">
    <Text>Character's name</Text>
    <Input name="characterName" placeholder="Jimbo" class="mt-2" />

    <div v-for="item in demoStatInputDemoItems" :key="item.id">
      <Text>{{ item.title }}</Text>

      <Slider
        :name="`stats.${item.id}`"
        :title="item.title"
        should-show-ticks
      />
    </div>
  </div>
</template>
