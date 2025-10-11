<script setup>
import { ref } from 'vue'

const asesorServicios = ref('')
const notasCliente = ref('')
</script>

<template>
  <div class="bg-gray-100 p-6 rounded-lg space-y-6 max-w-lg ">
    <h2 class="text-xl font-bold text-center">Observaciones Generales</h2>

    <section class="space-y-4">
      <UFormField label="Asesor de Servicios">
        <UTextarea v-model="asesorServicios" class="w-full" placeholder="Escriba aquí las observaciones del asesor..."
          :rows="8" />
      </UFormField>

      <UFormField label="Notas del Cliente">
        <UTextarea v-model="notasCliente" class="w-full" placeholder="Escriba aquí las notas del cliente..."
          :rows="8" />
      </UFormField>
    </section>

    <section class="flex gap-4">
      <div class="flex-1">
        <UFileUpload />
      </div>
      <div class="flex-1">
        <UFileUpload />
      </div>
      <div class="flex-1">
        <UFileUpload />
      </div>
    </section>

    <div class="flex justify-end pt-4">
      <UButton label="Atras"
        class=" bg-gray-300 text-black hover:bg-green-600 text-center font-semibold transition-colors duration-300" to="/operations/reception/carCheck"/>
        <UButton label="Finalizar"
        class=" bg-green-500 text-white hover:bg-green-600 text-center font-semibold transition-colors duration-300" to="/" />
    </div>
  </div>
</template>