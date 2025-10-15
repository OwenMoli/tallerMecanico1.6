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

        <NuxtLink to="./newCotizationForm"> <UButton
          icon="i-heroicons-plus-circle-solid"
          size="md"
          label="Nueva Cotización"
        />
        </NuxtLink>
      </div>
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-2/2 flex flex-col gap-4">
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
import { storeToRefs } from 'pinia'; // ✅ IMPORTANTE: Añadir storeToRefs
import cotCard from '~/components/cotizacion/cotizacionCard.vue';
import cotPreview from '~/components/cotizacion/cotizacionPreview.vue';
import { useProductStore } from '~/store/product';
import type { Quote, QuoteClient, ConsolidatedItem, ManualOrderDetails, QuotationDataStore } from '~/types/quotation';
import type { Client, Vehicle } from '~/types/reception';
import { useReceptionStore } from '~/store/reception';
import { useQuotationStore } from '~/store/quotation';

const receptionStore = useReceptionStore();
const quotationStore = useQuotationStore();
const productStore = useProductStore();

// ✅ --- CAMBIO CLAVE: LEEMOS DEL STORE ---
// Ya no creamos una lista local. La obtenemos directamente del store.
// storeToRefs asegura que la lista siga siendo reactiva.
const { quotes } = storeToRefs(quotationStore);

const search = ref('');

// Este ref ahora solo maneja QUÉ cotización se está viendo, no la lista completa.
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

const allProducts = computed(() => productStore.allProducts);

// Este computed ahora trabaja sobre la lista del store, que es siempre la correcta.
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

const selectQuote = (quote: Quote) => {
    selectedQuote.value = quote;
    quotationStore.syncSelectedQuotation(quote);
    quotationStore.clearPdfUrl();
};

const normalizeClientData = (client: Client): QuoteClient => {
    const defaultId = `TEMP-${Date.now()}`;
    const c = client as any;
    if ('nombre' in client && client.nombre !== undefined) {
        const fullName = `${c.nombre || ''} ${c.apellido || ''}`.trim();
        return {
            id: String(c.id) || defaultId,
            name: fullName || 'N/A',
            email: c.correo || 'N/A',
            phone: c.telefono || 'N/A',
            rtn: c.rtn || 'N/A',
            direccion: c.direccion || 'N/A',
        };
    }
    if ('empresaNombre' in client && client.empresaNombre !== undefined) {
        return {
            id: String(c.id) || defaultId,
            name: c.empresaNombre || 'N/A',
            email: c.contactoCorreo || 'N/A',
            phone: c.contactoTelefono || 'N/A',
            rtn: c.rtn || 'N/A',
            direccion: c.direccion || 'N/A',
        };
    }
    return { id: defaultId, name: 'N/A', email: 'N/A', phone: 'N/A', rtn: 'N/A', direccion: 'N/A' };
};

onMounted(async () => {
    await productStore.loadAllProducts();

    const quotationData: QuotationDataStore | null = quotationStore.quotationData;

    if (quotationData && quotationData.client && quotationData.vehicle) {
        if (quotationData.id) {
            // AHORA ESTO FUNCIONARÁ SIEMPRE porque `quotes.value` es la lista persistente del store
            const index = quotes.value.findIndex(q => q.id === quotationData.id);
            if (index !== -1) {
                console.log(`✅ Cotización encontrada en el índice ${index}. Reemplazando...`);
                const updatedQuote: Quote = {
                    id: quotationData.id,
                    plate: quotationData.vehicle.placa,
                    status: 'pending',
                    total: quotationData.totals.total,
                    vehicle: {
                        brand: quotationData.vehicle.marca,
                        model: quotationData.vehicle.modelo,
                        year: quotationData.vehicle.year,
                        kilometraje: quotationData.vehicle.kilometraje || 0,
                        vin: quotationData.vehicle.vin || 'N/A',
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

                // Actualizamos la lista del STORE a través de su ref
                quotes.value.splice(index, 1, updatedQuote);
                selectedQuote.value = updatedQuote;
            } else {
                // Este error ya no debería aparecer.
                console.error(`❌ ERROR: No se encontró la cotización con ID ${quotationData.id} en la lista para actualizar.`);
            }
        } else {
            console.log("✨ Creando nueva cotización...");
            const newQuote: Quote = {
                id: `COT-${Date.now()}`,
                plate: quotationData.vehicle.placa,
                status: 'pending',
                total: quotationData.totals.total,
                vehicle: {
                    brand: quotationData.vehicle.marca,
                    model: quotationData.vehicle.modelo,
                    year: quotationData.vehicle.year,
                    kilometraje: quotationData.vehicle.kilometraje || 0,
                    vin: quotationData.vehicle.vin || 'N/A',
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

            // Añadimos la nueva cotización a la lista del STORE a través de su ref
            quotes.value.unshift(newQuote);
            selectedQuote.value = newQuote;
        }

        quotationStore.clearQuotationData();
        receptionStore.resetReception();
        search.value = '';
    }
});
</script>
