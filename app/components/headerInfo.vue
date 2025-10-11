<template>
  <div class="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
    <div class="flex items-center gap-4">
      <UIcon name="i-heroicons-user-circle" class="text-green-500 w-12 h-12" />
      <div>
        <span class="text-sm text-gray-400">Cliente</span>
        <div class="text-lg font-semibold">{{ clientName }}</div>
        <div class="text-sm text-gray-400">{{ clientPhone }}</div>
      </div>
    </div>
    <div class="flex items-center gap-4 text-right">
      <div>
        <span class="text-sm text-gray-400">Vehículo</span>
        <div class="text-lg font-semibold">{{ carName }}</div>
        <div class="text-sm text-gray-400">{{ carDetails }}</div>
      </div>
      <UIcon name="i-heroicons-car" class="text-green-500 w-12 h-12" />
    </div>
  </div>
</template>

// components/headerInfo.vue

<script setup>
import { defineProps } from 'vue';

defineProps({
  clientName: {
    type: String,
    // Add a default value of null to handle cases where the value might not be a string.
    default: null,
  },
  clientPhone: {
    type: String,
    // Add a default value of null.
    default: null,
  },
  carName: {
    type: String,
    required: true,
  },
  carDetails: {
    type: String,
    required: true,
  },
});
</script>
