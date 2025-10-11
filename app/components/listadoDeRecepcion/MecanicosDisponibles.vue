<template>
  <div>
    <div v-for="mecanico in mecanicos" :key="mecanico.id">
      <UCard class="mb-2">
        <div class="flex items-center">
          <div>
            <div class="font-semibold">{{ mecanico.nombre }}</div>
            <div class="text-sm text-gray-500">Tareas Asignadas: {{ mecanico.tareasAsignadas }}</div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mecanicos: Array,
})
</script>