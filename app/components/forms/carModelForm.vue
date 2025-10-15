<template>
  <DxForm :form-data="formData">
    <DxSimpleItem
      data-field="MarcaID"
      editor-type="dxSelectBox"
      :editor-options="{
        dataSource: marcas,
        displayExpr: 'Nombre',
        valueExpr: 'ID',
        readOnly: isViewMode
      }"
      label="Marca"
    >
      <DxRequiredRule v-if="!isViewMode" message="La marca es requerida" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="EstiloID"
      editor-type="dxSelectBox"
      :editor-options="{
        dataSource: estilos,
        displayExpr: 'Nombre',
        valueExpr: 'ID',
        readOnly: isViewMode
      }"
      label="Estilo"
    >
      <DxRequiredRule v-if="!isViewMode" message="El estilo es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="Nombre"
      editor-type="dxTextBox"
      label="Nombre del Modelo"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El nombre es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="Año"
      editor-type="dxNumberBox"
      label="Año"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El año es requerido" />
    </DxSimpleItem>
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem, DxRequiredRule } from 'devextreme-vue/form';
import { DxTextBox } from 'devextreme-vue/text-box';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxNumberBox } from 'devextreme-vue/number-box';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: any;
  marcas: any[];
  estilos: any[];
  isViewMode?: boolean; 
}>();

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
