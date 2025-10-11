<template>
    <UDashboardPanel class="overflow-auto">
        <UDashboardNavbar title="Formulario de Cotización">
            <template #leading>
                <UDashboardSidebarCollapse />
            </template>
            <template #default>
            </template>
        </UDashboardNavbar>
        <div class="p-4 sm:p-8">
            <UCard class="space-y-8">
                <div class="border-b pb-4 mb-4">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Orden de Servicio - {{ quotationId }}
                    </h1>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Complete la información del cliente, vehículo y los detalles del servicio.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <UCard class="p-4">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <i class="i-heroicons-user-circle text-primary-500 text-xl"></i>
                                <h2 class="text-lg font-bold">Datos del Cliente</h2>
                            </div>
                        </template>
                        <div class="space-y-4">
                            <h3 class="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b pb-1 mb-2">Información de Contacto</h3>
                            <UFormGroup label="Nombre Completo" name="nombre">
                                <UInput v-model="form.nombre" placeholder="Ej: Juan Pérez" icon="i-heroicons-user" />
                            </UFormGroup>
                            <UFormGroup label="Celular de Contacto" name="celular">
                                <UInput v-model="form.celular" type="tel" placeholder="Ej: 5551234567"
                                    icon="i-heroicons-phone" />
                            </UFormGroup>
                            <UFormGroup label="Correo Electrónico" name="email">
                                <UInput v-model="form.email" type="email" placeholder="Ej: correo@ejemplo.com"
                                    icon="i-heroicons-envelope" />
                            </UFormGroup>
                            <UFormGroup label="RTN / DNI / Identidad" name="rtn">
                                <UInput v-model="form.rtn" placeholder="Ej: 08011980123456"
                                    icon="i-heroicons-identification-badge" />
                            </UFormGroup>
                            <UFormGroup label="Dirección de Domicilio" name="direccion">
                                <UInput v-model="form.direccion" placeholder="Ej: Col. El Centro, Calle Principal"
                                    icon="i-heroicons-map-pin" />
                            </UFormGroup>
                        </div>
                    </UCard>

                    <UCard class="p-4">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <i class="i-heroicons-truck text-primary-500 text-xl"></i>
                                <h2 class="text-lg font-bold">Datos del Vehículo</h2>
                            </div>
                        </template>
                        <div class="space-y-4">
                            <h3 class="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b pb-1 mb-2">Detalles de la Unidad</h3>
                            <UFormGroup label="Marca y Modelo" name="vehiculo">
                                <UInput v-model="form.vehiculo" placeholder="Ej: Toyota Corolla"
                                    icon="i-heroicons-truck" />
                            </UFormGroup>
                            <div class="grid grid-cols-2 gap-4">
                                <UFormGroup label="Placa" name="placa">
                                    <UInput v-model="form.placa" placeholder="Ej: ABC123" class="uppercase"
                                        icon="i-heroicons-tag" />
                                </UFormGroup>
                                <UFormGroup label="VIN (Chasis)" name="vin">
                                    <UInput v-model="form.vin" placeholder="Número de serie" class="uppercase"
                                        icon="i-heroicons-identification-badge" />
                                </UFormGroup>
                            </div>
                            <UFormGroup label="Odómetro (km)" name="odometro">
                                <UInput v-model="form.odometro" type="number" placeholder="Ej: 45200"
                                    icon="i-heroicons-gauge" />
                            </UFormGroup>
                        </div>
                    </UCard>

                    <UCard class="p-4">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <i class="i-heroicons-clipboard-document-list text-primary-500 text-xl"></i>
                                <h2 class="text-lg font-bold">Detalles de la Orden</h2>
                            </div>
                        </template>
                        <div class="space-y-4">
                            <h3 class="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b pb-1 mb-2">Administración y Fechas</h3>
                            <UFormGroup label="Técnico Asignado" name="tecnico">
                                <UInput v-model="form.tecnico" placeholder="Nombre del técnico"
                                    icon="i-heroicons-wrench-screwdriver" />
                            </UFormGroup>
                            <UFormGroup label="Fecha de Cotización" name="fecha">
                                <UInput v-model="form.fecha" type="date" icon="i-heroicons-calendar" />
                            </UFormGroup>
                            <UFormGroup label="Vigencia de Cotización (días)" name="vigenciaDias">
                                <UInput v-model="form.vigenciaDias" type="number" placeholder="Ej: 15"
                                    icon="i-heroicons-clock" :min="1" />
                            </UFormGroup>
                        </div>
                    </UCard>
                </div>

                <UCard>
                    <template #header>
                        <h2 class="text-lg font-bold">Ítems de Cotización</h2>
                    </template>
                    <div class="flex items-center">
                        <UFormGroup label="Buscar Servicio o Producto" class="w-full">
                            <UInput v-model="searchTerm" placeholder="Buscar Servicio"
                                icon="i-heroicons-magnifying-glass" />
                        </UFormGroup>
                    </div>

                    <div v-if="filteredItems.length && searchTerm" class="mb-4">
                        <ul
                            class="bg-gray-100 dark:bg-gray-800 rounded-md p-2 max-h-48 overflow-y-auto shadow-inner">
                            <li v-for="item in filteredItems" :key="item.id" @click="addItemToGrid(item)"
                                class="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <div class="font-semibold">{{ item.descripcion }}</div>
                                <div class="text-sm text-gray-600 dark:text-gray-400">
                                    Precio Total Unitario: L. {{ item.valorRepuesto + item.manoDeObra }}
                                </div>
                            </li>
                            <li v-if="!filteredItems.length"
                                class="text-gray-500 dark:text-gray-400 text-center py-4">
                                No se encontraron resultados.
                            </li>
                        </ul>
                    </div>

                    <DxDataGrid :data-source="form.items" :show-borders="true" :column-auto-width="true"
                        :row-alternation-enabled="true" class="devxtreme-grid">
                        <DxEditing :allow-deleting="true" :allow-updating="false" mode="row"
                            :use-icons="true" />
                        <DxColumn data-field="codigo" caption="Cód." :width="100" />
                        <DxColumn data-field="descripcion" caption="Descripción" />
                        <DxColumn data-field="condicion" caption="Tipo" :width="120" />
                        <DxColumn data-field="cantidad" caption="Cant." data-type="number" :width="80" />
                        <DxColumn data-field="precioDisplay" caption="Precio" data-type="number"
                            :format="{ type: 'currency', currency: 'HNL' }" />

                        <DxColumn caption="Subtotal" data-type="number" :width="120"
                            :format="{ type: 'currency', currency: 'HNL' }" :allow-editing="false"
                            cell-template="subtotal-cell-template" />
                        <template #subtotal-cell-template="{ data: cellData }">
                            {{
                                formatCurrency(
                                    cellData.data.cantidad * cellData.data.precioDisplay
                                )
                            }}
                        </template>
                    </DxDataGrid>

                    <UFormGroup label="Notas Adicionales (para el PDF)" name="comments" class="mt-4">
                        <UTextarea v-model="form.comments"
                            placeholder="Notas, condiciones o advertencias especiales. Ej: Precios válidos por 15 días." />
                    </UFormGroup>
                </UCard>

                <UCard class="w-full lg:w-1/2 ml-auto">
                    <template #header>
                        <h2 class="text-lg font-bold">Resumen de Totales</h2>
                    </template>
                    <div class="grid grid-cols-1 gap-4">
                        <div class="flex justify-between items-center pt-2">
                            <span class="font-bold text-xl text-gray-800 dark:text-gray-200">
                                SUBTOTAL:
                            </span>
                            <span class="text-xl font-bold text-primary-500">
                                {{ formatCurrency(subtotalGeneral) }}
                            </span>
                        </div>
                        <UDivider />
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-gray-700 dark:text-gray-300">
                                Impuesto (15%):
                            </span>
                            <span class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {{ formatCurrency(impuesto) }}
                            </span>
                        </div>
                        <div
                            class="flex justify-between items-center text-2xl font-extrabold text-primary-600 dark:text-primary-400 mt-2">
                            <span>TOTAL FINAL:</span>
                            <span>{{ formatCurrency(totalFinal) }}</span>
                        </div>
                    </div>
                </UCard>
                <UButton label="Generar PDF" icon="i-heroicons-printer-solid" color="primary"
                    @click="generateQuotationPdf" class="ml-auto" />
            </UCard>

        </div>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DxDataGrid, DxColumn, DxEditing } from 'devextreme-vue/data-grid'
