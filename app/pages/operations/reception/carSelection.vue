<template>
  <div class="page-container">
    <header class="controls-section">
      <div class="header-content">
        <h1 class="section-title">Vehículos de {{ clientName }}</h1>
        <div class="flex gap-4">
          <NuxtLink :to="`/operations/reception/vehicleReception`">
            <button class="add-button">Agregar Vehículo</button>
          </NuxtLink>
          <button @click="goBackToClients" class="hide-button">
            Regresar a Clientes
          </button>
        </div>
      </div>
      <div class="search-bar-container">
        <input v-model="searchTerm" icon="i-heroicons-magnifying-glass-20-solid" size="md" placeholder="Buscar..."
          type="text" class="search-input" />
      </div>

      <div class="filter-chooser-container">
        <label for="filter-chooser">Agregar filtro:</label>
        <select id="filter-chooser" v-model="selectedFilter" @change="addFilter" class="filter-chooser-select">
          <option value="">Seleccionar un campo...</option>
          <option v-for="field in availableFilterFields" :key="field.key" :value="field.key">
            {{ field.label }}
          </option>
        </select>
      </div>

      <div class="filters-container">
        <div v-for="field in activeFilterFields" :key="field.key" class="filter-item">
          <div class="filter-header">
            <button @click="removeFilter(field.key)" class="remove-filter-btn">
              ×
            </button>
            <label>{{ field.label }}</label>
          </div>
          <select v-model="filterValues[field.key]" class="filter-select">
            <option value="">Todos</option>
            <option v-for="option in getUniqueOptions(field.key)" :key="option" :value="option">
              {{ formatOption(field.key, option) }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <div v-if="filteredCars.length > 0" class="cards-section">
      <VehicleCard v-for="car in paginatedCars" :key="car.placa" :car="car" @process-car="goToReception" />
    </div>
    <div v-else class="no-results">
      <p>No se encontraron coches para este cliente.</p>
    </div>

    <div v-if="filteredCars.length > pageSize" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Siguiente
      </button>
    </div>

    <ReceptionDetails v-if="selectedCar" :selected-car="selectedCar" :client="receptionStore.client"
      @hide-details="hideReceptionDetails" class="reception-details-section" id="reception-details-section" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useReceptionStore } from '~/store/reception';
import VehicleCard from './vehicleCard.vue';

const router = useRouter();
const receptionStore = useReceptionStore();

const selectedCar = ref(null);

const clientName = computed(() => {
  const client = receptionStore.client;
  return client ? ('nombre' in client ? client.nombre : client.empresaNombre) : 'Cargando...';
});

