<template>
  <DxForm :form-data="formData">
    <DxSimpleItem
      data-field="Nombre"
      editor-type="dxTextBox"
      label="Nombre del Tipo de Motor"
      :editor-options="{
        placeholder: 'Ej: Gasolina, Diésel...',
        readOnly: isViewMode
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

const props = defineProps<{
  modelValue: any;
  isViewMode?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
