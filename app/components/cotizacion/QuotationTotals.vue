<template>
    <div class="flex justify-end">
        <div class="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg border border-gray-200 shadow-lg">
            <h3 class="font-bold text-xl mb-3 text-gray-800">Resumen de Totales</h3>
            <div class="space-y-3 text-sm text-gray-700">
                <div class="flex justify-between font-bold text-lg text-green-700 border-t pt-2">
                    <span>SUBTOTAL (Neto de Ítems):</span>
                    <span>{{ formatCurrency(totals.subtotal) }}</span>
                </div>
                <div class="flex justify-between text-base">
                    <span>Impuesto ({{ totals.taxRateDisplay }}%):</span>
                    <span class="font-semibold text-red-600">{{ formatCurrency(totals.tax) }}</span>
                </div>
                <div class="flex justify-between font-extrabold text-xl text-blue-700 border-t border-gray-300 pt-3">
                    <span>TOTAL A PAGAR:</span>
                    <span>{{ formatCurrency(totals.total) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    totals: Object,
    formatCurrency: Function,
});
</script>
