<template>
  <div>
    <h3 class="font-semibold text-lg mb-4 mt-6 border-t pt-4">Vista Previa de la Cotización</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Cliente</h4>
        <div class="space-y-2 text-sm">
          <p><strong>Nombre:</strong> {{ client.nombreCompleto }}</p>
          <p><strong>Teléfono:</strong> {{ client.telefono }}</p>
          <p v-if="client.email"><strong>Email:</strong> {{ client.email }}</p>
          <p v-if="client.direccion"><strong>Dirección:</strong> {{ client.direccion }}</p>
        </div>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Vehículo</h4>
        <div class="space-y-2 text-sm">
          <p><strong>Marca:</strong> {{ selectedCar.marca }}</p>
          <p><strong>Modelo:</strong> {{ selectedCar.modelo }}</p>
          <p><strong>Placa:</strong> {{ selectedCar.placa }}</p>
        </div>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 class="font-bold text-md mb-2 text-gray-800">Detalles de la Orden</h4>
        <div class="space-y-2 text-sm">
          <p><strong>Fecha:</strong> {{ formatDate(new Date()) }}</p>
          <p><strong>Odómetro:</strong> {{ selectedCar.kilometraje }} Km</p>
          <p><strong>VIN:</strong> {{ selectedCar.vin || 'No proporcionado' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  client: { type: Object, required: true },
  selectedCar: { type: Object, required: true },
});

// Función de utilidad local
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}
</script>
