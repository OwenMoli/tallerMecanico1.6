<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  juridicoData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:juridicoData', 'submit']);

const handleInput = (category, field, value) => {
  const newData = {
    ...props.juridicoData,
    [category]: {
      ...props.juridicoData[category],
      [field]: value
    }
  };
  emit('update:juridicoData', newData);
};

const handleSubmit = () => {
  emit('submit');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Datos de la Empresa</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="empresa-nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la
          Empresa *</label>
        <input id="empresa-nombre" type="text" placeholder="Razón Social de la empresa"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.empresa.nombre" @input="handleInput('empresa', 'nombre', $event.target.value)" />
      </div>
      <div>
        <label for="empresa-rubro" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rubro de la
          Empresa *</label>
        <input id="empresa-rubro" type="text" placeholder="Ej: Transporte, Construcción, etc."
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.empresa.rubro" @input="handleInput('empresa', 'rubro', $event.target.value)" />
      </div>
      <div>
        <label for="empresa-rtn" class="block text-sm font-medium text-gray-700 dark:text-gray-300">RTN de la
          Empresa *</label>
        <input id="empresa-rtn" type="text" placeholder="RTN de la empresa"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.empresa.rtn" @input="handleInput('empresa', 'rtn', $event.target.value)" />
      </div>
      <div class="md:col-span-2">
        <label for="empresa-direccion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección
          de la Empresa *</label>
        <input id="empresa-direccion" type="text" placeholder="Dirección fiscal o principal de la empresa"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.empresa.direccion" @input="handleInput('empresa', 'direccion', $event.target.value)" />
      </div>
    </div>

    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 my-4 pt-4">Datos del Contacto</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="juridico-nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre
          del Contacto *</label>
        <input id="juridico-nombre" type="text" placeholder="Nombre de la persona de contacto"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.contacto.nombre" @input="handleInput('contacto', 'nombre', $event.target.value)" />
      </div>
      <div>
        <label for="juridico-apellido" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido
          del Contacto *</label>
        <input id="juridico-apellido" type="text" placeholder="Apellido de la persona de contacto"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.contacto.apellido" @input="handleInput('contacto', 'apellido', $event.target.value)" />
      </div>
      <div>
        <label for="juridico-cargo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo en la
          Empresa *</label>
        <input id="juridico-cargo" type="text" placeholder="Ej: Gerente de Flota"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.contacto.cargo" @input="handleInput('contacto', 'cargo', $event.target.value)" />
      </div>
      <div>
        <label for="juridico-telefono" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de
          Teléfono *</label>
        <input id="juridico-telefono" type="tel" placeholder="+504 ____-____"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.contacto.telefono" @input="handleInput('contacto', 'telefono', $event.target.value)" />
      </div>
      <div class="md:col-span-2">
        <label for="juridico-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo del
          Contacto *</label>
        <input id="juridico-email" type="email" placeholder="contacto@empresa.com"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.contacto.correo" @input="handleInput('contacto', 'correo', $event.target.value)" />
      </div>
      <div class="md:col-span-2">
        <label for="juridico-direccion-contacto"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección del Contacto
          (Opcional)</label>
        <input id="juridico-direccion-contacto" type="text" placeholder="Dirección personal si es necesaria"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="juridicoData.contacto.direccion" @input="handleInput('contacto', 'direccion', $event.target.value)" />
      </div>
    </div>
    <button type="submit"
      class="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors mt-6">
      Registrar Cliente Jurídico
    </button>
  </form>
</template>