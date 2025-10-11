<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  naturalData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:naturalData', 'submit']);

const handleInput = (field, value) => {
  emit('update:naturalData', {
    ...props.naturalData,
    [field]: value
  });
};

const handleSubmit = () => {
  emit('submit');
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="natural-nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
        <input id="natural-nombre" type="text" placeholder="Ingrese el nombre"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.nombre" @input="handleInput('nombre', $event.target.value)" />
      </div>
      <div>
        <label for="natural-apellido" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido *</label>
        <input id="natural-apellido" type="text" placeholder="Ingrese el apellido"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.apellido" @input="handleInput('apellido', $event.target.value)" />
      </div>

      <div>
        <label for="natural-tipo-documento" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Documento *</label>
        <select id="natural-tipo-documento"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.tipoDocumento" @input="handleInput('tipoDocumento', $event.target.value)">
          <option disabled value="">Seleccione una opción</option>
          <option>Carnet</option>
          <option>Identificación</option>
          <option>Pasaporte</option>
        </select>
      </div>

      <div>
        <label for="natural-numero-identificacion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Identificación *</label>
        <input id="natural-numero-identificacion" type="text" placeholder="Ingrese el número de documento"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.numeroIdentificacion" @input="handleInput('numeroIdentificacion', $event.target.value)" />
      </div>
      
      <div>
        <label for="natural-rtn" class="block text-sm font-medium text-gray-700 dark:text-gray-300">RTN (Opcional)</label>
        <input id="natural-rtn" type="text" placeholder="Ingrese el RTN"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.rtn" @input="handleInput('rtn', $event.target.value)" />
      </div>
      <div>
        <label for="natural-telefono" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono *</label>
        <input id="natural-telefono" type="tel" placeholder="+504 ____-____"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.telefono" @input="handleInput('telefono', $event.target.value)" />
      </div>
      <div>
        <label for="natural-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico *</label>
        <input id="natural-email" type="email" placeholder="ejemplo@correo.com"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.correo" @input="handleInput('correo', $event.target.value)" />
      </div>
      <div class="md:col-span-2">
        <label for="natural-direccion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección
          *</label>
        <input id="natural-direccion" type="text" placeholder="Colonia, calle, número de casa..."
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.direccion" @input="handleInput('direccion', $event.target.value)" />
      </div>
      <div>
        <label for="natural-sexo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sexo *</label>
        <select id="natural-sexo"
          class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-900 dark:text-gray-100"
          :value="naturalData.sexo" @input="handleInput('sexo', $event.target.value)">
          <option disabled value="">Seleccione una opción</option>
          <option>Masculino</option>
          <option>Femenino</option>
          <option>Prefiero no decirlo</option>
        </select>
      </div>
    </div>
    <button type="submit"
      class="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
      Registrar Cliente Natural
    </button>
  </form>
</template>