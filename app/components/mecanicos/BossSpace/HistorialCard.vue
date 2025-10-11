<script setup>
import { CalendarIcon, BellIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const statusColors = {
  'En Espera': { background: 'bg-gray-400', text: 'text-black' },
  'Completado': { background: 'bg-green-500', text: 'text-white' },
  'Diagnostico': { background: 'bg-blue-500', text: 'text-white' },
  'En Curso': { background: 'bg-yellow-500', text: 'text-black' },
  'En Proceso': { background: 'bg-yellow-500', text: 'text-black' },
  'Pausado': { background: 'bg-orange-500', text: 'text-white' },
  'Pruebas': { background: 'bg-lime-500', text: 'text-lime-900' },
  'Pendiente': { background: 'bg-yellow-600', text: 'text-black' },
  'Rechazado': { background: 'bg-red-500', text: 'text-white' },
  'Denegado': { background: 'bg-red-800', text: 'text-white' },
  'default': { background: 'bg-gray-400', text: 'text-black' }
};

const roleColors = {
  'Jefe Mecanico': 'border-purple-600',
  'Mecanico': 'border-amber-800',
  'default': 'border-gray-300'
};

const getStatusStyles = (status) => {
  return statusColors[status] || statusColors.default;
};

const getRoleBorderColor = (rol) => {
  return roleColors[rol] || roleColors.default;
};

const props = defineProps({
  item: { type: Object, required: true },
  side: { type: String, default: "left" } // "left" o "right"
});

const isNotification = computed(() => {
  return props.item.evento === 'Notificacion';
});
</script>

<template>
  <div
    class="mb-4 flex width-full"
    :class="side === 'right' ? 'justify-end' : 'justify-start'"
  >
    <div
      class="w-[90%] relative rounded-xl shadow-md overflow-hidden"
      :class="side === 'right' ? 'rounded-tr-none' : 'rounded-tl-none'"
    >
      <div
        class="h-8 w-full flex items-center justify-center relative"
        :class="item.pausado ? 'bg-orange-500' : isNotification ? 'bg-indigo-600' : getStatusStyles(item.estado).background"
      >
        <div v-if="isNotification" class="absolute inset-0 flex items-center justify-center z-10">
          <BellIcon class="h-6 w-6 text-white" />
        </div>
      </div>

      <div
        class="p-4 bg-white border-l-4"
        :class="getRoleBorderColor(item.rol)"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold text-base">{{ item.usuario }}</p>
            <p class="text-sm text-gray-500">{{ item.rol }}</p>
          </div>
          <div class="text-right flex flex-col items-end">
            <span class="text-sm font-medium mb-1">Orden: {{ item.orden }}</span>
            <div class="flex gap-1">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="[getStatusStyles(item.estado).background, getStatusStyles(item.estado).text]"
              >
                {{ item.estado }}
              </span>
              <span
                v-if="item.pausado"
                class="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700"
              >
                Pausado
              </span>
            </div>
          </div>
        </div>

        <div class="flex-grow flex flex-col justify-end">
          <p class="mt-2 font-medium text-gray-800">
            <span class="font-bold">Evento:</span> {{ item.evento }}
          </p>
          
          <div class="flex justify-between items-end mt-1">
            <p v-if="item.comentario" class="text-gray-700">
              <span class="font-bold">Comentario:</span> {{ item.comentario }}
            </p>

            <div class="flex items-center text-sm text-gray-500">
              <CalendarIcon class="h-4 w-4 mr-1" />
              <span>{{ item.fecha }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si fueran necesarios */
</style>