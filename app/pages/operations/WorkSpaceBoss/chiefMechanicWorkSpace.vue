<template>
  <UDashboardPanel>
    <UDashboardNavbar title="Dashboard del Jefe Mecánico">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      </UDashboardNavbar>

    <div class="flex w-full justify-center p-4">
      <UTabs :items="items" v-model="currentView" />
    </div>

    <div class="p-8">
      <JefeDashboard v-if="currentView === 'kanban'" />
      <JefeGrid v-if="currentView === 'datagrid'" />
      <PruebasGrid v-if="currentView === 'pruebas'" />
    </div>
  </UDashboardPanel>
</template>

<script setup>
import { ref } from 'vue';
import JefeDashboard from './chiefMechanicDashboard.vue'; // Assumes the Kanban component is here
import JefeGrid from './chiefMechanicGrid.vue';    
import PruebasGrid from '~/components/carGallery/addColor.vue';

// Assumes the DataGrid component is here

const items = [{
  label: 'Tablero',
  icon: 'i-heroicons-squares-2x2-solid',
  value: 'kanban'
}, {
  label: 'Tabla',
  icon: 'i-heroicons-table-cells-solid',
  value: 'datagrid'
},

{
  label: 'pruebas',
  icon: 'i-heroicons-table-cells-solid',
  value: 'pruebas'
}];

const currentView = ref('kanban'); // 'kanban' is the default view
</script>