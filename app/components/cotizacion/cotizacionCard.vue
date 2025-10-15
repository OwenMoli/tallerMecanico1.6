<template>
  <UCard class="bg-white dark:bg-gray-950 rounded-lg shadow-lg text-gray-900 dark:text-gray-50">
    <template #header>
      <div class="flex items-center justify-between pb-2">
        <div class="flex items-center gap-2">
          <p class="font-bold text-lg">Placa: {{ quote.plate }}</p>
          <p class="text-gray-400"># {{ quote.id }}</p>
        </div>
        <p class="text-gray-900 dark:text-gray-50 font-semibold text-right">
          Cliente: {{ quote.client.name }}
        </p>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="space-y-1 text-sm">
          <p>
            <span class="font-semibold">Marca:</span> {{ quote.vehicle.brand }}
          </p>
          <p>
            <span class="font-semibold">Modelo:</span> {{ quote.vehicle.model }}
          </p>
          <p>
            <span class="font-semibold">Año:</span> {{ quote.vehicle.year }}
          </p>
        </div>
        <p class="text-sm mt-2">
          <span class="font-semibold">Recepción por:</span> {{ quote.receptionist }}
        </p>
      </div>

      <div class="md:text-right">
        <p class="text-sm text-gray-500">
          <span class="font-semibold">Correo:</span> {{ quote.client.email }}
        </p>
        <p class="text-sm text-gray-500">
          <span class="font-semibold">Cel:</span> {{ quote.client.phone }}
        </p>
        <p class="text-sm text-gray-400 flex items-center gap-1 md:justify-end mt-1">
          <UIcon name="i-heroicons-calendar" class="text-gray-400" />
          {{ formatDate(quote.lastUpdate) }} </p>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col md:flex-row justify-between items-center pt-2 gap-4">
        <div class="flex items-center gap-4">
          <UBadge
            :label="quote.status.charAt(0).toUpperCase() + quote.status.slice(1)"
            :color="quote.status === 'approved' ? 'primary' : (quote.status === 'quoted' ? 'success' : 'info')"
            variant="solid"
            class="font-semibold px-2 py-0.5 text-xs"
          />
          <p v-if="quote.total" class="text-lg font-bold text-gray-900 dark:text-gray-50">
            Total: {{ formatCurrency(quote.total) }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2 justify-end">
          <UButton
            v-if="quote.status !== 'approved'"
            label="Aprobar y Generar OT"
            icon="i-heroicons-check-circle"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold"
            size="sm"
            @click.stop="approveAndCreateWorkOrder"
          />
          <UButton
            icon="i-heroicons-printer"
            label="PDF"
            color="secondary"
            size="sm"
            @click.stop="handleGeneratePdf"
          />
          <UButton
            label="Editar Cotización"
            icon="i-heroicons-pencil-square"
            class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            size="sm"
            @click.stop="cotizationForm"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWorkOrderStore } from '~/store/workOrder';
import type { Quote } from '~/types/quotation';

// ✅ --- 1. IMPORTACIÓN CORREGIDA ---
// Se importa el store correcto para manejar las cotizaciones.
import { useQuotationStore } from '~/store/quotation';

// ✅ --- 2. INSTANCIAS DE STORES CORREGIDAS ---
const quotationStore = useQuotationStore(); // Store para acciones de cotización
const workOrderStore = useWorkOrderStore(); // Store para acciones de orden de trabajo
const router = useRouter();

const props = defineProps({
  quote: {
    type: Object as () => Quote,
    required: true,
  },
});

// --- Funciones de formato (sin cambios) ---
const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '0.00 LPS';
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
  }).format(amount).replace('HNL', 'LPS');
};

const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString.replace(' ', 'T'));
    if (isNaN(date.getTime())) return isoString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return isoString;
  }
};

// ✅ --- 3. FUNCIONES CON LLAMADAS CORREGIDAS ---

const cotizationForm = () => {
  // Llama a las acciones desde el store de cotizaciones
  quotationStore.syncSelectedQuotation(props.quote);
  quotationStore.clearPdfUrl();
  router.push('/operations/cotizacion/newCotizationForm');
};

const handleGeneratePdf = async () => {
  // Llama a las acciones desde el store de cotizaciones
  quotationStore.syncSelectedQuotation(props.quote);
  await quotationStore.generateQuotationPdf();

  // Abre el PDF en una nueva pestaña si la URL se generó
  if(quotationStore.pdfUrl) {
    window.open(quotationStore.pdfUrl, '_blank');
  }
};

const approveAndCreateWorkOrder = () => {
  if (confirm('¿Está seguro de que desea aprobar esta cotización y generar una Orden de Trabajo? Esta acción no se puede deshacer.')) {
    const newWorkOrder = workOrderStore.createWorkOrderFromQuote(props.quote);

    if (newWorkOrder) {
      props.quote.status = 'approved';
      router.push('/operations/cotizacion/workOrder');
    } else {
      alert('Hubo un error al crear la Orden de Trabajo.');
    }
  }
};
</script>
