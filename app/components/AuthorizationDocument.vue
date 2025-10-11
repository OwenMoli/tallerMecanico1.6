<template>
  <UDashboardPanel>
    <div class="signature-area">
      <h3>Firma del Cliente</h3>
      <canvas ref="signaturePad" class="signature-canvas"></canvas>
    </div>
    <UButton @click="generateAndSignDocument">Finalizar y Firmar</UButton>
  </UDashboardPanel>
</template>

<script setup>
import jsPDF from 'jspdf';
import SignaturePad from 'signature_pad';
import { useReceptionStore } from '~/store/reception';

const receptionStore = useReceptionStore();
const signaturePadRef = ref(null);
let signaturePadInstance;

onMounted(() => {
  signaturePadInstance = new SignaturePad(signaturePadRef.value);
});

async function generateAndSignDocument() {
  // 1. Crear el PDF con los datos del store
  const doc = new jsPDF();
  doc.text(`Cliente: ${receptionStore.client.nombre}`, 10, 10);
  doc.text(`Vehículo: ${receptionStore.car.modelo}`, 10, 20);
  // ... más datos del store

  // 2. Obtener la firma como imagen
  const signatureDataUrl = signaturePadInstance.toDataURL();
  doc.addImage(signatureDataUrl, 'PNG', 10, 200, 100, 40);

  // 3. Subir el documento y los datos al backend
  // Aquí iría tu lógica de API para enviar el PDF y los datos consolidados.
  // await someApiService.uploadDocument(doc.output('blob'));

  // 4. Limpiar el store para una nueva recepción
  receptionStore.resetReception();

  alert('¡Recepción finalizada y documento generado!');
}
</script>
