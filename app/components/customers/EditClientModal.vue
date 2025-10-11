<template>
  <DxPopup
    :title="title"
    :visible="open"
    :show-close-button="true"
    :width="800"
    :height="800"
    @hiding="handlePopupHiding"
  >
    <template #content>
      <div class="modal-content-wrapper flex flex-col items-center justify-center h-full">
        <div
          class="w-full max-w-xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          style="max-height: 80vh;"
        >
          <div class="overflow-y-auto h-full pr-4">
            <h2 class="text-xl font-bold mb-4 text-center">Formulario de Edición</h2>

            <FormularioNatural
              v-if="clientType === 'natural'"
              :natural-data="naturalData"
              @update:natural-data="updateNaturalData"
              @submit="handleSubmit"
            />

            <FormularioJuridico
              v-if="clientType === 'juridico'"
              :juridico-data="juridicoData"
              @update:juridico-data="updateJuridicoData"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
    </template>
  </DxPopup>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import FormularioNatural from '@/components/customers/formClientNatural.vue';
import FormularioJuridico from '@/components/customers/formClientLegal.vue';

const props = defineProps({
  open: Boolean,
  clientData: Object,
  clientType: String,
});
const emit = defineEmits(['update:open', 'client-updated']);

const title = computed(() => `Editar Cliente ${props.clientType === 'natural' ? 'Natural' : 'Jurídico'}`);

const naturalData = reactive({
  id: '', nombre: '', apellido: '', tipoDocumento: '', numeroIdentificacion: '', rtn: '', telefono: '', correo: '', direccion: '', sexo: ''
});

const juridicoData = reactive({
  id: '',
  contacto: { nombre: '', apellido: '', cargo: '', telefono: '', correo: '', direccion: '' },
  empresa: { nombre: '', rubro: '', rtn: '', direccion: '' }
});

const handlePopupHiding = () => {
  emit('update:open', false);
};

const updateNaturalData = (newData) => {
  Object.assign(naturalData, newData);
};

const updateJuridicoData = (newData) => {
  Object.assign(juridicoData, newData);
};

const handleSubmit = () => {
  let dataToEmit;
  if (props.clientType === 'natural') {
    dataToEmit = { ...naturalData, id: props.clientData.id };
  } else {
    dataToEmit = {
      id: props.clientData.id,
      empresaNombre: juridicoData.empresa.nombre,
      empresaRubro: juridicoData.empresa.rubro,
      empresaRtn: juridicoData.empresa.rtn,
      empresaDireccion: juridicoData.empresa.direccion,
      contactoNombre: juridicoData.contacto.nombre,
      contactoApellido: juridicoData.contacto.apellido,
      contactoCargo: juridicoData.contacto.cargo,
      contactoTelefono: juridicoData.contacto.telefono,
      contactoCorreo: juridicoData.contacto.correo,
      contactoDireccion: juridicoData.contacto.direccion,
    };
  }
  emit('client-updated', dataToEmit);
  handlePopupHiding();
};

watch(() => props.clientData, (newVal) => {
  if (newVal) {
    if (props.clientType === 'natural') {
      Object.assign(naturalData, newVal);
    } else {
      Object.assign(juridicoData, {
        id: newVal.id,
        contacto: {
          nombre: newVal.contactoNombre,
          apellido: newVal.contactoApellido,
          cargo: newVal.contactoCargo,
          telefono: newVal.contactoTelefono,
          correo: newVal.contactoCorreo,
          direccion: newVal.contactoDireccion,
        },
        empresa: {
          nombre: newVal.empresaNombre,
          rubro: newVal.empresaRubro,
          rtn: newVal.empresaRtn,
          direccion: newVal.empresaDireccion,
        }
      });
    }
  }
}, { immediate: true });
</script>

<style scoped>
.modal-content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