import { useReceptionStore } from '~/store/reception'
import { useRoute } from 'vue-router'
import type { Vehicle } from '~/types/reception';


// =================================================================
// INTERFACES Y TIPOS
// =================================================================

interface Part {
    id: number;
    name: string;
    quantity: number;
    price: number;
    customerProvided: boolean;
    codigo: string;
    marca?: string;
}

interface Job {
    id: number;
    name: string;
    isService: boolean;
    serviceCost: number; // Mano de Obra para servicios o precio de venta para productos
    priceKey: string;
    parts: Part[]; // Repuestos ligados al servicio
    codigo: string;
    marca?: string;
}


interface ConsolidatedItem {
    cantidad: number;
    descripcion: string;
    // Se mantienen internamente para el payload final y cálculos detallados si se requieren
    manoDeObra: number;
    valorRepuesto: number;
    codigo: string;
    condicion: string;
    // 💥 NUEVO CAMPO: Precio a mostrar en la columna 'Precio' (unitario)
    precioDisplay: number;
}

interface PredefinedItem extends Omit<ConsolidatedItem, 'precioDisplay'> {
    id: number;
    marca: string; // Se mantiene en la data de búsqueda para el ejemplo
}

// 💡 CORREGIDO: Se añade el campo 'rtn' a la interfaz del cliente unificado
interface UnificadoClient {
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
    rtn: string; // <-- AÑADIDO
}

