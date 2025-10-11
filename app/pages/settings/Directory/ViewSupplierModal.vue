<template>
  <DxPopup
    :title="title"
    :visible="open"
    :show-close-button="true"
    :width="700"
    :height="500"
    @hiding="handlePopupHiding"
  >
    <template #content>
      <DxForm
        v-if="proveedorData"
        :col-count="3"
        :form-data="proveedorData"
        :read-only="true"
        label-location="top"
      >
        <DxItem data-field="NombreProveedor" :col-span="3" />
        <DxItem data-field="TipoProveedor" :col-span="3" />
        <DxItem data-field="NombreContacto" :col-span="3" />
        <DxItem data-field="Teléfono" :col-span="1" />
        <DxItem data-field="CorreoElectrónico" :col-span="2" />
        <DxItem data-field="Dirección" :col-span="3" />
        <DxItem data-field="Ciudad" :col-span="1" />
        <DxItem data-field="País" :col-span="1" />
        <DxItem data-field="RTN" :col-span="1" />
      </DxForm>

      <div class="dx-form-buttons">
        <DxButton text="Cerrar" type="normal" @click="cancel" />
      </div>
    </template>
  </DxPopup>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import { DxForm, DxItem } from 'devextreme-vue/form';
import DxButton from 'devextreme-vue/button';

const props = defineProps({
  open: Boolean,
  proveedorData: Object, // Propiedad que recibirá los datos del proveedor
});
const { open, proveedorData } = toRefs(props);
const emit = defineEmits(['update:open']);

const title = 'Detalles del Proveedor';

const cancel = () => {
  emit('update:open', false);
};

const handlePopupHiding = () => {
  emit('update:open', false);
};
</script>

<style scoped>
.dx-form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
