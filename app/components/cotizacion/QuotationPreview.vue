<template>
    <div>
        <h3 class="font-semibold text-lg mb-4 mt-6 border-t pt-4">Vista Previa de la Cotización</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Cliente (Manual)</h4>
                <div class="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {{ client.nombre || 'N/A' }}</p>
                    <p><strong>Teléfono:</strong> {{ client.telefono || 'N/A' }}</p>
                    <p v-if="client.correo"><strong>Email:</strong> {{ client.correo }}</p>
                    <p v-if="client.direccion"><strong>Dirección:</strong> {{ client.direccion }}</p>
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="font-bold text-md mb-2 text-gray-800">Datos del Vehículo (Manual)</h4>
                <div class="space-y-2 text-sm">
                    <p><strong>Marca:</strong> {{ car.marca || 'N/A' }}</p>
                    <p><strong>Modelo:</strong> {{ car.modelo || 'N/A' }}</p>
                    <p><strong>Placa:</strong> {{ car.placa || 'N/A' }}</p>
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <h4 class="font-bold text-md mb-2 text-gray-800">Detalles de la Orden</h4>
                <div class="space-y-2 text-sm">
                    <p><strong>Asesor:</strong> {{ orderDetails.asesor || 'N/A' }}</p>
                    <p><strong>Vigencia:</strong> {{ orderDetails.vigenciaDias || 0 }} días</p>
                    <p><strong>Fecha:</strong> {{ formatDate(new Date(orderDetails.fechaCreacion || new Date())) }}</p>
                    <p><strong>Odómetro:</strong> {{ car.kilometraje || 0 }} Km</p>
                    <p><strong>VIN:</strong> {{ car.vin || 'No proporcionado' }}</p>
                </div>
            </div>
        </div>

        <QuotationItemsTable
            :jobs="selectedJobs"
            :total-subtotal="quotationTotals.subtotal"
            :format-currency="formatCurrency"
            :get-price-label="getPriceLabel"
            :get-job-subtotal="getJobSubtotal"
            @update:quantity="$emit('updateJobQuantity', $event.index, $event.value)"
            @update:service-cost="$emit('updateJobServiceCost', $event.index, $event.value)"
            @remove="$emit('removeJob', $event)"
        />

        <QuotationTotals :totals="quotationTotals" :format-currency="formatCurrency" />

        <div class="flex flex-col md:flex-row justify-between items-end md:items-center gap-3 mt-8 pt-4 border-t border-gray-300">
            <textarea
                :value="comments"
                @input="$emit('update:comments', $event.target.value)"
                placeholder="Notas o Comentarios Adicionales de la Cotización..."
                class="flex-grow p-3 border rounded-lg resize-none h-24 focus:ring-blue-500 focus:border-blue-500 w-full md:w-2/3"
            ></textarea>
            <div class="flex flex-col gap-3 w-full md:w-auto">
                <slot name="actions"></slot> </div>
        </div>
    </div>
</template>

<script setup>
import QuotationItemsTable from './QuotationItemsTable.vue';
import QuotationTotals from './QuotationTotals.vue';

defineProps({
    client: Object,
    car: Object,
    orderDetails: Object,
    selectedJobs: Array,
    quotationTotals: Object,
    comments: String,
    formatCurrency: Function,
    formatDate: Function,
    getPriceLabel: Function,
    getJobSubtotal: Function,
});

defineEmits(['updateJobQuantity', 'updateJobServiceCost', 'removeJob', 'update:comments']);
</script>
