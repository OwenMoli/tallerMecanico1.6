<template>
  <div v-if="visible"
       class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">

    <div class="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
      <h3 class="mb-2 text-xl font-bold">{{ title }}</h3>
      <p class="mb-6 text-gray-600">{{ message }}</p>

      <div class="flex justify-end space-x-3">
        <DxButton text="Cancelar" type="default" @click="handleCancel" />
        <DxButton text="Confirmar" type="danger" @click="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DxButton } from 'devextreme-vue/button';

defineProps<{
  visible: boolean;
  title?: string;
  message?: string;
}>();

const emit = defineEmits(['update:visible', 'confirmed']);

const handleConfirm = () => {
  emit('confirmed');
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>
