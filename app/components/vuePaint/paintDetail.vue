<script setup lang="ts">
import { ref } from 'vue';
import { VpEditor, useAllTools, urlToBlob, createSettings, type ImageHistory } from 'vue-paint'

// Definir localmente el tipo SavePayload si la librería no lo exporta
type SavePayload = string | Blob

// ... tu código existente
const { tools } = useAllTools({ backgroundImage: urlToBlob('https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg') })
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)
// 1. Variable reactiva para guardar la imagen (Data URL o Blob)
const savedImage = ref<SavePayload | null>(null) 

// 2. Función para interceptar y guardar la imagen
const saveImageToVariable = (payload: SavePayload) => {
  // El 'payload' contiene los datos de la imagen. 
  // 'SavePayload' puede ser 'string' (Data URL) o 'Blob'.
  savedImage.value = payload;
  console.log("Imagen guardada en la variable 'savedImage':", savedImage.value);
  
  // Opcional: Si quieres seguir con la descarga, puedes llamar a downloadPng aquí:
  // downloadPng(payload);
}
</script>

<template>
  <vp-editor 
    v-model:history="history" 
    v-model:settings="settings" 
    @save="saveImageToVariable" :tools
  ></vp-editor>
  
  <div v-if="savedImage">
    <p>Imagen lista para ser enviada o visualizada.</p>
    <img v-if="typeof savedImage === 'string'" :src="savedImage" alt="Imagen guardada" style="max-width: 300px;">
  </div>
</template>