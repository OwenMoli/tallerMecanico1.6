<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  categoriaNombre: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['icon-selected', 'remove-category']);

const selectedIconAlt = ref('');

const iconos = [
  { name: 'i-heroicons-check-circle-solid', value: 'ok', color: 'text-green-500 hover:text-green-600', alt: 'Bueno' },
  { name: 'i-heroicons-x-circle-solid', value: 'problem', color: 'text-red-500 hover:text-red-600', alt: 'Malo' },
  { name: 'i-heroicons-minus-circle-solid', value: 'missing', color: 'text-blue-500 hover:text-blue-600', alt: 'Falta' },
  { name: 'i-heroicons-exclamation-circle-solid', value: 'exclamation', color: 'text-yellow-500 hover:text-yellow-600', alt: 'Diagn.' }
];

function setActiveIcon(iconValue, altText) {
  selectedIconAlt.value = altText;
  emits('icon-selected', iconValue, props.categoriaNombre);
}

function removeThisCategory() {
  emits('remove-category', props.categoriaNombre);
}
</script>

<template>
  <UCard class="p-2 relative">
    <button @click="removeThisCategory"
      class="absolute top-2 right-2 size-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 flex items-center justify-center"
      aria-label="Eliminar categoría" title="Eliminar categoría">
      <UIcon name="i-heroicons-x-mark-solid" class="size-3" />
    </button>

    <div class="flex flex-col items-center gap-1">
      <div class="flex items-center gap-2">
        <h5 class="text-lg font-bold">{{ props.categoriaNombre }}</h5>
        <span v-if="props.estado" class="text-lg font-bold">
          - {{ iconos.find(i => i.value === props.estado)?.alt || '' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div v-for="icono in iconos" :key="icono.value" @click="setActiveIcon(icono.value, icono.alt)"
          class="size-12 cursor-pointer transition-colors duration-200 relative" :aria-label="icono.alt"
          :title="icono.alt">
          <UIcon :name="icono.name" class="size-full"
            :class="props.estado === icono.value ? icono.color : 'text-gray-400 hover:text-gray-500'" />
          <span class="sr-only">{{ icono.alt }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>
