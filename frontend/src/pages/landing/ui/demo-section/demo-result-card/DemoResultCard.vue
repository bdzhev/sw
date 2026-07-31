<script setup lang="ts">
import { Card } from '@shared/ui/card';
import { Text } from '@shared/ui/text';

import { useDemoStatsStore } from '../../../model/useDemoStatsStore';

const store = useDemoStatsStore();
</script>

<template>
  <Card>
    <Text>{{ store.state.characterName }}</Text>
  </Card>
</template>
