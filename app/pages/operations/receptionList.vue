<template>
  <UDashboardPanel class="overflow-auto">
    <UDashboardNavbar title="Listado de Recepciones">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="flex h-[calc(100vh-8rem)]">
      <div class="w-1/5 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-4">
        <h3 class="text-lg font-semibold text-gray-700">Mecánicos Disponibles</h3>
        <div v-for="(mechanicsByRank, rank) in groupedMechanics" :key="rank">
          <h4 class="text-md font-semibold text-gray-600 mb-2">{{ `Rango ${rank}` }}</h4>
          <div v-for="mechanic in mechanicsByRank" :key="mechanic.id"
            class="mechanic-card bg-white p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing w-full text-center mb-2"
            draggable="true" @dragstart="handleDragStart($event, mechanic.id)">
            <p class="font-medium text-gray-800">{{ mechanic.name }}</p>
            <p class="text-sm mt-1 text-blue-600 hover:underline cursor-pointer" @click="handleTaskClick(mechanic.id)">
              Tareas Asignadas: {{ mechanicTaskCounts[mechanic.id] || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex-1 p-4">
        <DxDataGrid
          ref="dataGridRef"
          :data-source="receptions"
          :show-borders="true"
          :row-alternation-enabled="true"
          :show-row-lines="true"
          :allow-column-resizing="true"
          :column-auto-width="true"
          :no-data-text="isLoading ? 'Cargando recepciones...' : 'No hay recepciones registradas.'"
          @row-updated="onRowUpdated"
        >
          <DxColumn data-field="id" caption="ID" :allow-editing="false" />

          <DxColumn
            data-field="receptionDate"
            caption="Fecha"
            :sort-index="0"
            sort-order="desc"
            :allow-editing="false"
          />
          <DxColumn data-field="clientName" caption="Cliente" :allow-editing="false" />
          <DxColumn data-field="carPlate" caption="Placa" :allow-editing="false" />
          <DxColumn data-field="carBrand" caption="Marca" :allow-editing="false" />

          <DxColumn
            data-field="assignedMechanic"
            caption="Mecánico Asignado"
            :allow-sorting="false"
            :allow-filtering="false"
            cell-template="mechanic-cell"
            :allow-editing="false"
          />

          <DxColumn
            data-field="cone"
            caption="Cono de Asignación"
          >
            <DxLookup
              :data-source="cones"
              value-expr="id"
              display-expr="name"
            />
          </DxColumn>

          <DxColumn
            caption="Acciones"
            cell-template="actions-cell"
            :allow-sorting="false"
            :allow-filtering="false"
          />

          <template #mechanic-cell="{ data }">
            <div
              class="mechanic-drop-area h-full w-full flex items-center justify-center p-2 rounded"
              @dragover.prevent
              @drop="handleDrop($event, data.data.id)"
            >
              {{ getMechanicNameById(data.data.assignedMechanic) || 'Arrastra un mecánico' }}
            </div>
          </template>

          <template #actions-cell="{ data }">
            <div class="flex space-x-2 justify-center items-center">
              <UButton
                icon="i-heroicons-document-arrow-down-20-solid"
                variant="ghost"
                @click="downloadDocument(data.data.id)"
              />
            </div>
          </template>

          <DxFilterRow :visible="true" />
          <DxPaging :page-size="10" />
          <DxPager
            :visible="true"
            :allowed-page-sizes="[5, 10, 20]"
            :show-page-size-selector="true"
            :show-info="true"
          />

          <DxEditing
            :allow-updating="true"
            mode="row"
            :texts="{ editRow: 'Asignar Cono' }"
          />
        </DxDataGrid>
      </div>
    </div>

    <TaskDetailsModal
      v-if="showTaskModal"
      v-model:open="showTaskModal"
      :tasks="tasksForSelectedMechanic"
      :mechanic-name="getMechanicNameById(selectedMechanicId) ?? 'Mecánico'"
    />
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useReceptionStore } from '~/store/reception';
import { UDashboardPanel, UDashboardNavbar, UDashboardSidebarCollapse, UButton } from '#components';
import {
  DxDataGrid,
  DxColumn,
  DxFilterRow,
  DxPaging,
  DxPager,
  DxEditing,
  DxLookup,
} from 'devextreme-vue/data-grid';
import TaskDetailsModal from '~/components/TaskDetailsModal.vue';

// Tipos de datos
interface Reception {
  id: number;
  clientName: string;
  carPlate: string;
  carBrand: string;
  receptionDate: string;
  assignedMechanic: string | null;
  pdfBase64: string;
  cone: number | null;
}

interface Mechanic {
  id: string;
  name: string;
  rank: 'A' | 'B' | 'C';
}

const dataGridRef = ref(null);
const receptionStore = useReceptionStore();
const receptions = ref<Reception[]>([]);
const isLoading = ref(false);

const mechanics = ref<Mechanic[]>([
  { id: 'm-1', name: 'Juan Pérez', rank: 'A' },
  { id: 'm-2', name: 'María López', rank: 'A' },
  { id: 'm-3', name: 'Carlos Ruiz', rank: 'B' },
  { id: 'm-4', name: 'Ana Mendoza', rank: 'B' },
  { id: 'm-5', name: 'Pedro García', rank: 'C' },
  { id: 'm-6', name: 'Sofia Torres', rank: 'C' },
]);

const cones = [
  { id: 1, name: 'Cono 1' },
  { id: 2, name: 'Cono 2' },
  { id: 3, name: 'Cono 3' },
  { id: 4, name: 'Cono 4' },
  { id: 5, name: 'Cono 5' },
];

const showTaskModal = ref(false);
const selectedMechanicId = ref<string | null>(null);

const groupedMechanics = computed(() => {
  const acc: Record<string, Mechanic[]> = {};
  mechanics.value.forEach(mechanic => {
    (acc[mechanic.rank as keyof typeof acc] = acc[mechanic.rank as keyof typeof acc] || []).push(mechanic);
  });
  return acc;
});

const mechanicTaskCounts = computed(() => {
  const counts: Record<string, number> = {};
  receptions.value.forEach(reception => {
    if (reception.assignedMechanic) {
      counts[reception.assignedMechanic] = (counts[reception.assignedMechanic] || 0) + 1;
    }
  });
  return counts;
});

const tasksForSelectedMechanic = computed(() => {
  if (!selectedMechanicId.value) return [];
  return receptions.value.filter(r => r.assignedMechanic === selectedMechanicId.value);
});

const handleTaskClick = (mechanicId: string) => {
  selectedMechanicId.value = mechanicId;
  showTaskModal.value = true;
};

const draggedMechanicId = ref<string | null>(null);

const handleDragStart = (event: DragEvent, mechanicId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', mechanicId);
    draggedMechanicId.value = mechanicId;
  }
};

