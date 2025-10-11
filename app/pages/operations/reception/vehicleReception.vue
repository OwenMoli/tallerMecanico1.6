<template>
  <UDashboardPanel class="relative overflow-x-hidden min-h-screen">
    <UDashboardNavbar title="Recepción de Vehículos - Revisión">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #panel>
        <UButton icon="i-heroicons-wrench-screwdriver" label="Detalles del Vehículo" @click="toggleVehicleDetails" />
      </template>
    </UDashboardNavbar>

    <!-- Barra de progreso -->
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

    <div class="p-4" v-if="receptionStore.client && receptionStore.car">
      <ClientHeader v-if="receptionStore.client && receptionStore.car" :clientName="receptionStore.clientName || ''"
        :clientPhone="receptionStore.clientPhone || ''" :carName="receptionStore.car.modelo"
        :carDetails="receptionStore.car.marca + ' ' + receptionStore.car.year" />
    </div>

    <!-- Contenido principal -->
    <div
      class="flex flex-col items-center gap-4 p-4 max-h-screen overflow-y-auto lg:flex-row lg:items-start lg:pt-8 lg:pb-12">
      <!-- Columna izquierda -->
      <div class="flex flex-col items-center gap-4 w-full max-w-md mx-auto lg:max-w-[250px]">
        <CarCard v-if="receptionStore.car" :carName="receptionStore.car.modelo" :carImage="receptionStore.car.imageUrl"
          :carType="receptionStore.car.estilo" :carSubtitle="receptionStore.car.marca" />

        <div class="w-full max-w-md mt-4 lg:mt-0">
          <div class="space-y-2 flex flex-col items-center">
            <div>
              <label class="block mb-2 text-sm font-medium">Transmisión</label>
              <UInputMenu v-model="selectedTransmission" :items="transmissionTypes"
                placeholder="Selecciona el tipo de transmisión" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium">Tracción</label>
              <UInputMenu v-model="selectedTraction" :items="tractionTypes"
                placeholder="Selecciona el tipo de tracción" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium">Combustible</label>
              <UInputMenu v-model="selectedFuel" :items="fuelTypes" placeholder="Selecciona el tipo de combustible" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium">Año</label>
              <UInputMenu v-model="selectedYear" :items="years" />
            </div>
          </div>

          <div class="mt-4 flex flex-col items-center space-y-4">
            <div class="text-center">
              <h3 class="text-sm font-semibold mb-2">Color Primario</h3>
              <AddColor :initial-color="{ name: 'Primario', code: primaryColor }"
                @color-selected="handlePrimaryColor" />
            </div>

            <div class="text-center">
              <h3 class="text-sm font-semibold mb-2">Color Secundario</h3>
              <AddColor :initial-color="{ name: 'Secundario', code: secondaryColor }"
                @color-selected="handleSecondaryColor" />
            </div>
          </div>



        </div>

        <div class="flex gap-4 justify-center mt-4">
          <NuxtLink to="/operations/reception/carCheck">
            <UButton>Procesar</UButton>
          </NuxtLink>
          <UButton @click="toggleVehicleDetails" :disabled="!isExistingVehicle">Detalles</UButton>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="relative w-full mt-4 lg:flex-1 lg:mt-0">
        <div v-if="showVehicleDetails && receptionStore.car" class="absolute inset-0">
          <VehicleDetailsForm :car="receptionStore.car" />
        </div>
        <div v-else-if="!isExistingVehicle">
          <HorizontalMenu @select-car="handleCarSelection" />
        </div>
        <div v-else class="p-5 text-center"> </div>
      </div>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReceptionStore } from '~/store/reception';
import CarCard from '~/components/carGallery/carCard.vue';
import HorizontalMenu from '~/components/carGallery/horizontalMenu.vue';
import AddColor from '~/components/carGallery/addColor.vue';
import VehicleDetailsForm from '~/components/carGallery/detalles.vue';
import ClientHeader from '~/components/headerInfo.vue';
// Importa el tipo ReceptionCar desde el store si lo exportas, o desde el archivo de tipos
import type { ReceptionCar } from '~/types/reception';

interface SelectedCar {
  id: number;
  brandId: number;
  carName: string;
  brandName: string;
  carImage: string;
  carSubtitle: string;
  transmision: string;
  traccion: string;
  fuel: string;
}

const handlePrimaryColor = (color: { name: string; code: string }) => {
  primaryColor.value = color.code;
  primaryColorName.value = color.name; // <--- Sincroniza el ref local
  if (receptionStore.car) {
    receptionStore.car.colorPrimario = color.code;
    receptionStore.car.colorPrimarioNombre = color.name; // <--- Guarda el nombre en Pinia
  }
};

const handleSecondaryColor = (color: { name: string; code: string }) => {
  secondaryColor.value = color.code;
  secondaryColorName.value = color.name; // <--- Sincroniza el ref local
  if (receptionStore.car) {
    receptionStore.car.colorSecundario = color.code;
    receptionStore.car.colorSecundarioNombre = color.name; // <--- Guarda el nombre en Pinia
  }
};

