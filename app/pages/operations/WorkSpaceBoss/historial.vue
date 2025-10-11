<template>
  <UDashboardPanel>
    <div class="bg-gray-100 py-10"> 
      <HistorialGeneral /> 
    </div>
  </UDashboardPanel>
</template>

<script setup>
import HistorialGeneral from '~/components/mecanicos/BossSpace/HistorialGeneral.vue'; 
import { useHistoryStore } from '~/store/historyStore';

const historyStore = useHistoryStore();

// Aseguramos que los datos iniciales se carguen.
historyStore.loadInitialHistory();
</script>