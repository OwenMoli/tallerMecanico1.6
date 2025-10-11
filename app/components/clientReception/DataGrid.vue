<template>
  <div class="dx-datagrid-container">
    <div class="top-section">
      <div class="toggle-container">
        <label class="switch">
          <input type="checkbox" :checked="isJuridico" @change="emitToggle" />
          <span class="slider"></span>
        </label>
        <span class="client-type-label">
          {{ isJuridico ? 'Clientes Jurídicos' : 'Clientes Naturales' }}
        </span>
      </div>
      <div class="button-container">
        <NuxtLink to="/operations/reception/addClient">
          <DxButton
            text="Agregar Cliente"
            type="success"
            class="add-button"
          />
        </NuxtLink>
      </div>
    </div>

    <DxDataGrid
      :data-source="data"
      :show-borders="true"
      :row-alternation-enabled="true"
    >
      <DxLoadPanel :enabled="false" />
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxSearchPanel :visible="true" :width="240" placeholder="Buscar..." />
      <DxPaging :page-size="10" />
      <DxPager
        :show-page-size-selector="true"
        :allowed-page-sizes="[10, 20]"
        :show-info="true"
      />
      <DxSelection
        mode="multiple"
        select-by-click="true"
        :show-check-boxes-mode="'onClick'"
      />

      <DxColumn
        v-for="column in columns"
        :key="column.key"
        :data-field="column.key"
        :caption="column.label"
        :allow-filtering="column.filterable"
      />

      <DxColumn
        v-if="hasActions"
        caption="Acciones"
        cell-template="action-cell"
        :allow-filtering="false"
        :allow-sorting="false"
        :width="150"
      />

      <template #action-cell="{ data: cellData }">
        <DxButton
          text="Ver Vehículos"
          type="default"
          class="link-button"
          @click="$emit('action:view-vehicles', cellData.data)"
        />
      </template>
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
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLoadPanel,
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  hasActions: {
    type: Boolean,
    default: false,
  },
  isJuridico: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-client-type', 'action:view-vehicles']); // Asegúrate de emitir el evento 'action:view-vehicles'

function emitToggle(event) {
  emit('toggle-client-type', event.target.checked);
}
</script>

<style scoped>
/* Tu estilo original... */
.dx-datagrid-container {
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.toggle-container {
  display: flex;
  align-items: center;
}
.button-container {
  margin-left: auto;
}
.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  font-size: 1em;
  font-weight: bold;
}
.title {
  display: none;
}
.dx-datagrid-container :deep(.dx-datagrid-headers .dx-datagrid-table .dx-row > td) {
  background-color: #f5f5f5;
  font-weight: bold;
}
.dx-datagrid-container :deep(.dx-datagrid-rowsview .dx-row-alt) {
  background-color: #fafafa;
}
.dx-datagrid-container :deep(.dx-row-hover) {
  background-color: #e0f7fa !important;
}
.dx-datagrid-container :deep(.dx-datagrid-selected-row) {
  background-color: #e6f7ff !important;
}
.link-button {
  padding: 8px 12px;
  background-color: #478edf;
  color: #f7efef;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9em;
  transition: background-color 0.3s;
}
.link-button:hover {
  background-color: #e0e0e0;
}
.switch { position: relative; display: inline-block; width: 60px; height: 34px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #2196F3; }
input:checked + .slider:before { transform: translateX(26px); }
.client-type-label { margin-left: 15px; font-size: 1.1em; font-weight: bold; color: #555; }
</style>