interface QuotationData {
    client: UnificadoClient | null;
    vehicle: Vehicle | null;
    jobs: Job[]; // Fuente principal de datos
    comments: string;
    vigenciaDias?: number;
    items?: ConsolidatedItem[]; // Fallback o data antigua
}


const receptionStore = useReceptionStore()
const route = useRoute()

const quotationId = ref(route.params.id || `C${Date.now()}`);

// Data estática para búsqueda (ManoDeObra + Repuesto = Precio Total Unitario)
const predefinedItems = ref<PredefinedItem[]>([
    // Estos ítems representan un servicio completo (MO + Repuesto), y se separarán al añadir.
    { id: 1, cantidad: 1, descripcion: 'Cambio de aceite y filtro (Completo)', marca: 'Mobil', manoDeObra: 250, valorRepuesto: 1200, codigo: 'SERV-001', condicion: 'Nuevo' },
    { id: 2, cantidad: 1, descripcion: 'Soporte de chasis delantero', marca: 'Genérico', manoDeObra: 400, valorRepuesto: 1800, codigo: 'REP-205', condicion: 'Usado' },
    { id: 3, cantidad: 1, descripcion: 'Revisión de frenos (Servicio Solo)', marca: 'N/A', manoDeObra: 300, valorRepuesto: 0, codigo: 'DIAG-002', condicion: 'Servicio' },
    { id: 4, cantidad: 1, descripcion: 'Balanceo y rotación de llantas', marca: 'Continental', manoDeObra: 150, valorRepuesto: 0, codigo: 'SERV-004', condicion: 'Servicio' },
])

// 💡 CORREGIDO: Se añade el campo 'rtn' a la definición del formulario local
const form = ref({
    nombre: '',
    celular: '',
    email: '',
    direccion: '',
    rtn: '', // <-- AÑADIDO
    vehiculo: '',
    placa: '',
    vin: '',
    odometro: null as number | null,
    tecnico: '',
    fecha: new Date().toISOString().slice(0, 10),
    vigenciaDias: 15 as number | null,
    comments: '',
    items: [] as ConsolidatedItem[],
})

const searchTerm = ref('')

// Filtro
const filteredItems = computed(() => {
    if (!searchTerm.value) return []
    const lowerCaseSearch = searchTerm.value.toLowerCase()
    return predefinedItems.value.filter((item) =>
        item.descripcion.toLowerCase().includes(lowerCaseSearch),
    )
})

