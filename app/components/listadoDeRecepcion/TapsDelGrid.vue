<template>
  <UTabs :items="tabs">
    <template #item="{ item }">
      <div class="p-2">
        <DxDataGrid :data-source="item.data" />
      </div>
    </template>
  </UTabs>
</template>

<script setup>
import { DxDataGrid } from 'devextreme-vue/data-grid';

defineProps({
  tabs: Array,
});
</script>