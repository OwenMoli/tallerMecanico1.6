<template>
  <DxPopup
    :title="title"
    :visible="openRef"
    :show-close-button="true"
    :width="700"
    :height="500"
    @hiding="handleClose"
    role="dialog"
    aria-labelledby="popupTitle"
  >
    <template #content>
      <div class="modal-content-details-wrapper p-6 bg-gray-50 dark:bg-gray-900">
        <h2 id="popupTitle" class="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Detalles del Cliente
        </h2>

        <div v-if="clientData" class="space-y-6">

          <div v-if="clientType === 'natural'" class="info-card">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Información Personal
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-user"></i> Nombre</span>
                <span class="detail-value">{{ clientData.nombre ?? 'N/A' }} {{ clientData.apellido ?? '' }}</span>
              </div>
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-doc"></i> Tipo de Documento</span>
                <span class="detail-value">{{ clientData.tipoDocumento ?? 'N/A' }}</span>
              </div>
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-card"></i> No. Identificación</span>
                <span class="detail-value">{{ clientData.numeroIdentificacion ?? 'N/A' }}</span>
              </div>
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-money"></i> RTN</span>
                <span class="detail-value">{{ clientData.rtn ?? 'N/A' }}</span>
              </div>
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-tel"></i> Teléfono</span>
                <span class="detail-value">{{ clientData.telefono ?? 'N/A' }}</span>
              </div>
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-email"></i> Correo</span>
                <span class="detail-value">{{ clientData.correo ?? 'N/A' }}</span>
              </div>
              <div class="detail-item-container col-span-1 md:col-span-2 lg:col-span-3">
                <span class="detail-label"><i class="dx-icon-map"></i> Dirección</span>
                <span class="detail-value">{{ clientData.direccion ?? 'N/A' }}</span>
              </div>
              <div class="detail-item-container">
                <span class="detail-label"><i class="dx-icon-gender"></i> Sexo</span>
                <span class="detail-value">{{ clientData.sexo ?? 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div v-if="clientType === 'juridico'" class="space-y-6">
            <div class="info-card">
              <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Datos de la Empresa
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-preferences"></i> Nombre de la Empresa</span>
                  <span class="detail-value">{{ clientData.empresaNombre ?? 'N/A' }}</span>
                </div>
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-tags"></i> Rubro</span>
                  <span class="detail-value">{{ clientData.empresaRubro ?? 'N/A' }}</span>
                </div>
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-keypad"></i> RTN</span>
                  <span class="detail-value">{{ clientData.empresaRtn ?? 'N/A' }}</span>
                </div>
                <div class="detail-item-container sm:col-span-2">
                  <span class="detail-label"><i class="dx-icon-home"></i> Dirección</span>
                  <span class="detail-value">{{ clientData.empresaDireccion ?? 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Datos del Contacto
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-user"></i> Nombre del Contacto</span>
                  <span class="detail-value">{{ clientData.contactoNombre ?? 'N/A' }} {{ clientData.contactoApellido ?? '' }}</span>
                </div>
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-pin"></i> Cargo</span>
                  <span class="detail-value">{{ clientData.contactoCargo ?? 'N/A' }}</span>
                </div>
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-tel"></i> Teléfono</span>
                  <span class="detail-value">{{ clientData.contactoTelefono ?? 'N/A' }}</span>
                </div>
                <div class="detail-item-container">
                  <span class="detail-label"><i class="dx-icon-email"></i> Correo</span>
                  <span class="detail-value">{{ clientData.contactoCorreo ?? 'N/A' }}</span>
                </div>
                <div class="detail-item-container sm:col-span-2">
                  <span class="detail-label"><i class="dx-icon-map"></i> Dirección del Contacto</span>
                  <span class="detail-value">{{ clientData.contactoDireccion ?? 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="text-center text-gray-500 py-10">
          <p>No se encontraron detalles para este cliente.</p>
        </div>

        <div class="flex justify-end mt-8">
          <DxButton text="Cerrar" type="normal" @click="handleClose" class="px-6 py-2" />
        </div>
      </div>
    </template>
  </DxPopup>
</template>

<script setup>
import { toRefs } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import DxButton from 'devextreme-vue/button';

const props = defineProps({
  open: Boolean,
  clientData: Object,
  clientType: String,
});

const emit = defineEmits(['update:open']);

const title = 'Detalles del Cliente';
const openRef = toRefs(props).open;

const handleClose = () => {
  emit('update:open', false);
};
</script>

<style scoped>
.modal-content-details-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.info-card {
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.dark .info-card {
  background-color: #1f2937;
  border-color: #374151;
}

.detail-item-container {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.dark .detail-label {
  color: #9ca3af;
}

.detail-label i {
  margin-right: 0.5rem;
  color: #9ca3af;
}

.detail-value {
  color: #111827;
  font-size: 1rem;
  font-weight: 500;
}

.dark .detail-value {
  color: #e5e7eb;
}

.grid {
  display: grid;
}


</style>
