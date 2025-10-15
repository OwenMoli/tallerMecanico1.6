<template>
  <DxForm :form-data="formData">
    <DxSimpleItem
      data-field="Nombre"
      editor-type="dxTextBox"
      label="Nombre del Estilo"
      :editor-options="{ placeholder: 'Ej: Sedán, SUV, Pickup...' }"
    >
      <DxRequiredRule message="El nombre es requerido" />
    </DxSimpleItem>
  </DxForm>
</template>

<script setup lang="ts">
// El script es idéntico al de MarcaForm.vue, ¡pura reutilización!
import DxForm, { DxSimpleItem, DxRequiredRule } from 'devextreme-vue/form';
import { DxTextBox } from 'devextreme-vue/text-box';
import { computed } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
