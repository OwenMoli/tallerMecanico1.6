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
                    <QuotationFormHeader
                        v-model:client="manualClient"
                        v-model:car="manualCar"
                        v-model:orderDetails="manualOrderDetails"
                    />

                    <JobSelectionArea
                        ref="jobSelectionRef"
                        :available-jobs="availableJobsData"
                        @add-job="handleJobAdded"
                        @open-product-form-modal="openProductFormModal"
                    />

                    <QuotationPreview
                        v-if="selectedJobsDetails.length > 0"
                        :client="manualClient"
                        :car="manualCar"
                        :order-details="manualOrderDetails"
                        :selected-jobs="selectedJobsDetails"
                        :quotation-totals="quotationPreviewData"
                        :comments="comments"
                        :format-currency="formatCurrency"
                        :format-date="formatDate"
                        :get-price-label="getPriceLabel"
                        :get-job-subtotal="getJobSubtotal"
                        @update-job-quantity="updateJobQuantity"
                        @update-job-service-cost="handleServiceCostUpdate"
                        @remove-job="removeJob"
                        @update:comments="comments = $event"
                    >
                        <template #actions>
                            <button @click="validateAndFinalize" class="process-button-reception text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 w-full" :disabled="!isFormValid">
                                {{ submitButtonText }}
                            </button>
                            <button @click="router.back()" class="hide-car-button bg-gray-400 hover:bg-gray-500 text-lg px-8 py-3 w-full">
                                Cancelar y Volver
                            </button>
                        </template>
                    </QuotationPreview>

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
                    height="auto"
                    :show-title="true"
                    :drag-enabled="false"
                    :close-on-outside-click="true"
                >
                    <div class="p-4 text-center">
                        <p class="mb-4 text-lg">¿Está seguro de que desea <strong>Finalizar y Guardar</strong> esta Cotización?</p>
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
                    height="auto"
                    :show-title="true"
                    :drag-enabled="false"
                    :close-on-outside-click="true"
                >
                    <div class="p-4 text-center">
                        <p class="mb-4 text-lg text-red-600">No se puede finalizar la cotización.</p>
                        <p>Por favor, <strong>añada al menos un servicio o producto</strong>, y <strong>complete los datos obligatorios</strong> de Cliente, Vehículo y Orden.</p>
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
import QuotationFormHeader from '~/components/cotizacion/QuotationFormHeader.vue';
import QuotationPreview from '~/components/cotizacion/QuotationPreview.vue';

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
.input-field-table {
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
}

.input-field-reception {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}
</style>
