<template>
  <div class="flex justify-end">
    <div class="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="font-bold text-xl mb-3 text-gray-800">Resumen de Totales</h3>
      <div class="space-y-3 text-sm text-gray-700">
        <div class="flex justify-between font-bold text-lg text-green-700 border-t pt-2">
          <span>SUBTOTAL (Neto de Ítems):</span>
          <span>L. {{ summary.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-base">
          <span>Impuesto ({{ summary.taxRateDisplay }}%):</span>
          <span class="font-semibold text-red-600">L. {{ summary.tax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-extrabold text-xl text-blue-700 border-t border-gray-300 pt-3">
          <span>TOTAL A PAGAR:</span>
          <span>L. {{ summary.total.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  summary: { type: Object, required: true },
});
</script>
