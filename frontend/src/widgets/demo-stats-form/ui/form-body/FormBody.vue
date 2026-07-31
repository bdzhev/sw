<script setup lang="ts">
import { Input } from '@shared/ui/input';
import { Slider } from '@shared/ui/slider';
import { Text } from '@shared/ui/text';

import { demoStatInputDemoItems } from '../../config/stats/stats';
</script>

<template>
  <div class="flex flex-col gap-4 px-5 py-5 md:px-8 md:py-6">
    <div>
      <Text>Character's name</Text>

      <Input name="characterName" placeholder="Jimbo" class="mt-2" />
    </div>

    <div v-for="item in demoStatInputDemoItems" :key="item.id">
      <Text>{{ item.title }}</Text>

      <Slider :name="`stats.${item.id}`" :label="item.title" should-show-ticks />
    </div>
  </div>
</template>
