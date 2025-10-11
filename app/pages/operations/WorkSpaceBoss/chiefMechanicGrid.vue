<template>
  <UDashboardPanel>

    <div class="p-8">
      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :row-alternation-enabled="true"
      >
        <DxColumn data-field="numero" caption="Orden" :width="100" />
        <DxColumn data-field="cliente" caption="Cliente" />
        <DxColumn data-field="placa" caption="Placa" :width="100" />
        <DxColumn data-field="marca" caption="Vehículo" />
        <DxColumn data-field="diagnosticoMecanico" caption="Diagnóstico del Mecánico" />
        <DxColumn data-field="estado" caption="Estado" :width="120" />
        <DxColumn type="buttons" caption="Acciones" :width="120">
          <DxButton @click="onAprobarClick" text="Aprobar" hint="Aprobar orden" />
          <DxButton @click="onDevolverClick" text="Devolver" hint="Devolver orden" />
        </DxColumn>
      </DxDataGrid>
    </div>
  </UDashboardPanel>
</template>

<script setup>
import { computed } from 'vue';
import { useOrdenesStore } from '~/store/ordenes.ts';
import DxDataGrid, { DxColumn, DxButton } from 'devextreme-vue/data-grid';

const ordenesStore = useOrdenesStore();

// Usamos una propiedad computada para combinar todas las órdenes en una sola lista
const dataSource = computed(() => {
  return [
    ...ordenesStore.terminadas.map(o => ({ ...o, estado: 'Terminada' })),
    ...ordenesStore.aprobadas.map(o => ({ ...o, estado: 'Aprobada' })),
    ...ordenesStore.devueltas.map(o => ({ ...o, estado: 'Devuelta' }))
  ];
});

const onAprobarClick = (e) => {
  ordenesStore.aprobarOrden(e.row.data);
};

const onDevolverClick = (e) => {
  ordenesStore.devolverOrden(e.row.data, 'Motivo de ejemplo'); // Aquí necesitarías un modal para el motivo
};
</script>
