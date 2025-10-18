<script setup lang="ts">
import { ref } from 'vue';
import { VpEditor, useAllTools, urlToBlob, createSettings, type ImageHistory } from 'vue-paint'
// Opcional pero recomendado para tipado
// Nota: no importar VpEditor como tipo; usaremos InstanceType<typeof VpEditor> para tipar la referencia del componente.

// Configuración de la imagen de fondo y herramientas
const { tools } = useAllTools({ 
    // NOTA: La imagen debe ser servida con cabeceras CORS correctas o desde el mismo origen
    backgroundImage: urlToBlob('https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg') 
})

// Variables reactivas para el editor
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)

// Referencia al componente VpEditor para llamar a sus métodos internos
const vpEditorRef = ref<InstanceType<typeof VpEditor> | null>(null)

// Variable para almacenar la cadena Base64 final
const imageBase64 = ref<string | null>(null)
const conversionError = ref<string | null>(null)


/**
 * Convierte un elemento SVG (incluyendo todo el dibujo) a una cadena Base64 PNG.
 * Se utiliza Canvas para la conversión final.
 * @param svgElement El elemento SVG del DOM.
 */
const svgToBase64Png = (svgElement: SVGElement): Promise<string> => {
    return new Promise((resolve, reject) => {
        // 1. Serializar el elemento SVG a una cadena XML
        const serializer = new XMLSerializer();
        // Incluir el fondo de la imagen en el SVG serializado
        // Nota: Asegúrate de que el SVG serializado tenga dimensiones.
        let svgString = serializer.serializeToString(svgElement);

        // Intento de obtener dimensiones correctas (puede variar según el entorno)
        const width = svgElement.getAttribute('width') || 800; // Asume un ancho por defecto
        const height = svgElement.getAttribute('height') || 600; // Asume un alto por defecto
        
        // Agregar información de XML, DOCTYPE y dimensiones si faltan (para mejor compatibilidad con Canvas)
        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        svgString = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svgString}`;


        // 2. Codificar la cadena SVG para usarla como Data URL
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

        // 3. Crear una imagen temporal y un Canvas para la conversión a PNG
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // CRÍTICO para CORS

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || Number(width);
            canvas.height = img.height || Number(height);
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                // Dibujar la imagen SVG (que ahora incluye el dibujo y el fondo) en el Canvas
                ctx.drawImage(img, 0, 0);
                const pngBase64 = canvas.toDataURL('image/png'); 
                resolve(pngBase64);
            } else {
                reject(new Error("No se pudo obtener el contexto 2D del canvas."));
            }
        };

        img.onerror = (error) => {
            console.error("Error al cargar la imagen SVG en el canvas.", error);
            // Mostrar más detalles del error si es posible
            reject(new Error("Error al cargar el SVG. Problemas de CORS o formato SVG."));
        };

        img.src = svgDataUrl;
    });
}


/**
 * Maneja el evento @save, extrae el SVG, y lo convierte a Base64 PNG.
 * Esta función es llamada por vp-editor.save() (ya sea manual o programáticamente).
 * @param saveObject El objeto {svg, tools, history} emitido por @save.
 */
const saveAndConvertToBase64 = async (saveObject: any) => {
    conversionError.value = null;
    imageBase64.value = null;

    if (!saveObject || !(saveObject.svg instanceof SVGElement)) {
        console.error("❌ ERROR: El evento @save no contiene el elemento SVG.");
        conversionError.value = "Error: El editor no proporcionó el elemento SVG necesario.";
        return; 
    }

    try {
        const base64String = await svgToBase64Png(saveObject.svg);
        
        // 🚀 LOG DE CONFIRMACIÓN AQUÍ 🚀
        const base64Fragment = base64String.substring(0, 100) + '...';
        console.log("✅ ¡Conversión a Base64 exitosa! Fragmento de la cadena:", base64Fragment);

        // Almacenar el resultado
        imageBase64.value = base64String;

    } catch (error) {
        conversionError.value = `Error durante la conversión: ${error}`;
        console.error("Error completo en la conversión SVG a PNG:", error);
    }
}

/**
 * Método público expuesto que fuerza al editor a guardar y convertir el diagrama.
 * Es llamado desde el componente padre (Recepción de Vehículos - Detalles).
 */
const saveDiagram = async (): Promise<string | null> => {
    if (vpEditorRef.value) {
        console.log("-> 💾 Disparando guardado programático del diagrama.");
        
        // Llama al método 'save' interno del componente vue-paint.
        // Esto asincrónicamente disparará 'saveAndConvertToBase64'.
        vpEditorRef.value.save(); 
        
        // Es necesario esperar a que la conversión asíncrona (img.onload en svgToBase64Png) termine.
        // Un simple setTimeout es una solución, pero lo ideal sería una promesa más explícita.
        // Dado que 'saveAndConvertToBase64' no retorna una promesa que podamos esperar aquí,
        // esperamos un tiempo prudente.
        await new Promise(resolve => setTimeout(resolve, 300)); // Espera 300ms

        console.log("-> 🖼️ Conversión completada/tiempo agotado. Devolviendo Base64.");
        return imageBase64.value; 
    }
    console.warn("-> ⚠️ No se pudo guardar el diagrama: vpEditorRef es null.");
    return null;
}

// ** PARTE CRUCIAL: Exponer las propiedades y métodos para que el padre pueda acceder a ellos **
defineExpose({
    imageBase64, 
    saveDiagram 
})
</script>

<template>
  <div class="vue-paint-container">
    <h2>Editor de Daños del Vehículo</h2>
    
    <vp-editor 
      ref="vpEditorRef" v-model:history="history" 
      v-model:settings="settings" 
      @save="saveAndConvertToBase64" 
      :tools
    ></vp-editor>

    <div v-if="conversionError" style="margin-top: 20px; color: red;">
      <h3>Error de Conversión</h3>
      <p>{{ conversionError }}</p>
    </div>
    
    <div v-if="imageBase64" style="margin-top: 30px; padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
      <h3>Resultado de la Conversión Base64</h3>
      <pre style="word-wrap: break-word; white-space: pre-wrap; font-size: 10px;">{{ imageBase64.substring(0, 80) + '...' }}</pre>
      <h4>Previsualización:</h4>
      <img :src="imageBase64" alt="Imagen Dibujada y Guardada" style="max-width: 100%; height: auto; border: 2px solid green;"/>
    </div>
  </div>
</template>

<style scoped>
.vue-paint-container {
  max-width: 100%; /* Ajustado para el layout del padre */
  margin: 0 auto;
  padding: 20px;
}
</style>