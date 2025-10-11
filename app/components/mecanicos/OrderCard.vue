<template>
  <div :class="cardClasses"
    class="bg-white shadow rounded-md p-3 flex items-center justify-between border-l-4 hover:shadow-lg transition-shadow duration-200 cursor-grab active:cursor-grabbing">
    <div class="flex items-start gap-4 flex-1">
      <div class="flex flex-col">
        <span class="font-bold text-sm text-gray-800">#{{ order.id }}</span>
        <span class="text-xs font-medium text-gray-500">{{ order.placa }}</span>
      </div>

      <div class="flex flex-col flex-1">
        <span class="font-semibold text-gray-700 text-sm">{{ order.cliente }}</span>
        <span class="text-xs text-gray-500">{{ order.marca }} {{ order.modelo }} ({{ order.anio }})</span>

        <div v-if="order.mecanico" class="flex items-center gap-1 mt-1">
          <UIcon name="i-heroicons-user-circle" class="text-gray-600 w-4 h-4" />
          <span class="text-xs text-gray-600 font-medium">{{ order.mecanico }}</span>
          <UTooltip v-if="order.comentarioMecanico" text="Tiene Comentarios">
            <UIcon name="i-heroicons-chat-bubble-bottom-center-text-solid" class="text-blue-500 w-4 h-4" />
          </UTooltip>
        </div>
      </div>
    </div>

    <div class="text-right flex flex-col items-end gap-1 ml-4">
      <UTooltip v-if="order.denegada" text="Orden Denegada">
        <UIcon name="i-heroicons-x-circle-solid" class="text-red-500 w-4 h-4" />
      </UTooltip>

      <span class="text-xs text-gray-400">{{ order.fechaHora?.split(' ')[1] || '' }}</span>
      <span class="text-xs text-green-500 font-medium">Tiempo: {{ formatTime(order.contador) }}</span>

      <div v-if="order.status" class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-sm"
        :class="getStatusClass(order.status)">
        <UIcon
          v-if="['Completado'].includes(order.status)"
          name="i-heroicons-check-circle-solid"
          class="w-4 h-4"
        />
        <UIcon
          v-else-if="['Rechazado', 'Denegado'].includes(order.status)"
          name="i-heroicons-x-circle-solid"
          class="w-4 h-4"
        />
        <UIcon
          v-else-if="['En Espera', 'Pausado', 'Pendiente', 'En Curso', 'En Proceso'].includes(order.status)"
          name="i-heroicons-clock-solid"
          class="w-4 h-4"
        />
        <UIcon
          v-else-if="['Diagnóstico'].includes(order.status)"
          name="i-heroicons-wrench-solid"
          class="w-4 h-4"
        />
        <UIcon
          v-else-if="['Pruebas'].includes(order.status)"
          name="i-heroicons-magnifying-glass-circle-solid"
          class="w-4 h-4"
        />
        <span>{{ order.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  order: { type: Object, required: true }
});

const formatTime = (seconds = 0) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const cardClasses = computed(() => {
  switch (props.order.priority) {
    case 'URGENTE':
      return 'border-red-500';
    case 'PRIORITARIO':
      return 'border-yellow-400';
    default:
      return 'border-gray-200';
  }
});

// Función para obtener las clases de estatus
const getStatusClass = (status) => {
  switch (status) {
    case 'En Espera':
      return 'bg-gray-400 text-white';
    case 'Completado':
      return 'bg-green-500 text-white';
    case 'Diagnostico':
      return 'bg-blue-500 text-white';
    case 'Taller':
    case 'En Proceso':
      return 'bg-yellow-500 text-white';
    case 'Pausado':
      return 'bg-orange-500 text-white';
    case 'Pruebas':
      return 'bg-lime-500 text-white';
    case 'Pendiente':
      return 'bg-yellow-600 text-white';
    case 'Rechazado':
      return 'bg-red-500 text-white';
    case 'Denegado':
      return 'bg-red-800 text-white';
    case 'Cotizando':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};
</script>