const handleDrop = (event: DragEvent, receptionId: number) => {
  event.preventDefault();
  const mechanicId = event.dataTransfer?.getData('text/plain');
  if (mechanicId) {
    updateMechanicAssignment(receptionId, mechanicId);
  }
};

const getMechanicNameById = (mechanicId: string | null) => {
  const mechanic = mechanics.value.find(m => m.id === mechanicId);
  return mechanic ? mechanic.name : null;
};

const onRowUpdated = (e: any) => {
  const reception = receptions.value.find(r => r.id === e.key);
  if (reception) {
    Object.assign(reception, e.data);
    saveReceptionsToLocalStorage(receptions.value);
    console.log(`Recepción #${e.key} actualizada. Nuevo cono: ${e.data.cone}`);
  }
};

const saveReceptionsToLocalStorage = (receptionsToSave: Reception[]) => {
  localStorage.setItem('receptions', JSON.stringify(receptionsToSave));
};

const loadReceptionsFromLocalStorage = (): Reception[] => {
  const storedReceptions = localStorage.getItem('receptions');
  return storedReceptions ? JSON.parse(storedReceptions) : [];
};

const fetchReceptions = async () => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));

  let fetchedReceptions = loadReceptionsFromLocalStorage();
  let maxId = 0;
  if (fetchedReceptions.length > 0) {
    maxId = Math.max(...fetchedReceptions.map(r => r.id));
  } else {
    fetchedReceptions = [
      { id: 1, clientName: 'Luis Sánchez', carPlate: 'ABC-123', carBrand: 'Toyota', receptionDate: '28/08/2025', assignedMechanic: null, pdfBase64: '', cone: null },
      { id: 2, clientName: 'Empresa Innova', carPlate: 'XYZ-987', carBrand: 'Ford', receptionDate: '27/08/2025', assignedMechanic: null, pdfBase64: '', cone: null },
      { id: 3, clientName: 'Ana García', carPlate: 'PQR-456', carBrand: 'Honda', receptionDate: '26/08/2025', assignedMechanic: null, pdfBase64: '', cone: null },
      { id: 4, clientName: 'Luis Pérez', carPlate: 'ZYX-987', carBrand: 'Kia', receptionDate: '26/08/2025', assignedMechanic: null, pdfBase64: '', cone: null },
    ];
    maxId = 4;
  }

  if (receptionStore.lastCompletedReception) {
    const newId = maxId + 1;
    const newReception = {
      id: newId,
      clientName: receptionStore.lastCompletedReception.clientName,
      carPlate: receptionStore.lastCompletedReception.carPlate,
      carBrand: receptionStore.lastCompletedReception.carBrand,
      receptionDate: receptionStore.lastCompletedReception.receptionDate,
      assignedMechanic: receptionStore.lastCompletedReception.assignedMechanic,
      pdfBase64: receptionStore.lastCompletedReception.pdfBase64,
      cone: null
    };
    fetchedReceptions.unshift(newReception);

    receptionStore.setLastCompletedReception(null);
  }

  receptions.value = fetchedReceptions;
  saveReceptionsToLocalStorage(receptions.value);

  isLoading.value = false;
};

const updateMechanicAssignment = (receptionId: number, mechanicId: string) => {
  const reception = receptions.value.find(r => r.id === receptionId);
  if (reception) {
    reception.assignedMechanic = mechanicId;
    saveReceptionsToLocalStorage(receptions.value);
    console.log(`Asignando la recepción #${receptionId} al mecánico ${mechanicId}`);
  }
};

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
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Error al decodificar la cadena Base64:', error);
    return null;
  }
};

const downloadDocument = (receptionId: number) => {
  const reception = receptions.value.find(r => r.id === receptionId);
  if (reception && reception.pdfBase64) {
    const pdfBlob = base64ToBlob(reception.pdfBase64, 'application/pdf');
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      console.log(`Mostrando vista previa del documento para la recepción #${receptionId}`);
    } else {
      alert('Error al visualizar el archivo. El formato de datos no es válido.');
    }
  } else {
    alert('No se encontró un archivo de autorización para esta recepción.');
  }
};

onMounted(() => {
  fetchReceptions();
});
</script>

<style scoped>
.mechanic-card {
  transition: transform 0.2s;
}

.mechanic-card:active {
  transform: scale(1.05);
}

.mechanic-drop-area {
  background-color: transparent;
  transition: background-color 0.2s;
}

.mechanic-drop-area:hover {
  background-color: #e2e8f0;
}
</style>