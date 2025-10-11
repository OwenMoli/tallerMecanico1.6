<template>
  <UDashboardPanel class="h-screen flex flex-col">
    <UDashboardNavbar title="Gestión del Taller">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>

    </UDashboardNavbar>

    <div class="flex w-full h-full space-x-6">
      <div class="flex-1 rounded-lg flex flex-col overflow-hidden">

        <!-- Tabs arriba -->
        <div class="flex w-full justify-center bg-transparent">
          <UTabs :items="items" v-model="currentView" class="bg-transparent" item-class="cursor-pointer" />
        </div>

        <!-- Contenido dinámico con scroll interno -->
        <div class="flex-1 bg-transparent">
          <BossReception v-if="currentView === 'receptions'" />

          <div v-if="currentView === 'tasks'" class="text-gray-500">
            <!-- ⬇️ aquí pasamos el array al hijo -->
            <BossKanban />
          </div>

          <div v-if="currentView === 'clients'" class="text-gray-500">
            <TableConfirm />
          </div>
        </div>
      </div>
    </div>
  </UDashboardPanel>
</template>

<script setup>
import { ref } from 'vue'

import BossReception from './BossReception.vue'
import BossKanban from './chiefMechanicDashboard.vue'
import TableConfirm from './historial.vue'


const items = [
  { label: 'Recepciones', icon: 'i-heroicons-clipboard-document-list-solid', value: 'receptions' },
  { label: 'Tareas Kanban', icon: 'i-heroicons-check-circle-solid', value: 'tasks' },
  { label: 'Tareas Completadas', icon: 'i-heroicons-user-group-solid', value: 'clients' },
]

const currentView = ref('receptions')



</script>
