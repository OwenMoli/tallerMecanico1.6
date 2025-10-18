<template>
  <DxForm :form-data="formData" label-location="top">
    <DxSimpleItem
      data-field="marca"
      editor-type="dxTextBox"
      label="Marca del Vehículo"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="La marca es requerida" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="modelo"
      editor-type="dxTextBox"
      label="Modelo del Vehículo"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El modelo es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="anio"
      editor-type="dxNumberBox"
      label="Año"
      :editor-options="{ readOnly: isViewMode, showSpinButtons: false }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El año es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="descripcion"
      editor-type="dxTextBox"
      label="Notas de Compatibilidad (Descripción)"
      :editor-options="{ readOnly: isViewMode, placeholder: 'Ej: Motor 2.0L, AWD...' }"
    />
  </DxForm>
</template>

<script setup>
import DxForm, { DxSimpleItem, DxRequiredRule } from 'devextreme-vue/form';
import { DxTextBox } from 'devextreme-vue/text-box';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  isViewMode: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
