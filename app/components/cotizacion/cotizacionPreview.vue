<template>
  <div
    class="hidden lg:block w-full lg:w-3/5 bg-white dark:bg-gray-950 rounded-lg shadow-xl p-6 flex flex-col overflow-hidden"
    :class="{'items-center justify-center': (!quote.id || quote.id === 'default') && !pdfUrl}"
    style="max-height: 90vh;"
  >

    <div v-if="pdfUrl" class="w-full h-full flex flex-col">
      <h2 class="text-xl font-bold mb-2 text-lime-600 dark:text-lime-400 flex justify-between items-center">
        Previsualización PDF
        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="receptionStore.clearPdfUrl()"
        />
      </h2>
      <iframe
        :src="pdfUrl"
        width="100%"
        height="100%"
        type="application/pdf"
        class="flex-grow rounded-lg border border-gray-300 dark:border-gray-700"
      >
        <p class="p-4 text-center">Tu navegador no soporta iframes para PDF.</p>
      </iframe>
    </div>

    <div v-else-if="!quote.id || quote.id === 'default'" class="flex items-center justify-center h-full">
      <h2 class="text-3xl font-bold text-gray-400 dark:text-gray-600">
        Selecciona una Cotización
      </h2>
      <p class="text-gray-400 dark:text-gray-600 mt-2">
        Haz click en una tarjeta de la izquierda para ver su detalle.
      </p>
    </div>

    <div v-else class="flex-grow overflow-y-auto">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">
        Detalle de Cotización #{{ quote.id }}
      </h2>

      <div class="grid grid-cols-2 gap-4 border-b pb-4 mb-4 border-gray-200 dark:border-gray-800">
        <div>
          <h3 class="font-semibold text-lg mb-1">Cliente</h3>
          <p class="text-sm">
            <span class="font-bold">{{ quote.client.name }}</span>
          </p>
          <p class="text-xs text-gray-500">
            {{ quote.client.email }} / {{ quote.client.phone }}
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-1">Vehículo</h3>
          <p class="text-sm">
            <span class="font-bold">{{ quote.vehicle.brand }} {{ quote.vehicle.model }}</span> ({{ quote.vehicle.year }})
          </p>
          <p class="text-xs text-gray-500">
            <span class="font-bold text-gray-700 dark:text-gray-300">Placa: {{ quote.plate }}</span>
          </p>
        </div>
      </div>

      <h3 class="font-semibold text-xl mb-3 mt-4">Ítems de la Cotización ({{ quote.items?.length || 0 }})</h3>

      <div class="space-y-2">
        <div v-for="(item, index) in quote.items" :key="index" class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg flex justify-between items-center">
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-gray-50">
              {{ item.descripcion }}
              <span class="text-xs text-gray-500 ml-1">({{ item.codigo }})</span>
            </p>
            <p class="text-xs text-gray-500">
              {{ item.cantidad }} x Repuesto: {{ item.valorRepuesto }} LPS | M.O: {{ item.manoDeObra }} LPS
            </p>
          </div>
          <p class="font-bold text-base text-right">
            {{ (item.cantidad * (item.valorRepuesto + item.manoDeObra)).toLocaleString('es-HN') }} LPS
          </p>
        </div>

        <p v-if="quote.items && quote.items.length === 0" class="text-gray-500 dark:text-gray-400 p-4 border-dashed border-2 rounded-lg text-center">
          No se han añadido ítems a esta cotización.
        </p>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-right">
        <p class="text-xl font-extrabold text-lime-600 dark:text-lime-400">
          TOTAL: {{ quote.total.toLocaleString('es-HN') }} LPS
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useReceptionStore } from '~/store/reception';

const props = defineProps({
  quote: {
    type: Object,
    default: () => ({})
  }
});

const receptionStore = useReceptionStore();
const pdfUrl = computed(() => receptionStore.pdfUrl);
</script>