// 💥 LÓGICA DE SEPARACIÓN AL AÑADIR UN ÍTEM DE BÚSQUEDA
const addItemToGrid = (item: PredefinedItem) => {
    // 1. Línea de Mano de Obra (si aplica)
    if (item.manoDeObra > 0) {
        form.value.items.push({
            cantidad: 1,
            descripcion: `${item.descripcion.replace('(Completo)', '').trim()} (Mano de Obra)`,
            manoDeObra: item.manoDeObra, // Costo de MO
            valorRepuesto: 0,
            codigo: item.codigo,
            condicion: 'Servicio',
            precioDisplay: item.manoDeObra, // Precio = MO unitario
        });
    }

    // 2. Línea de Repuesto (si aplica)
    if (item.valorRepuesto > 0) {
        const partName = item.descripcion.includes('aceite') ? 'Filtro y Aceite' : `${item.descripcion.replace('(Completo)', '').trim()} (Repuesto)`;

        form.value.items.push({
            cantidad: 1,
            descripcion: partName,
            manoDeObra: 0,
            valorRepuesto: item.valorRepuesto, // Precio unitario de repuesto
            codigo: item.codigo,
            condicion: 'Repuesto',
            precioDisplay: item.valorRepuesto, // Precio a mostrar = Precio unitario del repuesto
        });
    }

    if (item.manoDeObra === 0 && item.valorRepuesto === 0) {
        // En caso de que el item de búsqueda sea un item de precio 0 (diagnóstico, etc.)
        form.value.items.push({
            cantidad: 1,
            descripcion: item.descripcion,
            manoDeObra: 0,
            valorRepuesto: 0,
            codigo: item.codigo,
            condicion: 'Otros',
            precioDisplay: 0,
        });
    }
    searchTerm.value = ''
}

// Totales (Usan el campo precioDisplay)
const subtotalGeneral = computed(() =>
    form.value.items.reduce((sum, item) => sum + (item.cantidad * (item.precioDisplay || 0)), 0),
)
const impuesto = computed(() => subtotalGeneral.value * 0.15)
const totalFinal = computed(() => subtotalGeneral.value + impuesto.value)

// Formateo moneda
const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return 'L 0.00'
    return new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
        minimumFractionDigits: 2,
    }).format(value)
}


const generateQuotationPdf = async () => {

    const storeData = receptionStore.quotationData;
    const typedStoreData = storeData as QuotationData | null;

    if (!form.value.nombre || !form.value.items.length) {
        alert('Por favor, complete al menos el nombre del cliente y agregue ítems a la cotización.');
        return;
    }

    const clientAddress = form.value.direccion || 'N/A';
    const clientEmail = form.value.email || 'N/A';
    const clientRtn = form.value.rtn || 'N/A'; // 💡 CORREGIDO: Obtener RTN del formulario

    const carDetails = {
        marca: typedStoreData?.vehicle?.marca || 'N/A',
        modelo: typedStoreData?.vehicle?.modelo || 'N/A',
        year: typedStoreData?.vehicle?.year || new Date().getFullYear(),
        placa: form.value.placa,
        vin: form.value.vin,
        odometro: form.value.odometro,
    };

    // 🚨 Importante: Al enviar, se utiliza el array de ítems desglosado.
    const payload = {
        quoteData: {
            id: quotationId.value,
            items: form.value.items,
            comments: form.value.comments,
            tecnico: form.value.tecnico || 'N/A',
            vigenciaDias: form.value.vigenciaDias,
        },
        client: {
            nombre: form.value.nombre,
            telefono: form.value.celular,
            direccion: clientAddress,
            email: clientEmail,
            rtn: clientRtn, // 💡 CORREGIDO: Se incluye el RTN en el payload
        },
        car: carDetails,
    };

    try {
        const response = await fetch('/api/generate-quotation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response Error:', errorText);
            let errorData = { error: 'Error desconocido del servidor.' };
            try { errorData = JSON.parse(errorText); } catch { }
            throw new Error(errorData.error || 'Fallo al generar el PDF de cotización');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cotizacion_${quotationId.value}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Error desconocido al generar la cotización.';
        console.error('Error al generar la cotización:', error);
        alert(`Error al generar la cotización: ${errorMessage}`);
    }
};