const receptionStore = useReceptionStore();
const router = useRouter();
const isExistingVehicle = computed(() => !!receptionStore.car);

onMounted(() => {
  if (!receptionStore.client) {
    router.push('/operations/reception/clientSelect');
  }
});

const currentStep = ref(3);
watch(() => isExistingVehicle.value, (isExisting) => {
  currentStep.value = isExisting ? 3 : 2;
});

const currentYear = new Date().getFullYear();
const startYear = currentYear - 50;
const years = computed(() => Array.from({ length: currentYear - startYear + 1 }, (_, i) => (currentYear - i).toString()));

const fuelTypes = ref(['Gasolina', 'Diésel', 'Gas LP', 'Gas Natural', 'Eléctrico', 'Híbrido', 'Otro']);
const tractionTypes = ref(['Delantera (FWD)', 'Trasera (RWD)', 'Integral (AWD)', '4x4 (4WD)', 'Otro']);
const transmissionTypes = ref(['Manual', 'Automática', 'CVT (Transmisión Variable Continua)', 'Automatizada (ASG/DSG)', 'Otro']);

const selectedYear = ref(receptionStore.car?.year?.toString() || currentYear.toString());
const selectedFuel = ref(receptionStore.car?.combustible || '');
const selectedTraction = ref(receptionStore.car?.traccion || '');
const selectedTransmission = ref(receptionStore.car?.transmision || '');

const primaryColorName = ref(receptionStore.car?.colorPrimarioNombre || 'Blanco'); // Inicializa un valor por defecto
const secondaryColorName = ref(receptionStore.car?.colorSecundarioNombre || 'Negro'); // Inicializa un valor por defecto
const primaryColor = ref(receptionStore.car?.colorPrimario || '');
const secondaryColor = ref(receptionStore.car?.colorSecundario || '');

const showVehicleDetails = ref(isExistingVehicle.value);

const toggleVehicleDetails = () => {
  console.log('Toggle vehicle details', receptionStore.car);
  showVehicleDetails.value = !showVehicleDetails.value;
};

const primaryChipStyle = computed(() => ({ backgroundColor: primaryColor.value }));
const secondaryChipStyle = computed(() => ({ backgroundColor: secondaryColor.value }));

const handleCarSelection = (car: SelectedCar) => {
  const receptionCar: ReceptionCar = {
    id_cliente: receptionStore.client?.id ?? 0,
    placa: '',
    modelo: car.carName,
    marca: car.brandName,
    year: parseInt(selectedYear.value),
    estilo: car.carSubtitle,
    transmision: car.transmision,
    traccion: car.traccion,
    combustible: car.fuel,
    colorPrimario: primaryColor.value,
    colorPrimarioNombre: primaryColorName.value, // <--- ¡Añade esto!
    colorSecundario: secondaryColor.value,
    colorSecundarioNombre: secondaryColorName.value, // <--- ¡Añade esto!
    kilometraje: 0,
    porcentajeGasolina: 0,
    porcentajeTemperatura: 0,
    porcentajeAceite: 0,
    numeroChasis: '',
    numeroMotor: '',
    tipoAceite: '',
    marcaFiltroAceite: '',
    activoFlotilla: '',
    aseguradora: {
      nombre: '',
      contacto: '',
      poliza: '',
      nombreAsegurado: '',
      numeroAviso: '',
    },
    imageUrl: car.carImage,
  };
  receptionStore.setCar(receptionCar);
  showVehicleDetails.value = true;
};

// Se agregó una verificación `if (receptionStore.car)` para evitar errores al inicio
watch([selectedYear, selectedFuel, selectedTraction, selectedTransmission, primaryColor, secondaryColor], () => {
  if (receptionStore.car) {
    receptionStore.car.year = parseInt(selectedYear.value);
    receptionStore.car.combustible = selectedFuel.value;
    receptionStore.car.traccion = selectedTraction.value;
    receptionStore.car.transmision = selectedTransmission.value;
    receptionStore.car.colorPrimario = primaryColor.value;
    receptionStore.car.colorSecundario = secondaryColor.value;
  }
});

watch(() => receptionStore.car, (newCar) => {
  if (newCar) {
    selectedYear.value = newCar.year?.toString() || '';
    selectedFuel.value = newCar.combustible || '';
    selectedTraction.value = newCar.traccion || '';
    selectedTransmission.value = newCar.transmision || '';
    primaryColorName.value = newCar.colorPrimarioNombre || 'Sin Color';
    secondaryColorName.value = newCar.colorSecundarioNombre || 'Sin Color';
    primaryColor.value = newCar.colorPrimario || '#fff';
    secondaryColor.value = newCar.colorSecundario || '#fff';
  }
}, { immediate: true });
</script>

<style scoped>
/* 🔹 Solo mantenemos la barra de progreso en CSS */
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
</style>
