<script setup lang="ts">
import { ref } from 'vue';
import { VpEditor, useAllTools, urlToBlob, createSettings, type ImageHistory } from 'vue-paint'

type SavePayload = string | Blob // La imagen guardada puede ser Data URL o Blob

// ... Inicialización del editor (tools, history, settings) ...
const { tools } = useAllTools({ backgroundImage: urlToBlob('https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg') })
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)

// 1. Variable reactiva para guardar la imagen
const savedImage = ref<SavePayload | null>(null) 

// 2. Función que captura la imagen (se llama con @save)
const saveImageToVariable = (payload: SavePayload) => {
    savedImage.value = payload;
}

// 3. EXPONER la variable y la función de guardar para que el padre pueda acceder a ellas
defineExpose({
  savedImage,        // Permite al padre leer la imagen.
  triggerSave: () => { 
    // Si necesitas forzar la acción de guardar desde el padre, 
    // aquí expondrías una función que simule el clic del botón de guardar del editor.
    // Para simplificar, asumiremos que el usuario ya presionó Guardar.
  } 
})
</script>

<template>
  <vp-editor 
    v-model:history="history" 
    v-model:settings="settings" 
    @save="saveImageToVariable" 
    :tools
    v-bind="$attrs"
  ></vp-editor>
</template>