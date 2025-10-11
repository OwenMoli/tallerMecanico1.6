<template>
  <div class="flex flex-col items-center justify-center h-screen w-full bg-gray-100">
    <div class="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-xl">
      <h1 class="text-3xl font-bold text-center text-gray-800">Seleccionar Tipo de Recepción</h1>
      <p class="text-center text-gray-600">
        ¿Qué tipo de servicio requiere el vehículo?
      </p>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UCard
          class="flex flex-col items-center p-6 text-center transition-all duration-300 transform cursor-pointer hover:scale-105 hover:shadow-lg"
          @click="startDeepReception"
        >
          <div class="p-4 rounded-full bg-indigo-100">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8 text-indigo-600" />
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-700">Recepción y Diagnostico</h2>
          <p class="mt-2 text-sm text-gray-500">
            Para diagnósticos detallados, reparaciones mayores o servicios complejos.
          </p>
        </UCard>

        <UCard
          class="flex flex-col items-center p-6 text-center transition-all duration-300 transform cursor-pointer hover:scale-105 hover:shadow-lg"
          @click="startQuickReception"
        >
          <div class="p-4 rounded-full bg-teal-100">
            <UIcon name="i-heroicons-bolt" class="w-8 h-8 text-teal-600" />
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-700">Recepción Rápida</h2>
          <p class="mt-2 text-sm text-gray-500">
            Para servicios sencillos como cambio de aceite, llantas o revisiones rápidas.
          </p>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function startDeepReception() {
  router.push('clientSelect');
}

function startQuickReception() {
  router.push('quickReception');
}
</script>
