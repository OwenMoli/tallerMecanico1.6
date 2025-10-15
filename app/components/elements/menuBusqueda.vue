
<template>
  <div class="relative w-full max-w-sm mx-auto">
    <UInput
      v-model="textoBusqueda"
      icon="i-heroicons-magnifying-glass"
      placeholder="Agregar Chequeo"
      size="xl"
      :ui="{ rounded: 'rounded-full', icon: { leading: { pointer: '' } } }"
      @focus="estaEnfocado = true"
      @blur="manejarDesenfoque"
      class="z-10"
    />

    <div
      v-if="estaEnfocado && (textoBusqueda || itemsFiltrados.length > 0)"
      class="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-20"
      ref="listaDesplegable"
    >
      <div 
        v-for="item in itemsFiltrados"
        :key="item"
        class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        @mousedown.prevent 
        @click="seleccionarItem(item)"
      >
        <p class="py-3 px-4 text-gray-900 dark:text-white">{{ item }}</p>
      </div>
      
      <div v-if="itemsFiltrados.length === 0" class="py-3 px-4 text-gray-500 dark:text-gray-400">
        No hay coincidencias.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Define las propiedades que el componente espera recibir del padre.
const props = defineProps({
  items: {
    type: Array, // Lista de opciones disponibles.
    required: true,
    default: () => []
  }
});

// Define los eventos que el componente puede emitir al padre.
const emit = defineEmits(['item-seleccionado']);

const textoBusqueda = ref('');
// Estado booleano para controlar la visibilidad de la lista desplegable.
const estaEnfocado = ref(false); 

/**
 * Filtra las opciones de la prop 'items' basadas en el texto de búsqueda.
 * Muestra todas las opciones si el campo de búsqueda está vacío.
 */
const itemsFiltrados = computed(() => {
  const busqueda = textoBusqueda.value.toLowerCase().trim();
  
  if (!busqueda) {
    return props.items; 
  }
  
  return props.items.filter(item => 
    item.toLowerCase().includes(busqueda)
  );
});


/**
 * Maneja la selección de un ítem de la lista.
 * @param {string} item - El valor del ítem seleccionado.
 */
const seleccionarItem = (item) => {
  // Notifica al componente padre con el ítem seleccionado.
  emit('item-seleccionado', item); 
  
  // Limpia el texto de búsqueda para resetear la lista de resultados.
  textoBusqueda.value = ''; 
  
  // La propiedad 'estaEnfocado' se mantiene 'true' para que la lista
  // permanezca visible tras la selección.
};


/**
 * Controla el desenfoque del campo de texto.
 * Se usa un setTimeout para evitar que la lista se cierre inmediatamente
 * si un clic en la lista es detectado como un 'blur' accidental.
 */
const manejarDesenfoque = () => {
  setTimeout(() => {
    estaEnfocado.value = false;
  }, 100);
};
</script>