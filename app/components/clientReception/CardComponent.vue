<template>
  <div class="car-card">
    <div class="card-header">
      <img :src="car.imageUrl" alt="Imagen del Coche" class="car-image" />
    </div>
    <div class="card-body">
      <div class="car-info">
        <p><strong>Placa:</strong> {{ car.placa }}</p>
        <p><strong>Modelo:</strong> {{ car.modelo }}</p>
        <p><strong>Marca:</strong> {{ car.marca }}</p>
        <p><strong>Color:</strong> {{ car.color }}</p>
        <p><strong>Año:</strong> {{ car.year }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  car: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.car-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s;
  width: 280px; 
}

.car-card:hover {
  transform: translateY(-5px);
}

.card-header {
  text-align: center;
  background-color: #f8f9fa;
  padding: 10px;
}

.car-image {
  width: 100%;
  height: 150px; 
  object-fit: cover; 
}

.card-body {
  padding: 15px;
}

.car-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}
</style>
