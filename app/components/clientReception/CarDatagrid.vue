<template>
  <div class="datagrid-container">
    <table class="car-table">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Color</th>
          <th>Año</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.placa">
          <td>{{ car.placa }}</td>
          <td>{{ car.modelo }}</td>
          <td>{{ car.marca }}</td>
          <td>{{ car.color }}</td>
          <td>{{ car.year }}</td>
        </tr>
        <tr v-if="cars.length === 0">
          <td colspan="5" class="no-results">No se encontraron coches.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  cars: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.datagrid-container {
  overflow-x: auto; /* Permite desplazamiento horizontal en pantallas pequeñas */
}

.car-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.car-table th, .car-table td {
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

.car-table thead tr {
  background-color: #f4f4f4;
  color: #333;
}

.car-table tbody tr:hover {
  background-color: #f9f9f9;
}

.no-results {
  text-align: center !important;
  font-style: italic;
  color: #888;
}
</style>
