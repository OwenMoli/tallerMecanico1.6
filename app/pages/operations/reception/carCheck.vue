<template>
  <UDashboardPanel class="overflow-auto">
    <UDashboardNavbar title="Recepción de Vehículos - Revisión">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #panel>
        <UButton icon="i-heroicons-wrench-screwdriver" label="Detalles del Vehículo" @click="toggleVehicleDetails" />
      </template>
    </UDashboardNavbar>

    <div class="progress-bar-container-compact">
      <div class="progress-step-compact" :class="{ 'active': currentStep >= 1 }">
        <div class="step-icon-compact">1</div>
        <div class="step-label-compact">Buscar Cliente</div>
      </div>
      <div class="progress-line" :class="{ 'active': currentStep >= 2 }"></div>

      <div class="progress-step-compact" :class="{ 'active': currentStep >= 2 }">
        <div class="step-icon-compact">2</div>
        <div class="step-label-compact">Buscar Vehículo</div>
      </div>
      <div class="progress-line" :class="{ 'active': currentStep >= 3 }"></div>

      <div class="progress-step-compact" :class="{ 'active': currentStep >= 3 }">
        <div class="step-icon-compact">3</div>
        <div class="step-label-compact">Recepción de Vehículo</div>
      </div>
      <div class="progress-line" :class="{ 'active': currentStep >= 4 }"></div>

      <div class="progress-step-compact" :class="{ 'active': currentStep >= 4 }">
        <div class="step-icon-compact">4</div>
        <div class="step-label-compact">Chequeo del Vehículo</div>
      </div>
    </div>
    <div class="p-4">
      <HeaderInfo v-if="receptionStore.client && receptionStore.car" :clientName="receptionStore.clientName"
        :clientPhone="receptionStore.clientPhone" :carName="receptionStore.car.modelo"
        :carDetails="receptionStore.car.marca + ' ' + receptionStore.car.year" />
    </div>

    <div class="flex items-center gap-4 p-4 bg-gray-100">
      <UInput v-model="searchTerm" icon="i-heroicons-magnifying-glass-20-solid" size="md" color="white"
        placeholder="Buscar..." class="flex-grow" />
      <UButton icon="i-heroicons-magnifying-glass-20-solid" color="cyan" label="Buscar" />
      <div class="flex items-center gap-2">
        <USelectMenu
  v-model="selectedCheck"
  :options="availableChecks"  placeholder="Selecciona un chequeo..."
  :disabled="receptionStore.isFetchingChecks"
  class="flex-1"
/>
        <UButton icon="i-heroicons-plus-circle-solid" label="Agregar" :disabled="!selectedCheck"
          @click="addSelectedCheck" />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-4">
      <Diagnostico v-for="categoria in filteredCategorias" :key="categoria.id" :categoria-nombre="categoria.nombre"
        :estado="categoria.estado" @icon-selected="(iconName) => handleIconSelection(iconName, categoria.nombre)"
        @remove-category="removeCategory" />
    </div>

    <div class="fixed bottom-6 right-6 flex gap-3 z-50">
      <DxButton text="Anterior" type="normal" stylingMode="contained"
        class="rounded-full shadow-lg hover:bg-gray-300 transition-colors" @click="goPrevious" />
      <DxButton text="Siguiente" type="success" stylingMode="contained"
        class="rounded-full shadow-lg hover:bg-cyan-600 transition-colors" @click="goNext" />
    </div>
  </UDashboardPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReceptionStore } from '~/store/reception';
import Diagnostico from '~/components/revision/diagnostico.vue';
import HeaderInfo from '~/components/headerInfo.vue';
import { DxButton } from 'devextreme-vue/button';

const router = useRouter();
const receptionStore = useReceptionStore();

const currentStep = ref(4);


const localChecks = ref([
  'Revisión de luces',
  'Revisión de frenos',
  'Nivel de aceite',
  'Nivel de refrigerante',
  'Estado de llantas',
  'Limpiaparabrisas'
]);

onMounted(async () => {
  if (!receptionStore.client || !receptionStore.car) {
    router.push('/operations/reception/searchClient');
  }
  await receptionStore.fetchCommonChecks();
});

const selectedCheck = ref(null);

const availableChecks = computed(() => {
  const addedNames = receptionStore.checklist.map(item => item.nombre);
  // Filter the localChecks array to remove already added items.
  const filtered = localChecks.value.filter(check => !addedNames.includes(check));
  // Map the filtered strings into objects with 'label' and 'value' properties.
  return filtered.map(check => ({
    label: check,
    value: check
  }));
});

const searchTerm = ref('');

const filteredCategorias = computed(() => {
  const q = searchTerm.value.toLowerCase().trim();
  return q ? receptionStore.checklist.filter((c) => c.nombre.toLowerCase().includes(q)) : receptionStore.checklist;
});

function handleIconSelection(value, categoriaNombre) {
  receptionStore.updateChecklistStatus(categoriaNombre, value);
}

// En tu <script setup>

function addSelectedCheck() {
  if (selectedCheck.value) {
    // Aquí es donde creas el nuevo objeto de chequeo
    // Le asignas un ID temporal, el nombre seleccionado y un estado inicial (ej. 'pendiente' o 'no-chequeado').
    const newChecklistItem = {
      id: Date.now(), // Usar un ID único temporal
      nombre: selectedCheck.value,
      estado: 'pending', // O el estado inicial que desees
    };

    receptionStore.addChecklistCategory(newChecklistItem);
    selectedCheck.value = null;
  }
}

function removeCategory(categoriaNombre) {
  receptionStore.removeChecklistCategory(categoriaNombre);
}

function toggleVehicleDetails() { }

const goPrevious = () => {
  router.push('/operations/reception/vehicleReception');
};

const goNext = () => {
  router.push('/operations/reception/carDetails');
};
</script>

<style scoped>
/* ... Estilos sin cambios ... */
.progress-bar-container-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.progress-step-compact {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  transition: color 0.3s;
  text-align: left;
}

.progress-step-compact.active {
  color: #1f2937;
  font-weight: bold;
}

.step-icon-compact {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1d5db;
  color: #4b5563;
  border-radius: 9999px;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.progress-step-compact.active .step-icon-compact {
  background-color: #2563eb;
  color: white;
}

.progress-line {
  height: 2px;
  width: 4rem;
  background-color: #d1d5db;
  transition: background-color 0.3s;
}

.progress-line.active {
  background-color: #2563eb;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  transition: color 0.3s;
  text-align: center;
}

.progress-step.active {
  color: #1f2937;
  font-weight: bold;
}

.step-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d1d5db;
  color: #4b5563;
  border-radius: 9999px;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.progress-step.active .step-icon {
  background-color: #2563eb;
  color: white;
}

.progress-line {
  height: 2px;
  width: 4rem;
  background-color: #d1d5db;
  transition: background-color 0.3s;
}

.progress-line.active {
  background-color: #2563eb;
}
</style>
