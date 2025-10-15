<template>
  <div>
    <div class="reception-details-container" id="reception-details-section">
      <div class="flex justify-end mb-4">
        <button @click="handleCancel" class="hide-car-button">Seleccionar otro coche</button>
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
          <QuotationHeader :client="client" :selected-car="selectedCar" />

          <QuotationItemsTable
            :jobs="selectedJobsDetails"
            @update-quantity="updateJobQuantity"
            @update-service-cost="updateJobServiceCost"
            @remove-job="removeJob"
          />

          <QuotationTotals :summary="quotationPreviewData" />

          <QuotationActions
            v-model:comments="comments"
            @finalize="finalizeQuotation"
            @cancel="handleCancel"
          />
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

      <DxPopup :visible="isProductFormModalOpen" @update:visible="isProductFormModalOpen = $event" title="Registrar/Editar Producto" :width="1200" height="80vh">
        <div class="p-4">
          <ProductForm :initialData="currentProductRecord" :isEditing="isEditingProduct" @save-success="handleProductFormSaved" />
        </div>
      </DxPopup>

      <DxPopup :visible="isFinalizeModalOpen" @update:visible="isFinalizeModalOpen = $event" title="Confirmar Cotización" :width="400" height="auto">
        <div class="p-4 text-center">
          <p class="mb-4 text-lg">¿Está seguro de que desea <strong>Finalizar y Guardar</strong> esta Cotización?</p>
          <div class="flex justify-end gap-3 mt-4">
            <button @click="isFinalizeModalOpen = false" class="hide-car-button bg-gray-400 hover:bg-gray-500">Cancelar</button>
            <button @click="onConfirmQuotation" class="process-button-reception bg-blue-600 hover:bg-blue-700">Confirmar</button>
          </div>
        </div>
      </DxPopup>

      <DxPopup :visible="isErrorModalOpen" @update:visible="isErrorModalOpen = $event" title="Error de Cotización" :width="400" height="auto">
        <div class="p-4 text-center">
          <p class="mb-4 text-lg text-red-600">No se puede finalizar la cotización.</p>
          <p>Por favor, <strong>añada al menos un servicio o producto</strong> antes de continuar.</p>
          <div class="flex justify-end mt-4">
            <button @click="isErrorModalOpen = false" class="process-button-reception bg-red-600 hover:bg-red-700">Entendido</button>
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
import { useQuotationStore } from '~/store/quotation';

// Importa los nuevos componentes
import QuotationHeader from '~/components/cotizationReception/QuotationHeader.vue';
import QuotationItemsTable from '~/components/cotizationReception/QuotationItemsTable.vue';
import QuotationTotals from '~/components/cotizationReception/QuotationTotals.vue';
import QuotationActions from '~/components/cotizationReception/QuotationActions.vue';

// --- El resto de tu script no cambia en absoluto ---

const props = defineProps({
  selectedCar: { type: Object, required: true },
  client: { type: Object, required: true },
});

const emit = defineEmits(['hide-details']);
const router = useRouter();
const jobSelectionRef = ref(null);
const quotationStore = useQuotationStore();

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
  finalizeQuotation,
  onConfirmQuotation,
  openProductFormModal,
  updateJobServiceCost, // Pasamos esta también
} = useQuotationLogic(props, router);

onMounted(async () => {
  await productStore.loadAllProducts();
});

function updateJobQuantity(index, value) {
  const parsedValue = parseFloat(value);
  if (!isNaN(parsedValue) && parsedValue >= 1) {
    selectedJobsDetails.value[index].quantity = parsedValue;
  } else if (value === '' || isNaN(parsedValue) || parsedValue < 1) {
    selectedJobsDetails.value[index].quantity = 1;
  }
}

function handleJobAdded(jobDetails) {
  addJob(jobDetails);
}

function handleCancel() {
  quotationStore.resetSelectedQuotation();
  emit('hide-details');
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
/* Tus estilos se mantienen aquí sin cambios */
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
.input-field-table {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
}
</style>
