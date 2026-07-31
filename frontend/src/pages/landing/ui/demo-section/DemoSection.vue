<script lang="ts" setup>
import { onUnmounted } from 'vue';

import { Text } from '@shared/ui/text';

import { useDemoStatsStore } from '../../model/useDemoStatsStore';
import { DemoFormCard } from './demo-form-card';
import { DemoResultCard } from './demo-result-card';

const demoStore = useDemoStatsStore();

onUnmounted(() => {
  demoStore.$dispose();
});
</script>

<template>
  <section
    class="grid max-w-full grid-flow-row auto-rows-min grid-cols-1 gap-4 page-x pt-24 md:min-h-[100svh] md:grid-cols-6 md:pt-30"
  >
    <div
      class="row-span-1 font-alegreya text-3xl font-extrabold italic sm:text-4xl md:col-span-6 md:text-6xl lg:text-7xl"
    >
      <span class="text-primary">Here comes </span>

      <span class="text-secondary">Statwizard</span>

      <span class="text-primary">!</span>
    </div>

    <div
      class="row-span-1 w-full text-base text-primary md:col-span-6 md:w-[80%] md:text-lg"
    >
      <Text>
        The principle is quite simple: you answer a bunch of questions that represent the
        various game scenarious your future character would experience and voila – your
        stats are ready!
      </Text>

      <Text>Below is a somewhat of a demonstration</Text>
    </div>

    <DemoFormCard class="col-span-1 row-span-2 md:col-span-3" />

    <DemoResultCard class="col-span-1 row-span-2 md:col-span-3" />
  </section>
</template>
