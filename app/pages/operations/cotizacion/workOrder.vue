<template>
  <UDashboardPanel class="overflow-auto">
    <UDashboardNavbar title="Órdenes de Trabajo">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-8 min-h-screen">
      <UInput
        icon="i-heroicons-magnifying-glass-20-solid"
        size="md"
        placeholder="Buscar OT por placa, cliente, ID..."
        class="flex-grow mb-8"
        v-model="search"
      />
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-1/2 flex flex-col gap-4">
          <p v-if="filteredWorkOrders.length === 0" class="text-gray-500">
            {{ search ? `No se encontraron órdenes para "${search}"` : 'No hay órdenes de trabajo para mostrar.' }}
          </p>
                  <div v-for="wo in filteredWorkOrders" :key="wo.id" @click="selectWorkOrder(wo)"
             class="p-4 bg-white rounded-lg shadow cursor-pointer border-l-4 transition-colors"
             :class="selectedWorkOrder?.id === wo.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'">
            <div class="flex justify-between items-center">
                <h3 class="font-bold text-lg">{{ wo.vehicle.brand }} {{ wo.vehicle.model }} - <span class="text-blue-600">{{ wo.plate }}</span></h3>
                <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="statusColor(wo.status)">{{ wo.status }}</span>
            </div>
            <p class="text-sm text-gray-600">Cliente: {{ wo.client.name }}</p>
            <p class="text-sm text-gray-500">ID: {{ wo.id }} | Total: {{ formatCurrency(wo.total) }}</p>
          </div>
        </div>
        <div class="w-full lg:w-1/2">
                    <div v-if="selectedWorkOrder" class="p-6 bg-white rounded-lg shadow sticky top-4">
            <h2 class="text-2xl font-bold mb-4">Detalle de la OT: {{ selectedWorkOrder.id }}</h2>
            <p><strong>Estado:</strong> {{ selectedWorkOrder.status }}</p>
            <p><strong>Cliente:</strong> {{ selectedWorkOrder.client.name }} ({{ selectedWorkOrder.client.phone }})</p>
            <p><strong>Vehículo:</strong> {{ selectedWorkOrder.vehicle.brand }} {{ selectedWorkOrder.vehicle.model }} ({{ selectedWorkOrder.plate }})</p>
            <h4 class="font-bold mt-4 mb-2">Items Aprobados:</h4>
            <ul class="list-disc pl-5 text-sm max-h-40 overflow-y-auto">
                <li v-for="(item, index) in selectedWorkOrder.items" :key="index">
                    {{ item.descripcion }} - {{ formatCurrency((item.manoDeObra || 0) + (item.valorRepuesto || 0)) }}
                </li>
            </ul>
            <div class="mt-6 flex gap-4">
                <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Marcar como Finalizada</button>
                <button @click="generateWorkOrderPdf" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Imprimir OT</button>
            </div>
            <iframe v-if="workOrderPdfUrl" :src="workOrderPdfUrl" class="w-full h-96 mt-4 border" title="Vista previa del PDF de la Orden de Trabajo"></iframe>
          </div>
          <div v-else class="p-6 bg-white rounded-lg shadow text-center text-gray-500">
            <p>Selecciona una orden de trabajo de la lista para ver sus detalles.</p>
          </div>
        </div>
      </div>
    </div>
  </UDashboardPanel>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWorkOrderStore } from '~/store/workOrder';
import { storeToRefs } from 'pinia';
import type { WorkOrder, WorkOrderStatus } from '~/types/workorder';

const workOrderStore = useWorkOrderStore();
const { workOrders, selectedWorkOrder, workOrderPdfUrl } = storeToRefs(workOrderStore);

const search = ref('');

const filteredWorkOrders = computed(() => {
    if (!search.value) return workOrders.value;
    const term = search.value.toLowerCase();
    return workOrders.value.filter(wo =>
        wo.plate.toLowerCase().includes(term) ||
        wo.client.name.toLowerCase().includes(term) ||
        wo.id.toLowerCase().includes(term)
    );
});

const selectWorkOrder = (wo: WorkOrder) => {
    workOrderStore.clearWorkOrderPdfUrl();
    workOrderStore.selectWorkOrder(wo);
};

const generateWorkOrderPdf = () => {
    workOrderStore.generateWorkOrderPdf();
};

const statusColor = (status: WorkOrderStatus) => {
    switch (status) {
        case 'Pendiente': return 'bg-yellow-200 text-yellow-800';
        case 'En Progreso': return 'bg-blue-200 text-blue-800';
        case 'Finalizada': return 'bg-green-200 text-green-800';
        default: return 'bg-gray-200 text-gray-800';
    }
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(value || 0);
};

// ✅ === INICIO DE LA CORRECCIÓN === ✅
onMounted(() => {
    // Intenta obtener el primer elemento del array.
    const firstWorkOrder = workOrders.value[0];

    // Comprueba si no hay una OT seleccionada Y si el primer elemento realmente existe.
    if (!selectedWorkOrder.value && firstWorkOrder) {
        // Ahora TypeScript está seguro de que 'firstWorkOrder' es de tipo 'WorkOrder' y no 'undefined'.
        selectWorkOrder(firstWorkOrder);
    }
});
// ✅ === FIN DE LA CORRECCIÓN === ✅
</script>
