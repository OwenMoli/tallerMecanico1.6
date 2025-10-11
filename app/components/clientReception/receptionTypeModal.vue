<template>
  <DxPopup
    :title="title"
    :visible="open"
    :show-close-button="true"
    :width="800"
    :height="500"
    @hiding="handlePopupHiding"
  >
    <template #content>
      <div class="flex flex-col p-4">
        <h1 class="text-3xl font-bold text-center text-gray-800">
          Seleccionar Tipo de Recepción
        </h1>
        <p class="text-center text-gray-600 mt-2">
          ¿Qué tipo de servicio requiere el vehículo?
        </p>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
          <UCard
            class="flex flex-col items-center p-6 text-center transition-all duration-300 transform cursor-pointer hover:scale-105 hover:shadow-lg"
            @click="navigateTo('/operations/reception/clientSelect')"
          >
            <div class="p-4 rounded-full bg-indigo-100">
              <UIcon
                name="i-heroicons-clipboard-document-list"
                class="w-8 h-8 text-indigo-600"
              />
            </div>
            <h2 class="mt-4 text-xl font-semibold text-gray-700">
              Recepción y Diagnostico
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Para diagnósticos detallados, reparaciones mayores o servicios complejos.
            </p>
          </UCard>
          <UCard
            class="flex flex-col items-center p-6 text-center transition-all duration-300 transform cursor-pointer hover:scale-105 hover:shadow-lg"
            @click="navigateTo('/operations/reception/quickReception')"
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
    </template>
  </DxPopup>
</template>

<script setup>
import { defineProps, defineEmits, toRefs, computed } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import { navigateTo } from '#app';

// Props para controlar la visibilidad del modal.
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const { open } = toRefs(props);
const emit = defineEmits(['update:open']);
const title = computed(() => 'Seleccionar Tipo de Recepción');

const handlePopupHiding = () => {
  emit('update:open', false);
};
</script>
