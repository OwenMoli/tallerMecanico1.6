<template>
  <div class="space-y-4 text-center">
    <div class="space-y-2 flex flex-col items-center">
      <div>
        <label class="block mb-2 text-sm font-medium">Placa</label>
        <UInput v-model="internalCar.placa" placeholder="Placa del vehículo" />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">Transmisión</label>
        <UInputMenu v-model="internalCar.transmision" :items="transmissionTypes" placeholder="Selecciona el tipo de transmisión" />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">Tracción</label>
        <UInputMenu v-model="internalCar.traccion" :items="tractionTypes" placeholder="Selecciona el tipo de tracción" />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">Combustible</label>
        <UInputMenu v-model="internalCar.combustible" :items="fuelTypes" placeholder="Selecciona el tipo de combustible" />
      </div>
      <div>
        <label class="block mb-2 text-sm font-medium">Año</label>
        <UInputMenu v-model="internalCar.year" :items="years" />
      </div>
    </div>

    <br />
    <label class="block mb-2 text-sm font-medium">Colores</label>
    <div class="flex gap-4 justify-center">
      <div>
        <UPopover>
          <UButton label="Primario" color="neutral" variant="outline">
            <template #leading>
              <span :style="primaryChipStyle" class="size-3 rounded-full" />
            </template>
          </UButton>
          <template #content>
            <UColorPicker v-model="internalCar.colorPrimario" class="p-2" />
          </template>
        </UPopover>
      </div>
      <div>
        <UPopover>
          <UButton label="Secundario" color="neutral" variant="outline">
            <template #leading>
              <span :style="secondaryChipStyle" class="size-3 rounded-full" />
            </template>
          </UButton>
          <template #content>
            <UColorPicker v-model="internalCar.colorSecundario" class="p-2" />
          </template>
        </UPopover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ReceptionCar } from '~/types/reception';

const props = defineProps({
  car: {
    type: Object as () => ReceptionCar,
    required: true,
  },
});

const emit = defineEmits(['update:car']);

// Inicializa `internalCar` de forma segura, asegurando que `year` sea un string.
const internalCar = ref({
  ...props.car,
  year: props.car.year?.toString() || '', // Conversión a string
});

// Watcher para sincronizar los cambios de la prop a la variable local.
watch(() => props.car, (newCar) => {
  // Asegúrate de que `newCar.year` sea convertido a string antes de asignarlo.
  internalCar.value.year = newCar.year?.toString() || '';
  // Actualiza el resto de las propiedades.
  Object.assign(internalCar.value, newCar);
}, { deep: true });

// Watcher para emitir los cambios de la variable local al componente padre.
watch(internalCar, (newVal) => {
  // Asegúrate de que el año sea un número antes de emitirlo.
  const dataToEmit = {
    ...newVal,
    year: parseInt(newVal.year, 10), // Conversión a número
  };
  emit('update:car', dataToEmit);
}, { deep: true });

const currentYear = new Date().getFullYear();
const years = computed(() => Array.from({ length: currentYear - (currentYear - 50) + 1 }, (_, i) => (currentYear - i).toString()));

const fuelTypes = ref(['Gasolina', 'Diésel', 'Gas LP', 'Gas Natural', 'Eléctrico', 'Híbrido', 'Otro']);
const tractionTypes = ref(['Delantera (FWD)', 'Trasera (RWD)', 'Integral (AWD)', '4x4 (4WD)', 'Otro']);
const transmissionTypes = ref(['Manual', 'Automática', 'CVT (Transmisión Variable Continua)', 'Automatizada (ASG/DSG)', 'Otro']);

const primaryChipStyle = computed(() => ({ backgroundColor: internalCar.value.colorPrimario }));
const secondaryChipStyle = computed(() => ({ backgroundColor: internalCar.value.colorSecundario }));
</script>
