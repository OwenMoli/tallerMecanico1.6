<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <button
        @click="tipoCliente = 'natural'"
        :class="['p-4 border rounded-lg flex items-center gap-4 transition-all duration-300', 'border-gray-400', tipoCliente === 'natural' ? 'bg-gray-300 shadow-md border-gray-500' : 'bg-gray-100 hover:bg-gray-200']"
      >
        <UIcon name="i-heroicons-user-circle" class="h-8 w-8 text-gray-600" />
        <div>
          <h2 class="font-bold text-md text-gray-800 text-left">Cliente Natural</h2>
          <p class="text-sm text-gray-600 text-left">Registrar como persona individual</p>
        </div>
      </button>

      <button
        @click="tipoCliente = 'juridico'"
        :class="['p-4 border rounded-lg flex items-center gap-4 transition-all duration-300', 'border-gray-400', tipoCliente === 'juridico' ? 'bg-gray-300 shadow-md border-gray-500' : 'bg-gray-100 hover:bg-gray-200']"
      >
        <UIcon name="i-heroicons-building-office" class="h-8 w-8 text-gray-600" />
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
    />

    <FormularioJuridico
      v-if="tipoCliente === 'juridico'"
      :juridico-data="juridicoData"
      @update:juridico-data="updateJuridicoData"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, toRefs } from 'vue';
import FormularioNatural from '@/components/customers/formClientNatural.vue';
import FormularioJuridico from '@/components/customers/formClientLegal.vue';

const emit = defineEmits(['update:clientData']);
const tipoCliente = ref('natural');

// Asumo que tienes los mismos datos reactivos del modal
const naturalData = reactive({ /* ... datos ... */ });
const juridicoData = reactive({ /* ... datos ... */ });

// Watcher para emitir los datos del cliente cada vez que cambian
watch([naturalData, juridicoData, tipoCliente], () => {
  let dataToEmit;
  if (tipoCliente.value === 'natural') {
    dataToEmit = { ...naturalData };
  } else {
    dataToEmit = {
      empresaNombre: juridicoData.empresa.nombre,
      contactoNombre: juridicoData.contacto.nombre,
      // ... otros datos del cliente jurídico
    };
  }
  emit('update:clientData', dataToEmit);
}, { deep: true });

// Métodos para actualizar los datos desde los hijos
const updateNaturalData = (newData) => {
  Object.assign(naturalData, newData);
};

const updateJuridicoData = (newData) => {
  Object.assign(juridicoData, newData);
};
</script>
