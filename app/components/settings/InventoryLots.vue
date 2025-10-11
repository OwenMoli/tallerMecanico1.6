<template>
  <div class="form-section">
    <h3 class="section-title">Registro de Lotes de Entrada (FIFO)</h3>
    <div class="lot-entry-container">
      <div v-if="lots.length" class="lots-table">
        <table>
          <thead>
            <tr>
              <th>Fecha de Entrada</th>
              <th>Costo Unitario</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lot, index) in lots" :key="index">
              <td>{{ lot.date }}</td>
              <td>{{ formatCurrency(lot.cost) }}</td>
              <td>{{ lot.quantity }}</td>
              <td><button @click="$emit('remove-lot', index)" class="remove-button">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
        <p class="total-stock">Cantidad Total en Stock: <strong>{{ totalStock }}</strong></p>
      </div>

      <div class="add-lot-form">
        <div class="form-row">
          <div class="form-field">
            <label for="lot-date">Fecha de Entrada:</label>
            <input type="date" id="lot-date" v-model="newLot.date" />
          </div>
          <div class="form-field">
            <label for="lot-cost">Costo Unitario:</label>
            <input type="number" id="lot-cost" v-model.number="newLot.cost" />
          </div>
          <div class="form-field">
            <label for="lot-quantity">Cantidad:</label>
            <input type="number" id="lot-quantity" v-model.number="newLot.quantity" />
          </div>
          <div class="form-field">
            <button @click="handleAddLot" :disabled="!isLotValid" class="add-lot-button">Añadir Lote</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  lots: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['add-lot', 'remove-lot']);

const newLot = ref({
  date: '',
  cost: null,
  quantity: null,
});

const isLotValid = computed(() => {
  return newLot.value.date && newLot.value.cost > 0 && newLot.value.quantity > 0;
});

const totalStock = computed(() => {
  return props.lots.reduce((sum, lot) => sum + lot.quantity, 0);
});

const handleAddLot = () => {
  emits('add-lot', { ...newLot.value });
  newLot.value = { date: '', cost: null, quantity: null };
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  return `L. ${value.toFixed(2)}`;
};
</script>

<style scoped>
.form-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.5em;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
  margin-bottom: 20px;
  color: #333;
}

.lot-entry-container {
  display: flex;
  flex-direction: column;
}

.lots-table {
  margin-bottom: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f0f0f0;
  font-weight: 600;
  color: #555;
}

tr:hover {
  background-color: #f9f9f9;
}

.total-stock {
  font-weight: bold;
  color: #555;
}

.add-lot-form .form-row {
  align-items: flex-end;
}

.form-field {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
}

label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  border-radius: 4px;
  font-size: 1em;
  transition: all 0.2s ease-in-out;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.add-lot-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;
  height: 40px;
}

.add-lot-button:hover:not(:disabled) {
  background-color: #45a049;
}

.add-lot-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c0392b;
}
</style>