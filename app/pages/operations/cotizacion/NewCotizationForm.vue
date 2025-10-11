<template>
    <div class="min-h-screen w-full bg-gray-100 flex justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">

        <div class="w-full max-w-7xl" id="reception-details-section">

            <div class="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-200">

                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-extrabold text-blue-700">Cotización Manual</h1>
                    <button @click="router.back()" class="hide-car-button bg-gray-600 hover:bg-gray-700">
                        Volver a Operaciones
                    </button>
                </div>

                <div class="reception-header">
                    <h2 class="reception-title">Detalles de la Orden</h2>
                </div>

                <div class="reception-body">

                    <h3 class="font-semibold text-xl mb-4 text-gray-800">Datos Requeridos</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                        <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                            <h4 class="font-bold text-lg mb-3 text-gray-700 border-b pb-2">Datos del Cliente</h4>
                            <div class="space-y-4">
                                <div>
                                    <label for="client-name" class="block text-sm font-medium text-gray-700">Nombre/Empresa *</label>
                                    <input type="text" id="client-name" v-model="manualClient.nombre" required
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="client-phone" class="block text-sm font-medium text-gray-700">Teléfono *</label>
                                    <input type="tel" id="client-phone" v-model="manualClient.telefono" required
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="client-email" class="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="client-email" v-model="manualClient.correo"
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="client-rtn" class="block text-sm font-medium text-gray-700">RTN/ID</label>
                                    <input type="text" id="client-rtn" v-model="manualClient.rtn"
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="client-address" class="block text-sm font-medium text-gray-700">Dirección</label>
                                    <input type="text" id="client-address" v-model="manualClient.direccion"
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                            </div>
                        </div>

                        <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                            <h4 class="font-bold text-lg mb-3 text-gray-700 border-b pb-2">Datos del Vehículo</h4>
                            <div class="space-y-4">
                                <div>
                                    <label for="car-make" class="block text-sm font-medium text-gray-700">Marca *</label>
                                    <input type="text" id="car-make" v-model="manualCar.marca" required
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="car-model" class="block text-sm font-medium text-gray-700">Modelo *</label>
                                    <input type="text" id="car-model" v-model="manualCar.modelo" required
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="car-plate" class="block text-sm font-medium text-gray-700">Placa *</label>
                                    <input type="text" id="car-plate" v-model="manualCar.placa" required
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="car-mileage" class="block text-sm font-medium text-gray-700">Odómetro (Km)</label>
                                    <input type="number" id="car-mileage" v-model.number="manualCar.kilometraje"
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="car-vin" class="block text-sm font-medium text-gray-700">VIN</label>
                                    <input type="text" id="car-vin" v-model="manualCar.vin"
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                            </div>
                        </div>

                        <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200 md:col-span-2 lg:col-span-1">
                            <h4 class="font-bold text-lg mb-3 text-gray-700 border-b pb-2">Datos de la Orden</h4>
                            <div class="space-y-4">
                                <div>
                                    <label for="order-asesor" class="block text-sm font-medium text-gray-700">Asesor *</label>
                                    <input type="text" id="order-asesor" v-model="manualOrderDetails.asesor" required
                                        class="mt-1 block w-full input-field-reception border-gray-300">
                                </div>
                                <div>
                                    <label for="order-validity" class="block text-sm font-medium text-gray-700">Validez (Días) *</label>
                                    <input type="number" id="order-validity" v-model.number="manualOrderDetails.vigenciaDias" required
                                        class="mt-1 block w-full input-field-reception border-gray-300" min="1">
                                </div>
                                <div>
                                    <label for="order-date" class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                                    <input type="date" id="order-date" v-model="manualOrderDetails.fechaCreacion" disabled
                                        class="mt-1 block w-full input-field-reception border-gray-300 bg-gray-100 cursor-not-allowed">
                                </div>
                            </div>
                        </div>
                    </div>

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
                                <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Cliente (Manual)</h4>
                                <div class="space-y-2 text-sm">
                                    <p><strong>Nombre:</strong> {{ manualClient.nombre || 'N/A' }}</p>
                                    <p><strong>Teléfono:</strong> {{ manualClient.telefono || 'N/A' }}</p>
                                    <p v-if="manualClient.correo"><strong>Email:</strong> {{ manualClient.correo || 'N/A' }}</p>
                                    <p v-if="manualClient.direccion"><strong>Dirección:</strong> {{ manualClient.direccion || 'N/A' }}</p>
                                </div>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Vehículo (Manual)</h4>
                                <div class="space-y-2 text-sm">
                                    <p><strong>Marca:</strong> {{ manualCar.marca || 'N/A' }}</p>
                                    <p><strong>Modelo:</strong> {{ manualCar.modelo || 'N/A' }}</p>
                                    <p><strong>Placa:</strong> {{ manualCar.placa || 'N/A' }}</p>
                                </div>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 class="font-bold text-md mb-2 text-gray-800">Detalles de la Orden</h4>
                                <div class="space-y-2 text-sm">
                                    <p><strong>Asesor:</strong> {{ manualOrderDetails.asesor || 'N/A' }}</p>
                                    <p><strong>Vigencia:</strong> {{ manualOrderDetails.vigenciaDias || 0 }} días</p>
                                    <p><strong>Fecha de Creación:</strong> {{ formatDate(new Date(manualOrderDetails.fechaCreacion || new Date())) }}</p>
                                    <p><strong>Odómetro:</strong> {{ manualCar.kilometraje || 0 }} Km</p>
                                    <p><strong>VIN:</strong> {{ manualCar.vin || 'No proporcionado' }}</p>
                                </div>
                            </div>
                        </div>

                        <h3 class="font-semibold text-lg mb-4">Items de Cotización</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 mb-6 border border-gray-200 rounded-lg">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Precio</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Subtotal</th>
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
                                            <template v-if="job.precios && job.precios.editarPrecio">
                                                <div class="flex items-center gap-1">
                                                    <input
                                                            type="text"
                                                            :value="job.serviceCost"
                                                            @input="handleServiceCostUpdate(index, $event.target.value)"
                                                            class="input-field-table w-28 p-1 border border-blue-400 rounded-md text-sm text-center font-semibold focus:ring-blue-500 focus:border-blue-500"
                                                            inputmode="decimal"
                                                    />
                                                    <i class="dx-icon-edit-button text-red-500 text-sm"></i>
                                                </div>
                                            </template>
                                            <template v-else>
                                                {{ formatCurrency(job.serviceCost) }}
                                            </template>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                                            {{ formatCurrency(getJobSubtotal(job)) }}
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
                                            {{ formatCurrency(quotationPreviewData.subtotal) }}
                                        </td>
                                        <td class="px-6 py-3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div class="flex justify-end">
                            <div class="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg border border-gray-200 shadow-lg">
                                <h3 class="font-bold text-xl mb-3 text-gray-800">Resumen de Totales</h3>

                                <div class="space-y-3 text-sm text-gray-700">
                                    <div class="flex justify-between font-bold text-lg text-green-700 border-t pt-2">
                                        <span>SUBTOTAL (Neto de Ítems):</span>
                                        <span>{{ formatCurrency(quotationPreviewData.subtotal) }}</span>
                                    </div>
                                    <div class="flex justify-between text-base">
                                        <span>Impuesto ({{ quotationPreviewData.taxRateDisplay }}%):</span>
                                        <span class="font-semibold text-red-600">{{ formatCurrency(quotationPreviewData.tax) }}</span>
                                    </div>
                                    <div class="flex justify-between font-extrabold text-xl text-blue-700 border-t border-gray-300 pt-3">
                                        <span>TOTAL A PAGAR:</span>
                                        <span>{{ formatCurrency(quotationPreviewData.total) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row justify-between items-end md:items-center gap-3 mt-8 pt-4 border-t border-gray-300">
                            <textarea
                                v-model="comments"
                                placeholder="Notas o Comentarios Adicionales de la Cotización..."
                                class="flex-grow p-3 border rounded-lg resize-none h-24 focus:ring-blue-500 focus:border-blue-500 w-full md:w-2/3"
                            ></textarea>

                            <div class="flex flex-col gap-3 w-full md:w-auto">
                                <button @click="validateAndFinalize" class="process-button-reception text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 w-full"
                                        :disabled="!isFormValid">
                                    {{ submitButtonText }}
                                </button>
                                <button @click="router.back()" class="hide-car-button bg-gray-400 hover:bg-gray-500 text-lg px-8 py-3 w-full">
                                    Cancelar y Volver
                                </button>
                            </div>
                        </div>

                    </div>
                    <div v-else class="text-center text-gray-500 p-10 bg-gray-50 rounded-lg mt-8">
                        <p>Agregue un trabajo para ver la vista previa de la cotización.</p>
                        <div class="flex justify-center gap-3 mt-8 pt-4 border-t border-gray-300">
                            <button disabled class="process-button-reception text-lg px-8 py-3 bg-blue-400 cursor-not-allowed">
                                {{ submitButtonText }}
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
                        <p>Por favor, **añada al menos un servicio o producto**, **complete los datos obligatorios de Cliente y Vehículo**, y **complete los datos obligatorios de la Orden**.</p>
                        <div class="flex justify-end mt-4">
                            <button @click="isErrorModalOpen = false" class="process-button-reception bg-red-600 hover:bg-red-700">
                                Entendido
                            </button>
                        </div>
                    </div>
                </DxPopup>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { DxPopup } from 'devextreme-vue/popup';
import ProductForm from '~/pages/settings/inventory/products.vue';
import { useQuotationLogic } from '~/composables/useQuotationLogic';
import JobSelectionArea from '~/components/cotizacion/productSearch.vue';

const router = useRouter();
const jobSelectionRef = ref(null);

const manualClient = ref({
    nombre: '',
    telefono: '',
    correo: '',
    rtn: '',
    direccion: '',
});

const manualCar = ref({
    marca: '',
    modelo: '',
    placa: '',
    kilometraje: 0,
    vin: '',
});

const manualOrderDetails = ref({
    asesor: '',
    fechaCreacion: new Date().toISOString().split('T')[0],
    vigenciaDias: 30,
});

const {
    selectedJobsDetails,
    comments,
    isProductFormModalOpen,
    isEditingProduct,
    currentProductRecord,
    isFinalizeModalOpen,
    isErrorModalOpen,
    availableJobsData,
    quotationPreviewData,
    productStore,
    getJobSubtotal,
    getPriceLabel,
    addJob,
    removeJob,
    onConfirmQuotation,
    openProductFormModal,
    updateJobServiceCost,
    updateJobQuantity,
    isEditing,
} = useQuotationLogic(
    {},
    router,
    manualClient,
    manualCar,
    manualOrderDetails
);

const submitButtonText = computed(() => {
    return isEditing.value ? 'Guardar Cambios' : 'Finalizar Cotización';
});

const formatCurrency = (value) => {
    const numericValue = parseFloat(value || 0);
    return `L. ${numericValue.toLocaleString('es-HN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const isFormValid = computed(() => {
    const clientValid = manualClient.value.nombre && manualClient.value.telefono;
    const carValid = manualCar.value.marca && manualCar.value.modelo && manualCar.value.placa;
    const orderValid = manualOrderDetails.value.asesor && manualOrderDetails.value.vigenciaDias > 0;
    const jobsValid = selectedJobsDetails.value.length > 0;
    return clientValid && carValid && orderValid && jobsValid;
});

function validateAndFinalize() {
    if (!isFormValid.value) {
        isErrorModalOpen.value = true;
        return;
    }
    isFinalizeModalOpen.value = true;
}

function handleServiceCostUpdate(index, value) {
    const numericValue = value.replace(/[^\d.]/g, '');
    let parsedValue = parseFloat(numericValue);
    if (isNaN(parsedValue)) {
        parsedValue = 0;
    }
    updateJobServiceCost(index, parsedValue);
}


onMounted(async () => {
    await productStore.loadAllProducts();
});

function formatDate(date) {
    if (!date || isNaN(date.getTime())) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function handleJobAdded(jobDetails) {
    addJob(jobDetails);
}

async function handleProductFormSaved(savedProduct) {
    isProductFormModalOpen.value = false;
    await productStore.loadAllProducts();
    await nextTick();

    if (jobSelectionRef.value) {
        const newJob = availableJobsData.value.find(j => j.id === savedProduct.id);
        if (newJob) {
            jobSelectionRef.value.selectJobOption(newJob);
        }
    }
}
</script>

<style scoped>
/* Estilos existentes (mantener) */
.reception-details-container {
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

/* Estilos de input-field-reception necesarios para los formularios */
.input-field-reception {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}
</style>
