<template>
  <DxPopup
    :title="title"
    :visible.sync="open"
    :show-close-button="true"
    :width="700"
    :height="500"
    @hiding="handlePopupHiding"
  >
    <template #content>
      <form @submit.prevent="handleSubmit">
        <DxForm
          v-if="open"
          :col-count="3"
          :form-data="formData"
          ref="formRef"
          label-location="top"
        >
          <DxItem data-field="NombreProveedor" :col-span="3">
            <DxRequiredRule message="El nombre del proveedor es obligatorio." />
          </DxItem>

          <DxItem
            data-field="TipoProveedor"
            editor-type="dxSelectBox"
            :editor-options="{ items: tipoProveedores }"
            :col-span="3"
          >
            <DxRequiredRule message="Debe seleccionar un tipo de proveedor." />
          </DxItem>

          <DxItem data-field="NombreContacto" :col-span="3">
            <DxRequiredRule message="El nombre de contacto es obligatorio." />
          </DxItem>

          <DxItem
            data-field="Teléfono"
            :col-span="1"
            :editor-options="{
              onKeyDown: handlePhoneKeyDown,
              mode: 'tel',
            }"
          >
            <DxRequiredRule message="El teléfono es obligatorio." />
            <DxPatternRule
              :pattern="/^\d{8,15}$/"
              message="El formato del teléfono es incorrecto (solo números)."
            />
          </DxItem>

          <DxItem data-field="CorreoElectrónico" :col-span="2">
            <DxRequiredRule message="El correo es obligatorio." />
            <DxEmailRule message="El correo electrónico no es válido." />
          </DxItem>

          <DxItem data-field="Dirección" :col-span="3">
            <DxStringLengthRule
              :max="100"
              message="La dirección no puede tener más de 100 caracteres."
            />
          </DxItem>

          <DxItem data-field="Ciudad" :col-span="1">
            <DxRequiredRule message="La ciudad es obligatoria." />
          </DxItem>
          <DxItem data-field="País" :col-span="1">
            <DxRequiredRule message="El país es obligatorio." />
          </DxItem>

          <DxItem
            data-field="RTN"
            :col-span="1"
            :editor-options="{
              onKeyDown: handlePhoneKeyDown,
            }"
          >
            <DxPatternRule
              :pattern="/^\d{14}$/"
              message="El RTN debe tener 14 dígitos."
            />
          </DxItem>
        </DxForm>

        <div class="dx-form-buttons">
          <DxButton text="Cancelar" type="normal" @click="cancel" />
          <DxButton text="Crear" type="success" :use-submit-behavior="true" />
        </div>
      </form>
    </template>
  </DxPopup>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import { DxForm, DxItem } from 'devextreme-vue/form';
import DxButton from 'devextreme-vue/button';
import {
  DxRequiredRule,
  DxPatternRule,
  DxEmailRule,
  DxStringLengthRule,
} from 'devextreme-vue/data-grid';

const toast = useToast();

const props = defineProps({
  open: Boolean,
});
// 👈 Se emite el evento con el nuevo proveedor
const emit = defineEmits(['update:open', 'proveedor-added']);

const title = 'Nuevo Proveedor';

const initialFormData = {
  NombreProveedor: '',
  NombreContacto: '',
  Teléfono: '',
  CorreoElectrónico: '',
  Dirección: '',
  Ciudad: '',
  País: '',
  RTN: '',
  TipoProveedor: '',
};

const formData = reactive({ ...initialFormData });

const tipoProveedores = ['Repuestos', 'Lubricantes', 'Herramientas', 'Servicios externos'];

const formRef = ref(null);

const handlePhoneKeyDown = (e) => {
  const isControlKey = [8, 9, 27, 13, 46].includes(e.event.keyCode) ||
                       (e.event.keyCode >= 37 && e.event.keyCode <= 40);

  const isModifierKey = e.event.ctrlKey || e.event.metaKey;

  if (!/\d/.test(e.event.key) && !isControlKey && !isModifierKey) {
    e.event.preventDefault();
  }
};

const handleSubmit = () => {
  const result = formRef.value.instance.validate();

  if (result.isValid) {
    // 👈 Se emite el evento y se pasan los datos del formulario
    emit('proveedor-added', { ...formData });
    toast.add({
      title: 'Proveedor agregado',
      description: `El proveedor ${formData.NombreProveedor} ha sido creado.`,
      color: 'success',
    });
    emit('update:open', false);
  } else {
    toast.add({
      title: 'Error de validación',
      description: 'Por favor, corrige los campos del formulario.',
      color: 'danger',
    });
  }
};

const cancel = () => {
  emit('update:open', false);
};

const handlePopupHiding = () => {
  Object.assign(formData, initialFormData);
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