const allCars = ref([
  {
    id_cliente: 1,
    placa: 'XYZ-123',
    modelo: 'Corolla',
    marca: 'Toyota',
    year: 2021,
    estilo: 'Turismo',
    transmision: 'Automática',
    traccion: 'Delantera (FWD)',
    combustible: 'Gasolina',
    colorPrimario: '',
    colorSecundario: '',
    kilometraje: 55000,
    porcentajeGasolina: 75,
    porcentajeTemperatura: 50,
    porcentajeAceite: 90,
    numeroChasis: '1HFUD13E2L0000000',
    numeroMotor: '2TR-FE-12345',
    tipoAceite: 'Sintético 5W-30',
    marcaFiltroAceite: 'Mann-Filter',
    activoFlotilla: 'activo',
    aseguradora: {
      nombre: 'Seguros La Fe',
      contacto: 'Ana García',
      poliza: '123456789',
      nombreAsegurado: 'Arthur Miller',
      numeroAviso: 'A123-456',
    },
    imageUrl:
      'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg',
  },
  {
    id_cliente: 2,
    placa: 'TEC-001',
    modelo: 'Fusion',
    marca: 'Ford',
    year: 2020,
    estilo: 'Sedán',
    transmision: 'Automática',
    traccion: 'Delantera (FWD)',
    combustible: 'Gasolina',
    // 🎨 CÓDIGOS DE COLOR (Originales)
    colorPrimario: '#FFFFFF', // Código de color (casi negro)
    // ✨ NOMBRES DE COLOR (NUEVOS CAMPOS)
    colorPrimarioNombre: 'Blanco', // <-- ¡AGREGAR ESTO!

    // 🎨 CÓDIGOS DE COLOR (Originales)
    colorSecundario: '#ff0000', // Código de color (rojo)
    // ✨ NOMBRES DE COLOR (NUEVOS CAMPOS)
    colorSecundarioNombre: 'Rojo', // <-- ¡AGREGAR ESTO!
    kilometraje: 85000,
    porcentajeGasolina: 60,
    porcentajeTemperatura: 65,
    porcentajeAceite: 80,
    numeroChasis: 'ABC123DEF4567890',
    numeroMotor: 'G-12345',
    tipoAceite: 'Semi-Sintético 10W-30',
    marcaFiltroAceite: 'K&N',
    activoFlotilla: 'flotilla',
    aseguradora: {
      nombre: 'Seguros Corporativos',
      contacto: 'Luis Morales',
      poliza: '987654321',
      nombreAsegurado: 'Tecnología Avanzada S.A.',
      numeroAviso: 'B123-789',
    },
    imageUrl: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg',
  },
  {
    id_cliente: 2,
    placa: 'TEC-002',
    modelo: 'Hilux',
    marca: 'Toyota',
    year: 2022,
    estilo: 'Pickup',
    transmision: 'Manual',
    traccion: '4x4 (4WD)',
    combustible: 'Diésel',
    colorPrimario: '#290303',
    colorSecundario: '#ff0000',
    kilometraje: 30000,
    porcentajeGasolina: 90,
    porcentajeTemperatura: 40,
    porcentajeAceite: 95,
    numeroChasis: 'ZYX987WVU6543210',
    numeroMotor: 'D-67890',
    tipoAceite: 'Sintético 5W-40',
    marcaFiltroAceite: 'Wix',
    activoFlotilla: 'flotilla',
    aseguradora: {
      nombre: 'Seguros Corporativos',
      contacto: 'Luis Morales',
      poliza: '987654321',
      nombreAsegurado: 'Tecnología Avanzada S.A.',
      numeroAviso: 'B123-789',
    },
    imageUrl: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg',
  },
  {
    id_cliente: 2,
    placa: 'TEC-003',
    modelo: 'Civic',
    marca: 'Honda',
    year: 2023,
    estilo: 'Sedán',
    transmision: 'CVT (Transmisión Variable Continua)',
    traccion: 'Delantera (FWD)',
    combustible: 'Gasolina',
    colorPrimario: '',
    colorSecundario: '',
    kilometraje: 15000,
    porcentajeGasolina: 85,
    porcentajeTemperatura: 55,
    porcentajeAceite: 98,
    numeroChasis: 'H-12345-I-67890-J-12345',
    numeroMotor: 'L15B7-54321',
    tipoAceite: 'Sintético 0W-20',
    marcaFiltroAceite: 'Honda Genuine Parts',
    activoFlotilla: 'flotilla',
    aseguradora: {
      nombre: 'Seguros Corporativos',
      contacto: 'Luis Morales',
      poliza: '987654321',
      nombreAsegurado: 'Tecnología Avanzada S.A.',
      numeroAviso: 'B123-789',
    },
    imageUrl: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg',
  },
]);

const searchTerm = ref('');
const activeFilterKeys = ref(['marca', 'year']);
const filterValues = ref({ marca: '', year: '' });
const selectedFilter = ref('');
const allFilterFields = [
  { key: 'placa', label: 'Placa' },
  { key: 'marca', label: 'Marca' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'color', label: 'Color' },
  { key: 'transmision', label: 'Transmisión' },
  { key: 'combustible', label: 'Combustible' },
  { key: 'activoFlotilla', label: 'Activo en Flotilla' },
  { key: 'numeroChasis', label: 'Número de Chasis' },
];

const availableFilterFields = computed(() => allFilterFields.filter((field) => !activeFilterKeys.value.includes(field.key)));
const activeFilterFields = computed(() => allFilterFields.filter((field) => activeFilterKeys.value.includes(field.key)));

