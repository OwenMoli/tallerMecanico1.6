<template>
  <UDashboardPanel class="overflow-auto">
    <UDashboardNavbar title="Cotizaciones">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-8 min-h-screen">
      <div class="flex items-center gap-4 mb-8">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          size="md"
          placeholder="Buscar cotización..."
          class="flex-grow"
          v-model="search"
        />

        <UButton
          @click="prepareNewQuotation"
          icon="i-heroicons-plus-circle-solid"
          size="md"
          label="Nueva Cotización"
        />
      </div>
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-2/3 flex flex-col gap-4">
          <p v-if="filteredQuotes.length === 0" class="text-gray-500 dark:text-gray-400">
            {{ search ? `No se encontraron cotizaciones para "${search}"` : 'No hay cotizaciones para mostrar.' }}
          </p>
          <cotCard
            v-for="quote in filteredQuotes"
            :key="quote.id"
            :quote="quote"
            @click="selectQuote(quote)"
          />
        </div>
        <cotPreview :quote="selectedQuote" />
      </div>

      <div class="mt-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Catálogo de Productos/Servicios (Desde Store)
        </h3>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Total de items en el inventario: {{ allProducts.length }}
        </p>
      </div>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import cotCard from '~/components/cotizacion/cotizacionCard.vue';
import cotPreview from '~/components/cotizacion/cotizacionPreview.vue';
import { useProductStore } from '~/store/product';
import type { Quote, QuoteClient, QuotationDataStore } from '~/types/quotation';
import type { Client } from '~/types/reception';
import { useReceptionStore } from '~/store/reception';
import { useQuotationStore } from '~/store/quotation';

const router = useRouter();
const receptionStore = useReceptionStore();
const quotationStore = useQuotationStore();
const productStore = useProductStore();

const { quotes } = storeToRefs(quotationStore);
const search = ref('');

const selectedQuote = ref<Quote>(quotes.value[0] || {
    id: 'default',
    plate: 'N/A',
    status: 'pending',
    total: 0,
    vehicle: { brand: 'N/A', model: 'N/A', year: 0, kilometraje: 0, vin: 'N/A' },
    client: { id: 'DEFAULT', name: 'N/A', email: 'N/A', phone: 'N/A', rtn: 'N/A', direccion: 'N/A' },
    receptionist: 'N/A',
    lastUpdate: 'N/A',
    jobs: [],
    comments: '',
    items: [],
    details: { vigenciaDias: 0, recepcionista: 'N/A' },
});

const { allProducts } = storeToRefs(productStore);

const filteredQuotes = computed(() => {
    if (!search.value) {
        return quotes.value;
    }
    const searchTerm = search.value.toLowerCase();
    return quotes.value.filter(quote =>
        quote.plate.toLowerCase().includes(searchTerm) ||
        quote.id.toLowerCase().includes(searchTerm) ||
        quote.client.name.toLowerCase().includes(searchTerm) ||
        quote.vehicle.brand.toLowerCase().includes(searchTerm)
    );
});

// ✨ --- FUNCIÓN CORREGIDA Y SEGURA --- ✨
const selectQuote = (quote: Quote) => {
    // Esta función ahora solo actualiza la variable local para la vista previa.
    // Ya NO llama a `syncSelectedQuotation`, por lo que `quotationData` NO se contamina.
    selectedQuote.value = quote;

    // Es buena idea limpiar la URL del PDF aquí también.
    quotationStore.clearPdfUrl();
};

const prepareNewQuotation = () => {
  quotationStore.resetSelectedQuotation(); // Esto limpia `selectedQuotation` y `editingQuoteId`
  quotationStore.clearQuotationData();    // Limpiamos también quotationData por si acaso
  router.push('/operations/cotizacion/newCotizationForm');
};

const normalizeClientData = (client: Client): QuoteClient => {
    const defaultId = `TEMP-${Date.now()}`;
    const c = client as any;
    if ('nombre' in client && client.nombre !== undefined) {
        const fullName = `${c.nombre || ''} ${c.apellido || ''}`.trim();
        return {
            id: String(c.id) || defaultId, name: fullName || 'N/A', email: c.correo || 'N/A',
            phone: c.telefono || 'N/A', rtn: c.rtn || 'N/A', direccion: c.direccion || 'N/A',
        };
    }
    if ('empresaNombre' in client && client.empresaNombre !== undefined) {
        return {
            id: String(c.id) || defaultId, name: c.empresaNombre || 'N/A', email: c.contactoCorreo || 'N/A',
            phone: c.contactoTelefono || 'N/A', rtn: c.rtn || 'N/A', direccion: c.direccion || 'N/A',
        };
    }
    return { id: defaultId, name: 'N/A', email: 'N/A', phone: 'N/A', rtn: 'N/A', direccion: 'N/A' };
};

onMounted(async () => {
    await productStore.fetchAllProducts();
    const quotationData: QuotationDataStore | null = quotationStore.quotationData;

    if (quotationData && quotationData.client && quotationData.vehicle) {
        const quoteIdToUpdate = quotationStore.editingQuoteId;

        if (quoteIdToUpdate) {
            const index = quotes.value.findIndex(q => q.id === quoteIdToUpdate);
            if (index !== -1) {
                console.log(`✅ ACTUALIZANDO cotización existente con ID: ${quoteIdToUpdate}`);
                const updatedQuote: Quote = {
                    id: quoteIdToUpdate,
                    plate: quotationData.vehicle.placa,
                    status: 'quoted',
                    total: quotationData.totals.total,
                    vehicle: {
                        brand: quotationData.vehicle.marca, model: quotationData.vehicle.modelo, year: quotationData.vehicle.year,
                        kilometraje: quotationData.vehicle.kilometraje || 0, vin: quotationData.vehicle.vin || 'N/A',
                    },
                    client: normalizeClientData(quotationData.client),
                    receptionist: quotationData.orden.asesor || 'N/A',
                    lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    jobs: quotationData.jobs,
                    comments: quotationData.comments,
                    items: quotationData.items || [],
                    details: {
                        vigenciaDias: quotationData.orden.vigenciaDias || 7,
                        recepcionista: quotationData.orden.asesor || 'N/A'
                    },
                };
                quotes.value.splice(index, 1, updatedQuote);
                selectedQuote.value = updatedQuote;
            } else {
                console.error(`❌ ERROR: No se encontró la cotización con ID ${quoteIdToUpdate} para actualizar.`);
            }
        } else {
            console.log("✨ CREANDO nueva cotización...");
            const newQuote: Quote = {
                id: `COT-${Date.now()}`,
                plate: quotationData.vehicle.placa,
                status: 'quoted',
                total: quotationData.totals.total,
                vehicle: {
                    brand: quotationData.vehicle.marca, model: quotationData.vehicle.modelo, year: quotationData.vehicle.year,
                    kilometraje: quotationData.vehicle.kilometraje || 0, vin: quotationData.vehicle.vin || 'N/A',
                },
                client: normalizeClientData(quotationData.client),
                receptionist: quotationData.orden.asesor || 'N/A',
                lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
                jobs: quotationData.jobs,
                comments: quotationData.comments,
                items: quotationData.items || [],
                details: {
                    vigenciaDias: quotationData.orden.vigenciaDias || 7,
                    recepcionista: quotationData.orden.asesor || 'N/A'
                },
            };
            quotes.value.unshift(newQuote);
            selectedQuote.value = newQuote;
        }

        quotationStore.clearQuotationData();
        quotationStore.resetSelectedQuotation();
        receptionStore.resetReception();
        search.value = '';
    }
});
</script>
