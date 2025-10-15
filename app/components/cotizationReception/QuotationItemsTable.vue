<template>
  <div>
    <h3 class="font-semibold text-lg mb-4">Items de Cotización</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 mb-6 border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Precio (L.)</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Subtotal (L.)</th>
            <th scope="col" class="relative px-6 py-3"><span class="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(job, index) in jobs" :key="index">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ job.codigo || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span class="font-medium">{{ job.name }}</span>
              <p class="text-xs font-semibold text-blue-600 mt-1">({{ getPriceLabel(job.priceKey) }})</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <input
                type="number"
                :value="job.quantity || 1"
                @input="$emit('updateQuantity', index, $event.target.value)"
                min="1"
                step="1"
                class="input-field-table w-20 p-1 border border-gray-400 rounded-md text-sm text-center focus:ring-blue-500 focus:border-blue-500"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <template v-if="job.precios.editarPrecio">
                <div class="flex items-center gap-1">
                  <input
                    type="text"
                    :value="job.serviceCost"
                    @input="$emit('updateServiceCost', index, $event.target.value)"
                    class="input-field-table w-28 p-1 border border-blue-400 rounded-md text-sm text-center font-semibold focus:ring-blue-500 focus:border-blue-500"
                    inputmode="decimal"
                  />
                  <i class="dx-icon-edit-button text-red-500 text-sm"></i>
                </div>
              </template>
              <template v-else> L. {{ (job.serviceCost || 0).toFixed(2) }} </template>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">L. {{ getJobSubtotal(job).toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="$emit('removeJob', index)" class="text-red-600 hover:text-red-800 transition">
                <i class="dx-icon-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-100 border-t-2 border-gray-400">
            <td colspan="3" class="px-6 py-3 text-right text-sm font-bold text-gray-700 uppercase">Subtotal de Ítems:</td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3 text-left text-sm font-extrabold text-green-700">L. {{ itemsSubtotal.toFixed(2) }}</td>
            <td class="px-6 py-3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  jobs: { type: Array, required: true },
});

defineEmits(['updateQuantity', 'updateServiceCost', 'removeJob']);

// Funciones de utilidad que dependen de los datos de la tabla
const getJobSubtotal = (job) => {
  return (job.serviceCost || 0) * (job.quantity || 1);
};

const itemsSubtotal = computed(() => {
  return props.jobs.reduce((total, job) => total + getJobSubtotal(job), 0);
});

const getPriceLabel = (priceKey) => {
  const labels = {
    precioA: 'Precio A',
    precioB: 'Precio B',
    precioC: 'Precio C',
    precioD: 'Precio D',
  };
  return labels[priceKey] || 'Precio Estándar';
};
</script>

<style scoped>
/* Puedes mover estilos específicos de la tabla aquí si lo deseas */
.input-field-table {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
}
</style>
