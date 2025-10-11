<template>
  <div class="car-card">
    <img :src="car.imageUrl" class="car-image" />
    <div class="car-info">
      <div><strong>Placa:</strong> {{ car.placa }}</div>
      <div><strong>Marca:</strong> {{ car.marca }}</div>
      <div><strong>Modelo:</strong> {{ car.modelo }}</div>
      <div><strong>Año:</strong> {{ car.year }}</div>
      <div><strong>No de Chasis:</strong> {{ car.numeroChasis }}</div>
      <div><strong>Color:</strong> {{ car.colorPrimario }}</div>
    </div>
    <div class="card-actions">
      <button class="reception-button-new" @click="goToReception">Procesar Coche</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useReceptionStore } from '~/store/reception';

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const receptionStore = useReceptionStore();

function goToReception() {
  const carToStore = { ...props.car };
  if (!carToStore.colorPrimario) {
    carToStore.colorPrimario = '#ffffff';
  }
  if (!carToStore.colorSecundario) {
    carToStore.colorSecundario = '#ffffff';
  }
  receptionStore.setCar(carToStore);
  router.push('/operations/reception/vehicleReception');
}
</script>

<style scoped>
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
