<script lang="ts" setup>
import { onUnmounted } from 'vue';

import { Text } from '@shared/ui/text';

import { useDemoStatsStore } from '../../../model/useDemoStatsStore';

import { DemoFormCard, DemoResultCard } from './components';

const demoStore = useDemoStatsStore();

onUnmounted(() => {
  demoStore.$dispose();
});
</script>

<!-- prettier-ignore -->
<template>
  <section
    class="
      grid h-screen max-w-full grid-flow-row auto-rows-min grid-cols-6 gap-4
      px-20 pt-30
    "
  >
    <div
      class="col-span-6 row-span-1 font-alegreya text-7xl font-extrabold italic"
    >
      <span class="text-primary">Here comes </span>

      <span class="text-secondary">Statwizard</span>

      <span class="text-primary">!</span>
    </div>

    <div class="col-span-6 row-span-1 w-[80%] text-lg text-primary">
      <Text>
        The principle is quite simple: you answer a bunch of questions that
        represent the various game scenarious your future character would
        experience and voila – your stats are ready!
      </Text>

      <Text>Below is a somewhat of a demonstration</Text>
    </div>

    <DemoFormCard class="col-span-3 row-span-2"/>

    <DemoResultCard class="col-span-3 row-span-2"/>
  </section>
</template>
