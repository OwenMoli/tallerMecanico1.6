<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialColor: {
    type: Object,
    default: () => ({ name: 'Cian', code: '#00bcd4' })
  }
});

const emit = defineEmits(['color-selected']);

const defaultColors = [
  { name: 'Cian', code: '#00bcd4', class: 'bg-cyan-500' },
  { name: 'Negro', code: '#000000', class: 'bg-black' },
  { name: 'Blanco', code: '#FFFFFF', class: 'bg-white border border-gray-300' },
  { name: 'Gris', code: '#808080', class: 'bg-gray-500' },
  { name: 'Gris Oscuro', code: '#36454F', class: 'bg-gray-800' },
  { name: 'Rojo', code: '#FF0000', class: 'bg-red-600' },
  { name: 'Azul', code: '#0000FF', class: 'bg-blue-600' },
  { name: 'Verde', code: '#008000', class: 'bg-green-600' },
  { name: 'Amarillo', code: '#FFFF00', class: 'bg-yellow-400' },
  { name: 'Morado', code: '#800080', class: 'bg-purple-600' },
  { name: 'Naranja', code: '#FFA500', class: 'bg-orange-500' },
];

// Estado reactivo único para el color actual
const selectedColor = ref({ ...props.initialColor });
const customHex = ref(props.initialColor.code);
const popoverRef = ref(null);

// Sincronizar con el padre solo si el código cambia
watch(
  () => props.initialColor,
  (newColor, oldColor) => {
    if (newColor.code !== oldColor?.code) {
      selectedColor.value.code = newColor.code;
      customHex.value = newColor.code;
    }
  },
  { deep: true, immediate: true }
);

// Color rápido
const selectColor = (color) => {
  Object.assign(selectedColor.value, color);
  customHex.value = color.code;
  emit('color-selected', { ...selectedColor.value });
  popoverRef.value?.close?.();
};

// Color personalizado
const selectCustomColor = () => {
  emit('color-selected', { ...selectedColor.value });
  popoverRef.value?.close?.();
};
</script>

<template>
  <UPopover ref="popoverRef" :popper="{ placement: 'bottom-start' }">
    <template #default="{ open }">
      <UButton
        :label="selectedColor.name"
        :color="open ? 'primary' : 'gray'"
        variant="solid"
        :icon="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        trailing
        size="lg"
        class="w-full justify-center min-w-[200px]"
      >
        <template #leading>
          <div
            :style="{ backgroundColor: selectedColor.code }"
            :class="[
              'size-5 rounded-full ring-2 ring-offset-1',
              selectedColor.code === '#FFFFFF'
                ? 'border border-gray-400 ring-gray-600'
                : 'ring-white dark:ring-gray-900'
            ]"
          />
        </template>
      </UButton>
    </template>

    <template #content>
      <div class="w-72 p-4 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Seleccionar Tonalidad
        </h3>

        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Colores Rápidos:
        </label>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="color in defaultColors"
            :key="color.name"
            :title="color.name"
            @click="selectColor(color)"
            :class="[
              'w-7 h-7 rounded-full cursor-pointer transition-all',
              color.class,
              selectedColor.code === color.code
                ? 'ring-4 ring-offset-2 ring-primary-500'
                : 'hover:ring-2 hover:ring-offset-1 hover:ring-primary-400'
            ]"
          />
        </div>

        <UDivider />

        <UAccordion :items="[{ label: 'Otro Color', slot: 'custom' }]">
          <template #custom>
            <div class="pt-4 space-y-4">
              <UFormGroup label="Nombre:" :ui="{ label: 'text-sm' }">
                <UInput v-model="selectedColor.name" placeholder="Ej: Azul Cielo" />
              </UFormGroup>

              <UFormGroup label="Código HEX:">
                <UPopover :popper="{ placement: 'right-start' }">
                  <UButton color="neutral" variant="outline" :label="customHex" class="w-full justify-center">
                    <template #leading>
                      <span :style="{ backgroundColor: customHex }" class="size-4 rounded-full" />
                    </template>
                  </UButton>
                  <template #content>
                    <UColorPicker v-model="customHex" class="p-2" @change="selectedColor.code = customHex" />
                  </template>
                </UPopover>
              </UFormGroup>
<!-- Botón para seleccionar el color personalizado 
              <UButton
                @click="selectCustomColor"
                label="Seleccionar Color Personalizado"
                color="primary"
                variant="soft"
                class="mt-4 w-full"
                icon="i-heroicons-sparkles"
              />

              -->
            </div>
          </template>
        </UAccordion>
      </div>
    </template>
  </UPopover>
</template>
