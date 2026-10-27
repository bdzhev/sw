<script setup lang="ts" generic="TData extends RowData">
import { FlexRender, type RowData, useTable } from '@tanstack/vue-table';
import { computed } from 'vue';

import { dataTableFeatures } from './DataTable.features';
import type { DataTableProps } from './DataTable.types';

const props = defineProps<DataTableProps<TData>>();

const data = computed(() => {
  return props.data;
});

const table = useTable({
  features: dataTableFeatures,
  columns: props.columns,
  data,
});

const headerGroups = computed(() => {
  return table.getHeaderGroups();
});

const rows = computed(() => {
  return table.getRowModel().rows;
});
</script>

<template>
  <table class="w-full text-left">
    <caption class="sr-only">
      {{
        props.caption
      }}
    </caption>

    <thead>
      <tr v-for="group in headerGroups" :key="group.id" class="border-b border-border">
        <th
          v-for="header in group.headers"
          :key="header.id"
          scope="col"
          :class="[
            'px-2 py-2 text-xs font-normal text-secondary uppercase',
            props.headerClasses?.[header.column.id],
          ]"
        >
          <FlexRender v-if="!header.isPlaceholder" :header="header" />
        </th>
      </tr>
    </thead>

    <slot :rows="rows" :table="table" />
  </table>
</template>
