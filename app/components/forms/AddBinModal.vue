<template>
  <div class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Crear Nueva Estantería (Bin)
              </h3>
              <div class="mt-2 space-y-4">
                <div>
                  <label for="newBinCodigo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Código</label>
                  <input type="text" id="newBinCodigo" v-model="newBin.codigo" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label for="newBinDescripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                  <input type="text" id="newBinDescripcion" v-model="newBin.descripcion" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label for="newBinAlmacen" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Asignar a Almacén</label>
                  <select id="newBinAlmacen" v-model="newBin.almacenId" disabled class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm sm:text-sm cursor-not-allowed">
                    <option v-for="almacen in almacenes" :key="almacen.id" :value="almacen.id">{{ almacen.nombre }}</option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Asignado automáticamente al almacén seleccionado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="createBin" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
            Crear Bin
          </button>
          <button type="button" @click="$emit('close')" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  almacenId: {
    type: Number,
    required: true,
  },
  almacenes: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close', 'addBin']);

const newBin = reactive({
  codigo: '',
  descripcion: '',
  almacenId: props.almacenId,
});

watch(() => props.almacenId, (newId) => {
  newBin.almacenId = newId;
});

const createBin = () => {
  if (!newBin.codigo || !newBin.descripcion) {
    alert('Por favor, complete todos los campos.');
    return;
  }
  emit('addBin', {
    codigo: newBin.codigo,
    descripcion: newBin.descripcion,
    almacenId: newBin.almacenId,
  });
  newBin.codigo = '';
  newBin.descripcion = '';
  emit('close');
};
</script>
