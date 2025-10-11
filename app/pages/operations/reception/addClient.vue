<script setup>
import { ref, reactive, computed } from 'vue';
import FormularioNatural from '@/components/customers/formClientNatural.vue';
import FormularioJuridico from '@/components/customers/formClientLegal.vue';

// --- ESTADO ---
const tipoCliente = ref('natural');

const naturalData = reactive({
  nombre: '',
  apellido: '',
  tipoDocumento: '',
  numeroIdentificacion: '',
  rtn: '',
  telefono: '',
  correo: '',
  direccion: '',
  sexo: ''
});

const juridicoData = reactive({
  contacto: {
    nombre: '',
    apellido: '',
    cargo: '',
    telefono: '',
    correo: '',
    direccion: ''
  },
  empresa: {
    nombre: '',
    rubro: '',
    rtn: '',
    direccion: ''
  }
});

// --- MÉTODOS ---
const registrarCliente = () => {
  if (tipoCliente.value === 'natural') {
    console.log('Registrando Cliente Natural:', naturalData);
  } else {
    console.log('Registrando Cliente Jurídico:', juridicoData);
  }
};
</script>

<template>
  <UDashboardPanel class="relative overflow-visible" :ui="{ body: 'lg:py-12' }">
    <UDashboardNavbar title="Agregar Cliente">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>
    
    <div
      class="flex items-center justify-center p-4"
      style="height: 90vh;"
    >
      <div
        class="w-full max-w-lg bg-dark dark:bg-gray-800 p-8 rounded-xl shadow-lg overflow-y-auto"
        style="max-height: 100%;"
      >
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Agregar un Cliente
          </h1>
          <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            @click="tipoCliente = 'natural'"
            :class="[
              'p-4 border rounded-lg flex items-center gap-4 transition-all duration-300',
              'border-gray-400',
              tipoCliente === 'natural'
                ? 'bg-gray-300 shadow-md border-gray-500'
                : 'bg-gray-100 hover:bg-gray-200'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd" />
            </svg>
            <div>
              <h2 class="font-bold text-md text-gray-800 text-left">Cliente Natural</h2>
              <p class="text-sm text-gray-600 text-left">Registrar como persona individual</p>
            </div>
          </button>

          <button
            @click="tipoCliente = 'juridico'"
            :class="[
              'p-4 border rounded-lg flex items-center gap-4 transition-all duration-300',
              'border-gray-400',
              tipoCliente === 'juridico'
                ? 'bg-gray-300 shadow-md border-gray-500'
                : 'bg-gray-100 hover:bg-gray-200'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.788 1.84L4 7.23V14a1 1 0 001 1h10a1 1 0 001-1V7.23l.606.303a1 1 0 00.788-1.84l-7-3.5zM6 14V8h2v6H6zm4 0V8h2v6h-2z" />
            </svg>
            <div>
              <h2 class="font-bold text-md text-gray-800 text-left">Cliente Jurídico</h2>
              <p class="text-sm text-gray-600 text-left">Registrar como Empresa</p>
            </div>
          </button>
        </div>

        <FormularioNatural
          v-if="tipoCliente === 'natural'"
          v-model:natural-data="naturalData"
          @submit="registrarCliente"
        />

        <FormularioJuridico
          v-if="tipoCliente === 'juridico'"
          v-model:juridico-data="juridicoData"
          @submit="registrarCliente"
        />
        
      </div>
    </div>
  </UDashboardPanel>
</template>