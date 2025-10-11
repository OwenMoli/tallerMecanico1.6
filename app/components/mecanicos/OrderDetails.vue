<template>
  <div class="historial-container">
    <h2 class="text-2xl font-bold mb-6">Historial de Órdenes de Servicio</h2>
    
    <DxDataGrid
      :data-source="historial"
      :show-borders="true"
      :row-alternation-enabled="true"
      :column-auto-width="true"
    >
      <DxColumn data-field="ordenId" caption="ID de Orden" />
      <DxColumn data-field="mecanico" caption="Mecánico/Jefe" />
      <DxColumn data-field="etapa" caption="Etapa del Proceso" />
      <DxColumn data-field="evento" caption="Evento" />
      <DxColumn 
        data-field="hora" 
        caption="Hora del Evento" 
        data-type="datetime" 
        :format="{ month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }"
      />
      <DxColumn data-field="comentario" caption="Comentarios" />
      
      <DxPaging :page-size="10" />
      <DxPager
        :show-page-size-selector="true"
        :allowed-page-sizes="[5, 10, 20]"
        :show-info="true"
      />
      
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" :width="250" placeholder="Buscar..." />
    </DxDataGrid>
  </div>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxPager,
  DxFilterRow,
  DxSearchPanel
} from 'devextreme-vue/data-grid';

// Aquí simulamos los datos del historial. En una aplicación real,
// estos datos se cargarían desde una API.
const historial = [
  {
    id: 1,
    ordenId: 'PD01',
    mecanico: 'N/A',
    etapa: 'Recepción',
    evento: 'Vehículo recibido',
    hora: new Date('2025-09-04T14:00:00'),
    comentario: 'Vehículo de Luis Mendoza registrado en el sistema.'
  },
  {
    id: 2,
    ordenId: 'PD01',
    mecanico: 'Ana T.',
    etapa: 'Asignación',
    evento: 'Mecánico asignado',
    hora: new Date('2025-09-04T15:00:00'),
    comentario: 'Orden asignada a Ana T. para diagnóstico.'
  },
  {
    id: 3,
    ordenId: 'PD01',
    mecanico: 'Ana T.',
    etapa: 'Trabajo',
    evento: 'Diagnóstico iniciado',
    hora: new Date('2025-09-04T15:05:00'),
    comentario: 'Ana T. inicia la revisión de motor.'
  },
  {
    id: 4,
    ordenId: 'PD01',
    mecanico: 'Ana T.',
    etapa: 'Revisión',
    evento: 'Enviado para aprobación',
    hora: new Date('2025-09-04T16:30:00'),
    comentario: 'Trabajo de diagnóstico enviado al jefe para revisión.'
  },
  {
    id: 5,
    ordenId: 'PD01',
    mecanico: 'Jefe Mecánico',
    etapa: 'Aprobación',
    evento: 'Aprobado',
    hora: new Date('2025-09-04T16:45:00'),
    comentario: 'Jefe de mecánicos aprueba el diagnóstico y lo envía a cotización.'
  },
  {
    id: 6,
    ordenId: 'PD01',
    mecanico: 'N/A',
    etapa: 'Cotización',
    evento: 'Cotización enviada',
    hora: new Date('2025-09-04T17:00:00'),
    comentario: 'Cotización enviada al cliente. En espera de aprobación.'
  }
];
</script>

<style scoped>
.historial-container {
  padding: 20px;
}
</style>