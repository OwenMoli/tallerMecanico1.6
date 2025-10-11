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
        <div class="w-full lg:w-2/5 flex flex-col gap-4">
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
import cotCard from '~/components/cotizacion/cotizacionCard.vue';
import cotPreview from '~/components/cotizacion/cotizacionPreview.vue';
import { useReceptionStore } from '~/store/reception';
import { useProductStore } from '~/store/product';
import type { Quote, QuoteClient, ConsolidatedItem, ManualOrderDetails, QuotationDataStore } from '~/types/quotation';
import type { Client, Vehicle } from '~/types/reception';

// --- STORES ---
const receptionStore = useReceptionStore();
const productStore = useProductStore();

// --- ESTADO ---
const search = ref(''); // Estado para el input de búsqueda

const quotes = ref<Quote[]>([
      {
            id: '27215',
            plate: 'XYZ-123',
            status: 'pending',
            total: 800,
            vehicle: { brand: 'TOYOTA', model: 'Corolla', year: 2022, kilometraje: 120000, vin: 'JT2BG12G' },
            client: { id: 'C1', name: 'Rodrigo Kruth', email: 'romarioMdz1997@gmail.com', phone: '+504 9310-5695', rtn: '0801199700010', direccion: 'Col. Moderna, 3ra calle' },
            receptionist: 'Rubén Herrera',
            lastUpdate: '2023-10-10 10:00:00',
            jobs: [],
            comments: 'Revisar frenos y aceite.',
            items: [
                  { descripcion: 'Mano de Obra: Revisión', cantidad: 1, manoDeObra: 300, valorRepuesto: 0, codigo: 'MO-REV', marca: 'Taller', condicion: 'Servicio' },
                  { descripcion: 'Filtro de Aire', cantidad: 1, manoDeObra: 0, valorRepuesto: 500, codigo: 'FA-123', marca: 'Wix', condicion: 'Nuevo' },
            ] as ConsolidatedItem[],
        details: { vigenciaDias: 7, recepcionista: 'Rubén Herrera' },
      },
      {
            id: '27214',
            plate: 'ABC-456',
            status: 'quoted',
            total: 14000,
            vehicle: { brand: 'HONDA', model: 'Civic', year: 2021, kilometraje: 80000, vin: 'ABG45GTD' },
            client: { id: 'C2', name: 'GR Tecnologia', email: 'info@gr.com', phone: '+504 1234-5678', rtn: '0800199000055', direccion: 'Barrio El Centro' },
            receptionist: 'Rubén Herrera',
            lastUpdate: '2023-10-09 15:30:00',
            jobs: [],
            comments: 'Cambio de clutch completo.',
            items: [
                  { descripcion: 'Mano de Obra: Clutch', cantidad: 1, manoDeObra: 5000, valorRepuesto: 0, codigo: 'MO-CLT', marca: 'Taller', condicion: 'Servicio' },
                  { descripcion: 'Kit de Clutch', cantidad: 1, manoDeObra: 0, valorRepuesto: 9000, codigo: 'KC-456', marca: 'Exedy', condicion: 'Nuevo' },
            ] as ConsolidatedItem[],
        details: { vigenciaDias: 15, recepcionista: 'Rubén Herrera' },
      },
]);

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

// Computed para filtrar las cotizaciones
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


// --- FUNCIONES ---
const selectQuote = (quote: Quote) => {
      selectedQuote.value = quote;
      receptionStore.syncSelectedQuotation(quote);
      receptionStore.clearPdfUrl(); // Limpiar el PDF al seleccionar otra cotización
};

const normalizeClientData = (client: Client): QuoteClient => {
      const defaultId = `TEMP-${Date.now()}`;
      const c = client as any;
      if ('nombre' in client && client.nombre !== undefined) {
            const fullName = `${c.nombre || ''} ${c.apellido || ''}`.trim();
            return {
                  id: c.id || defaultId,
                  name: fullName || 'N/A',
                  email: c.correo || 'N/A',
                  phone: c.telefono || 'N/A',
                  rtn: c.rtn || 'N/A',
                  direccion: c.direccion || 'N/A',
            };
      }
      if ('empresaNombre' in client && client.empresaNombre !== undefined) {
            return {
                  id: c.id || defaultId,
                  name: c.empresaNombre || 'N/A',
                  email: c.contactoCorreo || 'N/A',
                  phone: c.contactoTelefono || 'N/A',
                  rtn: c.rtn || 'N/A',
                  direccion: c.direccion || 'N/A',
            };
      }
      return { id: defaultId, name: 'N/A', email: 'N/A', phone: 'N/A', rtn: 'N/A', direccion: 'N/A' };
};

// --- CICLO DE VIDA (MODIFICADO) ---
onMounted(async () => {
    await productStore.loadAllProducts();
    console.log(`✅ Productos cargados: ${allProducts.value.length} items.`);

    const quotationData: QuotationDataStore | null = receptionStore.quotationData;

    // Solo se ejecuta si hay datos de cotización pendientes desde el formulario
    if (quotationData && quotationData.client && quotationData.vehicle && quotationData.jobs) {

        // --- INICIA LA LÓGICA DE EDICIÓN ---
        // Si la cotización que llega tiene un ID, la actualizamos
        if (quotationData.id) {
            console.log(`Buscando cotización para actualizar con ID: ${quotationData.id}`);
            const index = quotes.value.findIndex(q => q.id === quotationData.id);

            // Si la encontramos en la lista...
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

                // Usamos splice para reemplazar el objeto viejo por el nuevo
                quotes.value.splice(index, 1, updatedQuote);
                selectedQuote.value = updatedQuote;
            } else {
                 // Este mensaje aparecerá si algo sale mal al buscar la cotización
                 console.error(`❌ ERROR: No se encontró la cotización con ID ${quotationData.id} en la lista para actualizar.`);
            }
        }
        // --- INICIA LA LÓGICA DE CREACIÓN ---
        // Si no tiene ID, es nueva
        else {
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

            quotes.value.unshift(newQuote);
            selectedQuote.value = newQuote;
        }

        // --- LIMPIEZA FINAL ---
        // Se limpian los datos del store DESPUÉS de haberlos usado.
        receptionStore.clearQuotationData();
        receptionStore.resetReception();

        // ✅ <<<--- CORRECCIÓN AÑADIDA AQUÍ ---
        search.value = '';
    }
});
</script>