// =================================================================
// LÓGICA DE POBLACIÓN DE DATOS AL MONTAR EL COMPONENTE (CRÍTICO: CORRECCIÓN DE MAPEO)
// =================================================================
onMounted(() => {
    const quotationData = receptionStore.quotationData as QuotationData | null;
    const itemsForGrid: ConsolidatedItem[] = [];

    if (quotationData) {

        // 1. Llenar datos de Cliente, Vehículo y otros campos...
        if (quotationData.client) {
            const client = quotationData.client;
            form.value.nombre = client.nombre || '';
            form.value.celular = client.telefono || '';
            form.value.email = client.correo || '';
            form.value.direccion = client.direccion || '';
            form.value.rtn = (client as any).rtn || ''; // 💡 CORREGIDO: Mapeo del RTN
        }

        if (quotationData.vehicle) {
            const vehicle = quotationData.vehicle as Vehicle;
            form.value.vehiculo = `${vehicle.marca || ''} ${vehicle.modelo || ''} ${vehicle.year || ''}`.trim();
            form.value.placa = vehicle.placa || '';
            form.value.vin = (vehicle as any).numeroChasis || (vehicle as any).vin || '';
            form.value.odometro = (vehicle as any).kilometraje || null;
        }

        // 2. Llenar el Datagrid DESGLOSANDO Servicios y Repuestos
        if (quotationData.jobs && quotationData.jobs.length > 0) {

            quotationData.jobs.forEach(job => {

                // A. Si es un SERVICIO (Mano de Obra + Repuestos)
                if (job.isService) {

                    // A.1. Línea de Mano de Obra del Servicio (SEPARADA)
                    if (job.serviceCost > 0) {
                        itemsForGrid.push({
                            cantidad: 1,
                            descripcion: `${job.name} (Mano de Obra)`,
                            manoDeObra: job.serviceCost, // Costo de MO
                            valorRepuesto: 0,
                            codigo: job.codigo || `SERV-${job.id}`,
                            condicion: 'Servicio',
                            precioDisplay: job.serviceCost, // Precio a mostrar = Costo de MO
                        });
                    }

                    // A.2. Líneas de Repuestos ligados al Servicio (SEPARADAS)
                    if (job.parts && job.parts.length > 0) {
                        job.parts.forEach(part => {
                            const partPrice = part.customerProvided ? 0 : (part.price || 0);

                            itemsForGrid.push({
                                cantidad: part.quantity,
                                descripcion: `${part.name}${part.customerProvided ? ' (Cliente Provee)' : ''}`,
                                manoDeObra: 0,
                                valorRepuesto: partPrice, // Precio unitario de repuesto
                                codigo: part.codigo || `REP-${part.id}`,
                                condicion: part.customerProvided ? 'Cliente Provee' : 'Repuesto',
                                precioDisplay: partPrice, // Precio a mostrar = Precio unitario del repuesto
                            });
                        });
                    }
                }
                // B. Si es un PRODUCTO/REPUESTO (vendido solo)
                else {
                    itemsForGrid.push({
                        cantidad: 1,
                        descripcion: job.name,
                        manoDeObra: 0,
                        valorRepuesto: job.serviceCost || 0, // Costo del producto
                        codigo: job.codigo || `PROD-${job.id}`,
                        condicion: 'Producto',
                        precioDisplay: job.serviceCost || 0, // Precio a mostrar = Costo del producto
                    });
                }
            });

            form.value.items = itemsForGrid;
        } else {
            form.value.items = [];
        }

        // 3. Llenar Notas Adicionales y Vigencia
        form.value.comments = quotationData.comments || '';
        form.value.vigenciaDias = quotationData.vigenciaDias || 15;
    }
});
</script>

<style>
@import 'devextreme/dist/css/dx.light.css';

.devxtreme-grid {
    font-family: var(--font-sans);
}

.uppercase {
    text-transform: uppercase;
}
</style>
