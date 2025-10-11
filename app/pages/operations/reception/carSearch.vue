<template>
    <div>
        <div class="reception-details-container" id="reception-details-section">
            <div class="flex justify-end mb-4">
                <button @click="$emit('hide-details')" class="hide-car-button">
                    Seleccionar otro coche
                </button>
            </div>

            <div class="reception-header">
                <h2 class="reception-title">Detalles del Servicio</h2>
            </div>
            <div class="reception-body">

                <JobSelectionArea
                    ref="jobSelectionRef"
                    :available-jobs="availableJobsData"
                    @add-job="handleJobAdded"
                    @open-product-form-modal="openProductFormModal"
                />

                <div v-if="selectedJobsDetails.length > 0">
                    <h3 class="font-semibold text-lg mb-4 mt-6 border-t pt-4">Vista Previa de la Cotización</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Cliente</h4>
                            <div class="space-y-2 text-sm">
                                <p><strong>Nombre:</strong> {{ clientName }}</p>
                                <p><strong>Teléfono:</strong> {{ clientPhone }}</p>
                                <p v-if="clientEmail"><strong>Email:</strong> {{ clientEmail }}</p>
                                <p v-if="clientAddress"><strong>Dirección:</strong> {{ clientAddress }}</p>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Vehículo</h4>
                            <div class="space-y-2 text-sm">
                                <p><strong>Marca:</strong> {{ selectedCar.marca }}</p>
                                <p><strong>Modelo:</strong> {{ selectedCar.modelo }}</p>
                                <p><strong>Placa:</strong> {{ selectedCar.placa }}</p>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="font-bold text-md mb-2 text-gray-800">Detalles de la Orden</h4>
                            <div class="space-y-2 text-sm">
                                <p><strong>Fecha:</strong> {{ formatDate(new Date()) }}</p>
                                <p><strong>Odómetro:</strong> {{ selectedCar.kilometraje }} Km</p>
                                <p><strong>VIN:</strong> {{ selectedCar.vin || 'No proporcionado' }}</p>
                            </div>
                        </div>
                    </div>

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
                                <tr v-for="(job, index) in selectedJobsDetails" :key="index">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ job.codigo || 'N/A' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span class="font-medium">{{ job.name }}</span>
                                        <p class="text-xs font-semibold text-blue-600 mt-1">
                                            ({{ getPriceLabel(job.priceKey) }})
                                        </p>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            :value="job.quantity || 1"
                                            @input="updateJobQuantity(index, $event.target.value)"
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
                                                    @input="updateJobServiceCost(index, $event.target.value)"
                                                    class="input-field-table w-28 p-1 border border-blue-400 rounded-md text-sm text-center font-semibold focus:ring-blue-500 focus:border-blue-500"
                                                    inputmode="decimal"
                                                />
                                                <i class="dx-icon-edit-button text-red-500 text-sm"></i>
                                            </div>
                                        </template>
                                        <template v-else>
                                            L. {{ (job.serviceCost || 0).toFixed(2) }}
                                        </template>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                                        L. {{ getJobSubtotal(job).toFixed(2) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button @click="removeJob(index)" class="text-red-600 hover:text-red-800 transition">
                                            <i class="dx-icon-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="bg-gray-100 border-t-2 border-gray-400">
                                    <td colspan="3" class="px-6 py-3 text-right text-sm font-bold text-gray-700 uppercase">
                                        Subtotal de Ítems:
                                    </td>
                                    <td class="px-6 py-3 text-left text-sm font-bold text-gray-700"></td>
                                    <td class="px-6 py-3 text-left text-sm font-extrabold text-green-700">
                                        L. {{ quotationPreviewData.subtotal.toFixed(2) }}
                                    </td>
                                    <td class="px-6 py-3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div class="flex justify-end">
                        <div class="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 class="font-bold text-xl mb-3 text-gray-800">Resumen de Totales</h3>

                            <div class="space-y-3 text-sm text-gray-700">
                                <div class="flex justify-between font-bold text-lg text-green-700 border-t pt-2">
                                    <span>SUBTOTAL (Neto de Ítems):</span>
                                    <span>L. {{ quotationPreviewData.subtotal.toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between text-base">
                                    <span>Impuesto ({{ quotationPreviewData.taxRateDisplay }}%):</span>
                                    <span class="font-semibold text-red-600">L. {{ quotationPreviewData.tax.toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between font-extrabold text-xl text-blue-700 border-t border-gray-300 pt-3">
                                    <span>TOTAL A PAGAR:</span>
                                    <span>L. {{ quotationPreviewData.total.toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between items-center gap-3 mt-8 pt-4 border-t border-gray-300">
                        <textarea
                            v-model="comments"
                            placeholder="Notas o Comentarios Adicionales de la Cotización..."
                            class="flex-grow p-3 border rounded-lg resize-none h-24 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>

                        <div class="flex flex-col gap-3">
                            <button @click="finalizeQuotation" class="process-button-reception text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700">
                                Finalizar Cotización
                            </button>
                            <button @click="$emit('hide-details')" class="hide-car-button bg-gray-400 hover:bg-gray-500 text-lg px-8 py-3">
                                Cancelar y Volver
                            </button>
                        </div>
                    </div>

                </div>
                <div v-else class="text-center text-gray-500 p-10 bg-gray-50 rounded-lg mt-8">
                    <p>Agregue un trabajo para ver la vista previa de la cotización.</p>
                    <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-300">
                        <button disabled class="process-button-reception text-lg px-8 py-3 bg-blue-400 cursor-not-allowed">
                            Finalizar Cotización
                        </button>
                    </div>
                </div>
            </div>

            <DxPopup
                :visible="isProductFormModalOpen"
                @update:visible="isProductFormModalOpen = $event"
                :title="isEditingProduct ? 'Editar Producto/Servicio' : 'Registrar Nuevo Producto/Servicio'"
                :width="1200"
                :height="'80vh'"
                :show-title="true"
                :drag-enabled="false"
                :close-on-outside-click="true"
            >
                <div class="p-4">
                    <ProductForm
                        :initialData="currentProductRecord"
                        :isEditing="isEditingProduct"
                        @save-success="handleProductFormSaved"
                    />
                </div>
            </DxPopup>

            <DxPopup
                :visible="isFinalizeModalOpen"
                @update:visible="isFinalizeModalOpen = $event"
                title="Confirmar Cotización"
                :width="400"
                :height="'auto'"
                :show-title="true"
                :drag-enabled="false"
                :close-on-outside-click="true"
            >
                <div class="p-4 text-center">
                    <p class="mb-4 text-lg">¿Está seguro de que desea **Finalizar y Guardar** esta Cotización?</p>
                    <div class="flex justify-end gap-3 mt-4">
                        <button @click="isFinalizeModalOpen = false" class="hide-car-button bg-gray-400 hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button @click="onConfirmQuotation" class="process-button-reception bg-blue-600 hover:bg-blue-700">
                            Confirmar
                        </button>
                    </div>
                    </div>
                </DxPopup>

            <DxPopup
                :visible="isErrorModalOpen"
                @update:visible="isErrorModalOpen = $event"
                title="Error de Cotización"
                :width="400"
                :height="'auto'"
                :show-title="true"
                :drag-enabled="false"
                :close-on-outside-click="true"
            >
                <div class="p-4 text-center">
                    <p class="mb-4 text-lg text-red-600">No se puede finalizar la cotización.</p>
                    <p>Por favor, **añada al menos un servicio o producto** antes de continuar.</p>
                    <div class="flex justify-end mt-4">
                        <button @click="isErrorModalOpen = false" class="process-button-reception bg-red-600 hover:bg-red-700">
                            Entendido
                        </button>
                    </div>
                </div>
            </DxPopup>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { DxPopup } from 'devextreme-vue/popup';
import ProductForm from '~/pages/settings/inventory/products.vue';
import { useQuotationLogic } from '~/composables/useQuotationLogic';
import JobSelectionArea from '~/components/cotizacion/productSearch.vue';

const props = defineProps({
    selectedCar: {
        type: Object,
        required: true,
    },
    client: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['hide-details']);
const router = useRouter();
const jobSelectionRef = ref(null);

// --- USO DEL COMPOSABLE ---
const {
    selectedJobsDetails,
    comments,
    isProductFormModalOpen,
    isEditingProduct,
    currentProductRecord,
    isFinalizeModalOpen,
    isErrorModalOpen,
    availableJobsData,
    clientName,
    clientPhone,
    clientEmail,
    clientAddress,
    quotationPreviewData,
    productStore,
    getJobSubtotal,
    getPriceLabel,
    addJob,
    removeJob,
    finalizeQuotation,
    onConfirmQuotation,
    openProductFormModal,
    updateJobServiceCost,
} = useQuotationLogic(props, router);

// --- Carga Inicial de Datos ---
onMounted(async () => {
    await productStore.loadAllProducts();
});

// --- FUNCIONES PARA LA TABLA ---

/**
 * Actualiza la cantidad de un item en el array selectedJobsDetails.
 * @param {number} index - Índice del item a actualizar.
 * @param {string} value - Nuevo valor del input (como string).
 */
function updateJobQuantity(index, value) {
    const parsedValue = parseFloat(value);

    // Si es un número válido y mayor o igual a 1, actualiza la cantidad.
    if (!isNaN(parsedValue) && parsedValue >= 1) {
        selectedJobsDetails.value[index].quantity = parsedValue;
    } else if (value === '' || isNaN(parsedValue) || parsedValue < 1) {
        // Si el usuario borra el campo, o el valor es inválido/negativo, lo forzamos a 1.
        selectedJobsDetails.value[index].quantity = 1;
    }
}


// --- FUNCIONES UTILITARIAS Y HANDLERS ---

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function handleJobAdded(jobDetails) {
    addJob(jobDetails);
}

async function handleProductFormSaved(savedProduct) {
    isProductFormModalOpen.value = false;

    // Recargar productos para incluir el nuevo
    await productStore.loadAllProducts();

    await nextTick();

    // Intentar seleccionar el nuevo producto en el componente hijo
    if (jobSelectionRef.value) {
        const newJob = availableJobsData.value.find(j => j.id === savedProduct.id);
        if (newJob) {
            jobSelectionRef.value.selectJobOption(newJob);
        }
    }
}
</script>

<style scoped>
/* Copiar todos los estilos scoped del archivo original, excluyendo
    los que ya se movieron a JobSelectionArea.vue (e.g., .searchable-dropdown-container) */

.reception-details-container {
    max-width: 1450px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hide-car-button {
    background-color: #f39c12;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.hide-car-button:hover {
    background-color: #e67e22;
}

.reception-header {
    border-bottom: 2px solid #3498db;
    padding-bottom: 12px;
    margin-bottom: 24px;
}

.reception-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
}

.reception-body {
    padding: 20px 0;
}

.process-button-reception {
    background-color: #3498db;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.process-button-reception:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
}
/* Nuevo estilo para el input de la tabla */
.input-field-table {
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
}
</style>