const clientCars = computed(() => {
  const currentClientId = receptionStore.client?.id;
  if (!currentClientId) return [];
  return allCars.value.filter((car) => car.id_cliente === currentClientId);
});

const filteredCars = computed(() => {
  return clientCars.value.filter((car) => {
    const matchesFilters = activeFilterKeys.value.every((key) => {
      const val = filterValues.value[key];
      if (!val) return true;
      const [parentKey, nestedKey] = key.split('.');
      let carValue = car[parentKey];
      if (nestedKey) {
        carValue = carValue?.[nestedKey];
      }
      return String(carValue).toLowerCase() === String(val).toLowerCase();
    });
    return matchesFilters && matchesSearch(car);
  });
});

const pageSize = 8;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredCars.value.length / pageSize));
const paginatedCars = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCars.value.slice(start, start + pageSize);
});

function addFilter() {
  if (selectedFilter.value && !activeFilterKeys.value.includes(selectedFilter.value)) {
    activeFilterKeys.value.push(selectedFilter.value);
    filterValues.value[selectedFilter.value] = '';
    selectedFilter.value = '';
  }
}

function removeFilter(key) {
  const index = activeFilterKeys.value.indexOf(key);
  if (index > -1) {
    activeFilterKeys.value.splice(index, 1);
    delete filterValues.value[key];
  }
}

function getUniqueOptions(fieldKey) {
  const [parentKey, nestedKey] = fieldKey.split('.');
  if (nestedKey) {
    const options = [...new Set(clientCars.value.map((car) => car[parentKey]?.[nestedKey]))].sort();
    return options.filter(Boolean);
  }
  const options = [...new Set(clientCars.value.map((car) => car[fieldKey]))].sort();
  return options;
}

function formatOption(fieldKey, option) {
  if (fieldKey === 'activoFlotilla' && typeof option === 'boolean') {
    return option ? 'Sí' : 'No';
  }
  return option;
}

function matchesSearch(car) {
  if (!searchTerm.value) return true;
  const searchLower = searchTerm.value.toLowerCase();
  return Object.values(car).some((val) => {
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).some(
        (nestedVal) =>
          (typeof nestedVal === 'string' || typeof nestedVal === 'number') &&
          String(nestedVal).toLowerCase().includes(searchLower)
      );
    }
    return (
      (typeof val === 'string' || typeof val === 'number') &&
      String(val).toLowerCase().includes(searchLower)
    );
  });
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function goBackToClients() {
  receptionStore.resetReception();
  router.back();
}

function goToReception(car) {
  receptionStore.setCar(car);
  router.push('/operations/reception/vehicleReception');
}

function hideReceptionDetails() {
  selectedCar.value = null;
}

watch(receptionStore.client, (newClient) => {
  if (!newClient) {
    selectedCar.value = null;
  }
});

watch(searchTerm, () => {
  currentPage.value = 1;
});

watch(filterValues, () => {
  currentPage.value = 1;
}, { deep: true });
</script>

<style scoped>
/* Tu código CSS se mantiene igual y funciona correctamente */
.page-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.controls-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.add-button,
.hide-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.add-button {
  background-color: #3498db;
  color: white;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

.add-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.hide-button {
  background-color: #e74c3c;
  color: white;
  box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);
}

.hide-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.search-bar-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  border: 2px solid #cbd5e0;
  background-color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

.filter-chooser-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.filter-chooser-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-item {
  background-color: #e8f0f8;
  border: 1px solid #d1d9e6;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-filter-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.car-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.car-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.car-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 1rem;
}

.card-actions {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  background-color: #fafafa;
}

.reception-button-new {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  border: none;
  background-color: #27ae60;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.reception-button-new:hover {
  background-color: #219653;
  transform: translateY(-2px);
}

.no-results {
  text-align: center;
  padding: 4rem;
  color: #7f8c8d;
  font-size: 1.2rem;
  background-color: #ecf0f1;
  border-radius: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  font-size: 1rem;
}

.pagination button {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #2c3e50;
}
</style>
