<template>
  <DxForm :form-data="formData">
    <DxGroupItem caption="Datos de la Empresa">
      <DxSimpleItem data-field="empresaNombre" label="Nombre de la Empresa" :editor-options="{ readOnly: isViewMode }">
        <DxRequiredRule v-if="!isViewMode" message="El nombre es requerido" />
      </DxSimpleItem>
      <DxSimpleItem data-field="empresaRubro" label="Rubro" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="empresaRtn" label="RTN de la Empresa" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="empresaDireccion" label="Dirección de la Empresa" :editor-options="{ readOnly: isViewMode }" />
    </DxGroupItem>
    <DxGroupItem caption="Datos del Contacto" :col-count="2">
      <DxSimpleItem data-field="contactoNombre" label="Nombres" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="contactoApellido" label="Apellidos" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="contactoCargo" label="Cargo" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="contactoTelefono" label="Teléfono" :editor-options="{ readOnly: isViewMode }" />
      <DxSimpleItem data-field="contactoCorreo" label="Correo" :col-span="2" :editor-options="{ readOnly: isViewMode }">
        <DxEmailRule v-if="!isViewMode" message="Correo no válido" />
      </DxSimpleItem>
      <DxSimpleItem data-field="contactoDireccion" label="Dirección" :col-span="2" :editor-options="{ readOnly: isViewMode }" />
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
