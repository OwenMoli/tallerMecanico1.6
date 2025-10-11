<template>
  <div class="space-y-8 p-4 min-h-screen overflow-y-auto">
    <div class="p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Detalles de Vehículo</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div class="space-y-4">
          <div>
            <label for="placa" class="block mb-1 text-sm font-medium"># de Placa</label>
            <div class="flex items-center gap-4">
              <UInput id="placa" v-model="placaValue" placeholder="Placa" class="flex-grow" />
              <UCheckbox label="Sin Placa" class="cursor-pointer" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-medium" :class="{ 'font-bold': !isTextEntry }">Imagen VIN</span>
            <USwitch v-model="isTextEntry" class="cursor-pointer" />
            <span class="text-sm font-medium" :class="{ 'font-bold': isTextEntry }">Texto VIN</span>
          </div>

          <div v-if="isTextEntry">
            <label for="vin" class="block mb-1 text-sm font-medium">VIN (Texto)</label>
            <UInput id="vin" v-model="vin" placeholder="VIN del vehículo" />
          </div>

          <div v-else>
            <label class="block mb-1 text-sm font-medium">Foto del VIN</label>
            <div class="flex items-center gap-2">
              <UInput type="file" @change="handleFileUpload" accept="image/*" class="flex-grow" />
              <img v-if="vinImageUrl" :src="vinImageUrl" alt="Imagen del VIN" class="w-16 h-auto border rounded-md object-cover" />
              <UButton v-if="vinImageUrl" icon="i-heroicons-trash" color="error" @click="clearVinImage" />
            </div>
          </div>

          <div>
            <label for="kilometraje" class="block mb-1 text-sm font-medium">{{ isMiles ? 'Millas' : 'Kilometraje' }}</label>
            <div class="flex items-center gap-2">
              <UInput id="kilometraje" v-model="displayKilometraje" class="flex-grow" type="number" step="any" />
              <span class="text-sm font-medium" :class="{ 'font-bold': !isMiles }">Km</span>
              <USwitch v-model="isMiles" class="cursor-pointer" />
              <span class="text-sm font-medium" :class="{ 'font-bold': isMiles }">Mi</span>
            </div>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center mt-6 lg:mt-0">
          <div class="flex flex-col items-center space-y-2 w-full max-w-xs">
            <h3 class="text-sm font-semibold text-center">Gasolina</h3>
            <Medidor :value="fuelPercentage" />
            <USlider v-model="fuelPercentage" :min="0" :max="100" class="cursor-pointer" />
          </div>
          <div class="flex flex-col items-center space-y-2 w-full max-w-xs">
            <h3 class="text-sm font-semibold text-center">Temperatura</h3>
            <Medidor :value="temperaturePercentage" unit="°C" type="temperature" />
            <USlider v-model="temperaturePercentage" :min="0" :max="100" class="cursor-pointer" />
          </div>
          <div class="flex flex-col items-center space-y-2 w-full max-w-xs">
            <h3 class="text-sm font-semibold text-center">Aceite</h3>
            <Medidor :value="oilPercentage" />
            <USlider v-model="oilPercentage" :min="0" :max="100" class="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Carroceria</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <label for="numero-chasis" class="block mb-1 text-sm font-medium">Numero de chasis</label>
          <UInput id="numero-chasis" v-model="numeroChasis" />
        </div>
        <div>
          <label for="numero-motor" class="block mb-1 text-sm font-medium">Numero de motor</label>
          <UInput id="numero-motor" v-model="numeroMotor" />
        </div>
        <div>
          <label for="tipo-aceite" class="block mb-1 text-sm font-medium">Tipo de aceite</label>
          <UInput id="tipo-aceite" v-model="tipoAceite" />
        </div>
        <div>
          <label for="marca-filtro-aceite" class="block mb-1 text-sm font-medium">Marca de filtro de aceite</label>
          <UInput id="marca-filtro-aceite" v-model="marcaFiltroAceite" />
        </div>
        <div>
          <label for="activo-flotilla" class="block mb-1 text-sm font-medium">Activo/flotilla</label>
          <UInput id="activo-flotilla" v-model="activoFlotilla" />
        </div>
      </div>
    </div>

    <div class="p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Aseguradora</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <label for="aseguradora" class="block mb-1 text-sm font-medium">Aseguradora</label>
          <UInput id="aseguradora" v-model="aseguradora" />
        </div>
        <div>
          <label for="contacto-directo" class="block mb-1 text-sm font-medium">Contacto directo</label>
          <UInput id="contacto-directo" v-model="contactoDirecto" />
        </div>
        <div>
          <label for="poliza" class="block mb-1 text-sm font-medium">Poliza</label>
          <UInput id="poliza" v-model="poliza" />
        </div>
        <div>
          <label for="nombre-asegurado" class="block mb-1 text-sm font-medium">Nombre del asegurado</label>
          <UInput id="nombre-asegurado" v-model="nombreAsegurado" />
        </div>
        <div>
          <label for="numero-aviso" class="block mb-1 text-sm font-medium">Numero de aviso</label>
          <UInput id="numero-aviso" v-model="numeroAviso" />
        </div>
      </div>
      <div class="mt-6 flex flex-wrap gap-4 items-center">
        <UCheckbox v-model="pagaDeducible" label="Paga deducible" class="cursor-pointer" />
        <UCheckbox v-model="pagaDemerito" label="Paga demerito" class="cursor-pointer" />
        <UCheckbox v-model="pagaDemerito2" label="Paga demerito" class="cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, defineProps, computed } from 'vue';
