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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                @click="tipoCliente = 'natural'"
                :class="['p-4 border rounded-lg flex items-center gap-4 transition-all duration-300', 'border-gray-400', tipoCliente === 'natural' ? 'bg-gray-300 shadow-md border-gray-500' : 'bg-gray-100 hover:bg-gray-200']"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h2 class="font-bold text-md text-gray-800 text-left">Cliente Natural</h2>
                  <p class="text-sm text-gray-600 text-left">Registrar como persona individual</p>
                </div>
              </button>

              <button
                @click="tipoCliente = 'juridico'"
                :class="['p-4 border rounded-lg flex items-center gap-4 transition-all duration-300', 'border-gray-400', tipoCliente === 'juridico' ? 'bg-gray-300 shadow-md border-gray-500' : 'bg-gray-100 hover:bg-gray-200']"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.788 1.84L4 7.23V14a1 1 0 001 1h10a1 1 0 001-1V7.23l.606.303a1 1 0 00.788-1.84l-7-3.5zM6 14V8h2v6H6zm4 0V8h2v6h-2z" />
                </svg>
                <div>
                  <h2 class="font-bold text-md text-gray-800 text-left">Cliente Jurídico</h2>
                  <p class="text-sm text-gray-600 text-left">Registrar como Empresa</p>
                </div>
              </button>
            </div>

            <FormularioNatural
              v-if="tipoCliente === 'natural'"
              :natural-data="naturalData"
              @update:natural-data="updateNaturalData"
              @submit="handleSubmit"
            />

            <FormularioJuridico
              v-if="tipoCliente === 'juridico'"
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
import { ref, reactive, computed, watch, toRefs } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import FormularioNatural from '@/components/customers/formClientNatural.vue';
import FormularioJuridico from '@/components/customers/formClientLegal.vue';

const props = defineProps({
  open: Boolean,
});
const { open } = toRefs(props);
const emit = defineEmits(['update:open', 'client-added']);

const title = computed(() => `Agregar Cliente ${tipoCliente.value === 'natural' ? 'Natural' : 'Jurídico'}`);
const tipoCliente = ref('natural');

const naturalData = reactive({
  nombre: '', apellido: '', tipoDocumento: '', numeroIdentificacion: '', rtn: '', telefono: '', correo: '', direccion: '', sexo: ''
});

const juridicoData = reactive({
  contacto: { nombre: '', apellido: '', cargo: '', telefono: '', correo: '', direccion: '' },
  empresa: { nombre: '', rubro: '', rtn: '', direccion: '' }
});

const handlePopupHiding = () => {
  emit('update:open', false);
};

// 💡 Nuevo: Métodos para actualizar los datos desde los hijos
const updateNaturalData = (newData) => {
  Object.assign(naturalData, newData);
};

const updateJuridicoData = (newData) => {
  Object.assign(juridicoData, newData);
};

const handleSubmit = () => {
  let dataToEmit;
  if (tipoCliente.value === 'natural') {
    dataToEmit = { ...naturalData };
  } else {
    dataToEmit = {
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

  emit('client-added', { tipo: tipoCliente.value, data: dataToEmit });
  handlePopupHiding();
};

watch(open, (newValue) => {
  if (newValue) {
    Object.assign(naturalData, { nombre: '', apellido: '', tipoDocumento: '', numeroIdentificacion: '', rtn: '', telefono: '', correo: '', direccion: '', sexo: '' });
    Object.assign(juridicoData, { contacto: { nombre: '', apellido: '', cargo: '', telefono: '', correo: '', direccion: '' }, empresa: { nombre: '', rubro: '', rtn: '', direccion: '' } });
  }
});
</script>

<style scoped>
.modal-content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
