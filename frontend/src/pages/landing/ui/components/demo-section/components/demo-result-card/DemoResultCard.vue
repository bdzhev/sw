<script setup lang="ts">
import { Card } from '@shared/ui/card';

import { useDemoStatsStore } from '../../../../../model/useDemoStatsStore';

const store = useDemoStatsStore();
</script>

<template>
  <Card>
    <p>{{ store.state.characterName }}</p>
  </Card>
</template>