import Medidor from '~/components/carGallery/medidor.vue';
import type { ReceptionCar } from '~/types';
import { useReceptionStore } from '~/store/reception';

const props = defineProps({
  car: {
    type: Object as () => ReceptionCar | null,
    default: () => null
  }
});

const KM_TO_MILE_FACTOR = 0.621371;
const receptionStore = useReceptionStore();

const placaValue = ref('');
// 'kilometrosEnKm' almacenará el valor **siempre en Kilómetros**, independientemente de lo que se muestre.
const kilometrosEnKm = ref(0);
const isMiles = ref(false);

const fuelPercentage = ref(0);
const temperaturePercentage = ref(0);
const oilPercentage = ref(0);

const numeroChasis = ref('');
const numeroMotor = ref('');
const tipoAceite = ref('');
const marcaFiltroAceite = ref('');
const activoFlotilla = ref('');

const aseguradora = ref('');
const contactoDirecto = ref('');
const poliza = ref('');
const nombreAsegurado = ref('');
const numeroAviso = ref('');
const pagaDeducible = ref(false);
const pagaDemerito = ref(false);
const pagaDemerito2 = ref(false);

const vin = ref('');
const vinImageUrl = ref('');
const isTextEntry = ref(true);

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        vinImageUrl.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const clearVinImage = () => {
  vinImageUrl.value = '';
};

/**
 * Computed property para manejar la entrada y salida de datos
 * del campo de kilometraje, realizando la conversión al vuelo.
 */
const displayKilometraje = computed({
  // Getter: Devuelve el valor a mostrar en el input.
  get() {
    // Si isMiles es true, convierte Kilómetros a Millas para mostrar.
    if (isMiles.value) {
      const miles = kilometrosEnKm.value * KM_TO_MILE_FACTOR;
      // .toFixed(2) para limitar a dos decimales y evitar números largos.
      return miles > 0 ? miles.toFixed(2) : '';
    }
    // Si no, devuelve los Kilómetros sin convertir.
    return kilometrosEnKm.value > 0 ? kilometrosEnKm.value.toString() : '';
  },
  // Setter: Se ejecuta cuando el usuario escribe en el input.
  set(newValue) {
    const numValue = parseFloat(newValue as string) || 0;

    // Si la unidad actual es Millas, el valor ingresado se convierte a Km
    // para guardarlo en la variable central `kilometrosEnKm`.
    if (isMiles.value) {
      kilometrosEnKm.value = numValue / KM_TO_MILE_FACTOR;
    } else {
      // Si la unidad actual es Kilómetros, se guarda directamente.
      kilometrosEnKm.value = numValue;
    }
  }
});


watchEffect(() => {
  if (props.car) {
    placaValue.value = props.car.placa || '';
    // Inicializar el valor central SIEMPRE en Kilómetros (si el car tiene un valor)
    kilometrosEnKm.value = parseFloat(props.car.kilometraje?.toString() || '0') || 0; 
    fuelPercentage.value = props.car.porcentajeGasolina || 0;
    temperaturePercentage.value = props.car.porcentajeTemperatura || 0;
    oilPercentage.value = props.car.porcentajeAceite || 0;
    numeroChasis.value = props.car.numeroChasis || '';
    numeroMotor.value = props.car.numeroMotor || '';
    tipoAceite.value = props.car.tipoAceite || '';
    marcaFiltroAceite.value = props.car.marcaFiltroAceite || '';
    activoFlotilla.value = props.car.activoFlotilla?.toString() || '';

    if (props.car.aseguradora) {
      aseguradora.value = props.car.aseguradora.nombre || '';
      contactoDirecto.value = props.car.aseguradora.contacto || '';
      poliza.value = props.car.aseguradora.poliza || '';
      nombreAsegurado.value = props.car.aseguradora.nombreAsegurado || '';
      numeroAviso.value = props.car.aseguradora.numeroAviso || '';
    }
  }

  // Sincronizar con los nuevos campos del store
  vin.value = receptionStore.vin || '';
  vinImageUrl.value = receptionStore.vinImageUrl || '';
});

// Observar cambios en los campos locales para actualizar el store
watch([vin, vinImageUrl, isTextEntry], () => {
    // Si la entrada es de texto, se borra la URL de la imagen en el store.
    // Si la entrada es por imagen, se borra el texto del VIN en el store.
    if (isTextEntry.value) {
        receptionStore.setVin(vin.value, '');
    } else {
        receptionStore.setVin('', vinImageUrl.value);
    }
});

// Opcional: Podrías querer observar `kilometrosEnKm` para actualizar el store si es necesario.
// watch(kilometrosEnKm, (newKm) => {
//   // Lógica para actualizar el store con el valor en kilómetros
//   // receptionStore.setKilometraje(newKm); 
// });
</script>

<style scoped>
/* Estilos sin cambios */
</style>