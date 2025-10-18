<template>
  <DxForm :form-data="formData">
    <DxGroupItem :col-count="2">
      <DxSimpleItem
        data-field="Nombres"
        label="Nombres"
        :editor-options="{ readOnly: isViewMode }"
      >
        <DxRequiredRule v-if="!isViewMode" message="El nombre es requerido" />
      </DxSimpleItem>

      <DxSimpleItem
        data-field="Apellidos"
        label="Apellidos"
        :editor-options="{ readOnly: isViewMode }"
      >
        <DxRequiredRule v-if="!isViewMode" message="El apellido es requerido" />
      </DxSimpleItem>

      <DxSimpleItem
        data-field="NumeroIdentidad"
        label="Número de Identidad"
        :editor-options="{ readOnly: isViewMode, mask: '0000-0000-00000' }"
      >
          <DxRequiredRule v-if="!isViewMode" message="La identidad es requerida" />
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
        :col-span="2"
        :editor-options="{ readOnly: isViewMode }"
      >
        <DxRequiredRule v-if="!isViewMode" message="El correo es requerido" />
        <DxEmailRule v-if="!isViewMode" message="El formato del correo no es válido" />
      </DxSimpleItem>

       <DxSimpleItem
        data-field="Especialidad"
        editor-type="dxSelectBox"
        label="Especialidad"
        :editor-options="{
          items: ['Frenos', 'Motor', 'Transmisión', 'Eléctrico', 'General'],
          readOnly: isViewMode
        }"
      >
        <DxRequiredRule v-if="!isViewMode" message="La especialidad es requerida" />
      </DxSimpleItem>

      <DxSimpleItem
        data-field="FechaContratacion"
        editor-type="dxDateBox"
        label="Fecha de Contratación"
        :editor-options="{ readOnly: isViewMode, displayFormat: 'dd/MM/yyyy' }"
      >
        <DxRequiredRule v-if="!isViewMode" message="La fecha es requerida" />
      </DxSimpleItem>

    </DxGroupItem>
  </DxForm>
</template>

<script setup lang="ts">
import DxForm, { DxSimpleItem, DxGroupItem, DxRequiredRule, DxEmailRule } from 'devextreme-vue/form';
import { DxTextBox } from 'devextreme-vue/text-box';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxDateBox } from 'devextreme-vue/date-box';
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
