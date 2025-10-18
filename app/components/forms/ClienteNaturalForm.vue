<template>
  <DxForm :form-data="formData">
    <DxGroupItem :col-count="2">
      <DxSimpleItem data-field="nombre" label="Nombres" :editor-options="{ readOnly: isViewMode }">
        <DxRequiredRule v-if="!isViewMode" message="El nombre es requerido" />
      </DxSimpleItem>
      <DxSimpleItem data-field="apellido" label="Apellidos" :editor-options="{ readOnly: isViewMode }">
        <DxRequiredRule v-if="!isViewMode" message="El apellido es requerido" />
      </DxSimpleItem>
      <DxSimpleItem data-field="tipoDocumento" editor-type="dxSelectBox" :editor-options="{ items: ['Cédula', 'Pasaporte'], readOnly: isViewMode }" label="Tipo de Documento" />
      <DxSimpleItem data-field="numeroIdentificacion" label="No. Identificación" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="rtn" label="RTN" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="telefono" label="Teléfono" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="correo" label="Correo Electrónico" :col-span="2" :editor-options="{ readOnly: isViewMode }">
        <DxEmailRule v-if="!isViewMode" message="Correo no válido" />
      </DxSimpleItem>
      <DxSimpleItem data-field="direccion" label="Dirección" :col-span="2" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="sexo" editor-type="dxSelectBox" :editor-options="{ items: ['M', 'F'], readOnly: isViewMode }" label="Sexo" />
    </DxGroupItem>
  </DxForm>
</template>
<script setup lang="ts">
import DxForm, { DxSimpleItem, DxGroupItem, DxRequiredRule, DxEmailRule } from 'devextreme-vue/form';
import { computed } from 'vue';
const props = defineProps<{ modelValue: any; isViewMode?: boolean; }>();
const emit = defineEmits(['update:modelValue']);
const formData = computed({ get: () => props.modelValue, set: (value) => emit('update:modelValue', value) });
</script>
