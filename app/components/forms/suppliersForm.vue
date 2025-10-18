<template>
  <DxForm :form-data="formData">
    <DxSimpleItem
      data-field="NombreProveedor"
      label="Nombre del Proveedor"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El nombre es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="NombreContacto"
      label="Nombre de Contacto"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El nombre de contacto es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="TipoProveedor"
      editor-type="dxSelectBox"
      label="Tipo de Proveedor"
      :editor-options="{
        items: ['Repuestos', 'Lubricantes', 'Herramientas', 'Servicios externos', 'Otros'],
        readOnly: isViewMode
      }"
    >
        <DxRequiredRule v-if="!isViewMode" message="El tipo es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="Telefono"
      label="Teléfono"
      :editor-options="{ readOnly: isViewMode, mask: '+504 0000-0000' }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El teléfono es requerido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="CorreoElectronico"
      label="Correo Electrónico"
      :editor-options="{ readOnly: isViewMode }"
    >
      <DxRequiredRule v-if="!isViewMode" message="El correo es requerido" />
      <DxEmailRule v-if="!isViewMode" message="El formato del correo no es válido" />
    </DxSimpleItem>

    <DxSimpleItem
      data-field="RTN"
      label="RTN"
      :editor-options="{ readOnly: isViewMode, mask: '00000000000000' }"
    />

    <DxSimpleItem
      data-field="Direccion"
      label="Dirección"
      :editor-options="{ readOnly: isViewMode }"
    />
     <DxSimpleItem
      data-field="Ciudad"
      label="Ciudad"
      :editor-options="{ readOnly: isViewMode }"
    />
     <DxSimpleItem
      data-field="Pais"
      label="País"
      :editor-options="{ readOnly: isViewMode, value: 'Honduras' }"
    />

  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem, DxRequiredRule, DxEmailRule } from 'devextreme-vue/form';
import { DxTextBox } from 'devextreme-vue/text-box';
import { DxSelectBox } from 'devextreme-vue/select-box';
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
