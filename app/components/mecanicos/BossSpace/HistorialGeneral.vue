<template>
  <div class="p-4 md:p-10 max-w-4xl mx-auto">
    <h2 class="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">
      Historial de Movimientos de la Orden <span class="text-blue-600">{{ ORDER_ID }}</span>
    </h2>

    <div class="flex flex-col pr-4" style="max-height: 70vh;" :class="history.length > 0 ? 'overflow-y-scroll' : ''">
      <div v-if="sortedHistory.length > 0">
        <div v-for="item in sortedHistory" :key="item.id" class="mb-4 flex w-full"
          :class="getSideByRole(item.rol) === 'left' ? 'justify-start' : 'justify-end'">
          <div
            class="w-[90%] md:w-[60%] relative rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl"
            :class="getSideByRole(item.rol) === 'left' ? 'rounded-tl-none' : 'rounded-tr-none'">
            <div class="h-8 w-full flex items-center justify-center relative"
              :class="item.pausado ? 'bg-orange-500' : isNotification(item) ? 'bg-indigo-600' : getStatusStyles(item.estado).background">
              <div v-if="isNotification(item)" class="absolute inset-0 flex items-center justify-center z-10">
                <BellIcon class="h-5 w-5 text-white mr-1" />
                <span class="text-white font-bold text-sm">NOTIFICACIÓN</span>
              </div>
            </div>

            <div class="p-4 bg-white border-l-4" :class="getRoleBorderColor(item.rol)">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-semibold text-base">{{ item.usuario }}</p>
                  <p class="text-sm text-gray-500">{{ item.rol }}</p>
                </div>

                <div class="text-right flex flex-col items-end">
                  <span class="text-sm font-medium mb-1">Orden: {{ item.orden }}</span>
                  <div class="flex gap-1">
                    <span class="text-xs px-2 py-1 rounded-full"
                      :class="[getStatusStyles(item.estado).background, getStatusStyles(item.estado).text]">
                      {{ item.estado }}
                    </span>
                    
                  </div>
                </div>
              </div>

              <div class="flex-grow flex flex-col justify-end mt-3">
                <p class="font-medium text-gray-800 border-t pt-2">
                  <span class="font-bold text-indigo-700">EVENTO:</span> {{ item.evento }}
                </p>

                <div class="flex justify-between items-end mt-2">
                  <p v-if="item.comentario" class="text-sm text-gray-700 max-w-[70%]">
                    <span class="font-bold">Comentario:</span> {{ item.comentario }}
                  </p>

                  <div class="flex items-center text-sm text-gray-500 ml-auto">
                    <CalendarIcon class="h-4 w-4 mr-1" />
                    <span>{{ formatDate(item.fecha) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-8 bg-white rounded-lg shadow-inner mt-8">
        <p class="text-xl text-gray-500">
          No se ha registrado ningún movimiento para esta orden.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CalendarIcon, BellIcon } from '@heroicons/vue/24/outline';
import { useHistoryStore } from '~/store/historyStore';

// --- Constantes y Configuración ---
const ORDER_ID = 'R001';
const historyStore = useHistoryStore();

// --- Lógica de Estilos y Clases (Omitida para brevedad, ya que estaba correcta) ---
const statusColors = {

  'Rechazado': { background: 'bg-red-500', text: 'text-white' },
  'Denegado': { background: 'bg-red-800', text: 'text-white' },
  'Pausado': { background: 'bg-orange-500', text: 'text-white' },

  'Pendiente': { background: 'bg-yellow-600', text: 'text-black' },
  'En Espera': { background: 'bg-gray-400', text: 'text-black' },

  'Diagnostico': { background: 'bg-blue-500', text: 'text-white' },
  'Taller': { background: 'bg-yellow-500', text: 'text-black' },
  'Pruebas': { background: 'bg-lime-500', text: 'text-lime-900' },

  'Completado': { background: 'bg-green-500', text: 'text-white' },
  'Cotizando': { background: 'bg-purple-500', text: 'text-white' },
  'default': { background: 'bg-gray-400', text: 'text-black' }

};

const roleColors = {
  'Jefe Mecanico': 'border-purple-600',
  'Mecanico': 'border-amber-800',
  'default': 'border-gray-300'
};

const getStatusStyles = (status) => {
  const key = status && statusColors[status] ? status : 'default';
  return statusColors[key];
};

const getRoleBorderColor = (rol) => {
  const key = rol && roleColors[rol] ? rol : 'default';
  return roleColors[key];
};

const getSideByRole = (rol) => {
  if (!rol) {
    return 'left';
  }
  if (rol.trim() === 'Jefe Mecanico') {
    return 'left';
  }
  if (rol.includes('Mecanico')) {
    return 'right';
  }
  return 'left';
};
// --- Fin Lógica de Clases ---


const isNotification = (item) => {
  // Nota: Si el evento es 'Notificación a Martin Salazar +A', ¡debería ser 'Notificación'!
  // Si tu evento es más específico (como en el ejemplo estático), ajusta esta lógica.
  return item.evento.includes('Notificacion');
};

const formatDate = (isoString) => {
  if (!isoString) return 'Sin fecha';
  try {
    // Si la fecha ya viene en formato 'YYYY-MM-DD HH:MM', este `replace` no hace nada,
    // pero si viene de ISO (con 'T' y 'Z'), la corrige para el new Date().
    const dateToParse = isoString.replace(' ', 'T');

    return new Date(dateToParse).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
};

// --- Lógica de Datos de Pinia (Corregida) ---
const history = computed(() => {
  // Este getter ahora devuelve una COPIA INMUTABLE del array, lo que es clave.
  return historyStore.getHistoryByOrderId(ORDER_ID);
});

const sortedHistory = computed(() => {
  if (!history.value) return [];

  // Como history.value ya es una copia (por el getter), no necesitamos el [...].
  // Podemos ordenar directamente.
  return history.value.sort((a, b) => {
    // Aseguramos que el sort se haga de forma robusta
    const dateA = a.fecha ? new Date(a.fecha) : 0;
    const dateB = b.fecha ? new Date(b.fecha) : 0;

    // Orden ascendente por fecha (el más antiguo primero)
    return dateA - dateB;
  });
});
</script>