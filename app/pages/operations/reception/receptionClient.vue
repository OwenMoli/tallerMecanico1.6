<template>
  <div class="recepcion-container overflow-auto">
    <section v-if="!selectedClient">

      <ClientesGrid @client-selected="handleClientSelection" />

    </section>

    <section v-else>
      <h2 class="section-subtitle">
        Vehículos de: {{ selectedClientName }}
        <button @click="clearSelection" class="back-button">← Volver a Clientes</button>
      </h2>
      <VehiculosCardView :clientId="selectedClient.id" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ClientesGrid from '~/pages/operations/reception/clientSelect.vue';
import VehiculosCardView from '~/pages/operations/reception/carSelection.vue';

// Variable de estado para el cliente seleccionado
const selectedClient = ref(null);

// Función que se llama cuando el usuario selecciona un cliente
function handleClientSelection(client) {
  selectedClient.value = client;
}

// Función para volver al listado de clientes
function clearSelection() {
  selectedClient.value = null;
}

// Un computed para mostrar el nombre del cliente en el título
const selectedClientName = computed(() => {
  if (!selectedClient.value) return '';
  return selectedClient.value.nombre || selectedClient.value.empresa?.nombre || 'Cliente sin nombre';
});
</script>

<style scoped>
.recepcion-container {
  max-width: 1450px;
  margin: 0 auto;
  padding: 20px;
}
.main-title {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
}
.section-subtitle {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #34495e;
}
.back-button {
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}
.back-button:hover {
  background-color: #2980b9;
}
</style>
