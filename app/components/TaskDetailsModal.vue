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
          Tareas Asignadas
        </h2>
        <div class="space-y-6">
          <div class="info-card">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Mecánico: {{ mechanicName }}
            </h3>
            <ul v-if="tasks.length > 0" class="mt-4 space-y-2">
              <li v-for="task in tasks" :key="task.id" class="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-700">Placa: <span class="font-normal">{{ task.carPlate }}</span></p>
                  <p class="font-medium text-gray-700">Cliente: <span class="font-normal">{{ task.clientName }}</span></p>
                  <p class="font-medium text-gray-700">Fecha: <span class="font-normal">{{ task.receptionDate }}</span></p>
                </div>
                <UButton
                  icon="i-heroicons-eye-20-solid"
                  variant="ghost"
                  aria-label="Ver documento"
                  @click="previewDocument(task)"
                />
              </li>
            </ul>
            <div v-else class="mt-4 text-center text-gray-500">
              <p>No tiene tareas asignadas en este momento.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DxPopup>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import DxButton from 'devextreme-vue/button';
import { UButton } from '#components';

// Agregando la propiedad `pdfBase64` al tipo de datos de la tarea
interface Task {
  id: number;
  clientName: string;
  carPlate: string;
  receptionDate: string;
  pdfBase64?: string; // Hacemos esta propiedad opcional por seguridad
}

const props = defineProps({
  open: Boolean,
  tasks: {
    type: Array as () => Task[],
    default: () => [],
  },
  mechanicName: {
    type: String,
    default: 'Mecánico',
  },
});

const emit = defineEmits(['update:open']);

const title = 'Detalles de Tareas';
const openRef = toRefs(props).open;

const handleClose = () => {
  emit('update:open', false);
};

// Se copia la misma lógica de base64ToBlob y la función de vista previa
const base64ToBlob = (base64: string, mimeType: string): Blob | null => {
  try {
    const base64Data = base64.split(',')[1];
    if (!base64Data) {
      console.error('La cadena Base64 no tiene el formato esperado.');
      return null;
    }
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Solución del error: Uso del tipo correcto 'Uint8Array'
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Error al decodificar la cadena Base64:', error);
    return null;
  }
};

const previewDocument = (task: Task) => {
  if (task.pdfBase64) {
    const pdfBlob = base64ToBlob(task.pdfBase64, 'application/pdf');
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');

      // Limpiar la URL del objeto después de un breve tiempo
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      console.log(`Mostrando vista previa para la recepción #${task.id}`);
    } else {
      alert('Error al visualizar el archivo. El formato de datos no es válido.');
    }
  } else {
    alert('No se encontró un archivo de autorización para esta recepción.');
  }
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