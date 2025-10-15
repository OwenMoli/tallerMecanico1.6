<template>
  <DxForm :form-data="formData">
    <DxSimpleItem
      data-field="Nombre"
      editor-type="dxTextBox"
      label="Nombre de la Marca"
      :editor-options="{
        placeholder: 'Ej: Toyota, Honda...',
        readOnly: isViewMode  // 1. El campo se vuelve de solo lectura si isViewMode es true
      }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El nombre es requerido" />
    </DxSimpleItem>
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem, DxRequiredRule } from 'devextreme-vue/form';
import { DxTextBox } from 'devextreme-vue/text-box';
import { computed } from 'vue';

// 3. Aceptamos la nueva prop 'isViewMode' que viene desde FormModal
const props = defineProps<{
  modelValue: any;
  isViewMode?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

// La sincronización de datos con v-model no cambia
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
