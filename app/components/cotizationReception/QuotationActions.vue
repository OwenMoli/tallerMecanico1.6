<template>
  <div class="flex justify-between items-center gap-3 mt-8 pt-4 border-t border-gray-300">
    <textarea
      :value="comments"
      @input="$emit('update:comments', $event.target.value)"
      placeholder="Notas o Comentarios Adicionales de la Cotización..."
      class="flex-grow p-3 border rounded-lg resize-none h-24 focus:ring-blue-500 focus:border-blue-500"
    ></textarea>
    <div class="flex flex-col gap-3">
      <button @click="$emit('finalize')" class="process-button-reception text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700">
        Finalizar Cotización
      </button>
      <button @click="$emit('cancel')" class="hide-car-button bg-gray-400 hover:bg-gray-500 text-lg px-8 py-3">
        Cancelar y Volver
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comments: { type: String, default: '' },
});

defineEmits(['update:comments', 'finalize', 'cancel']);
</script>

<style scoped>
/* Estilos de botones que movimos del padre */
.process-button-reception {
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.process-button-reception:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}
.hide-car-button {
  background-color: #f39c12;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.hide-car-button:hover {
  background-color: #e67e22;
}
</style>
