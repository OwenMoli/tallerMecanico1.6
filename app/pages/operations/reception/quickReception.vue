<template>
  <div class="main-layout">
    <div class="content-container">
      <div v-if="!showGeneralTable" class="datagrid-container">
        <h1 class="page-title">{{ gridTitle }}</h1>
        <DxDataGrid
          :data-source="activeData"
          :key="dataRefreshKey"
          :show-borders="true"
          :key-expr="keyExpr"
          :allow-column-reordering="true"
          :row-alternation-enabled="false"
          :paging="{ pageSize: 20 }"
          :pager="pagerConfig"
          @exporting="onExporting"
          :width="'100%'"
          :column-auto-width="true"
          :allow-column-resizing="true"
        >
          <DxFilterRow :visible="true" />
          <DxHeaderFilter :visible="true" />
          <DxSearchPanel :visible="true" :width="250" />
          <DxColumnChooser :enabled="true" mode="select" title="Seleccionar Columnas" />
          <DxExport :enabled="true" :file-name="reportFileName" />

          <DxToolbar>
            <DxItem location="before">
              <button
                class="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 flex items-center gap-2"
                @click="showAddModal = true"
              >
                + Agregar Cliente
              </button>
            </DxItem>
            <DxItem location="after" template="switch-template" />
            <DxItem location="after">
              <dx-button text="Refrescar" icon="refresh" @click="refreshData" />
            </DxItem>
            <DxItem location="after">
              <button @click="showGeneralTable = true" class="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-600 flex items-center gap-2">
                Mostrar Tabla General
              </button>
            </DxItem>
            <DxItem location="after" name="columnChooserButton" />
            <DxItem location="after" name="searchPanel" />
            <DxItem location="after" name="exportButton" />
          </DxToolbar>

          <template #switch-template>
            <div class="flex items-center space-x-2">
              <span>{{ isJuridico ? 'Clientes Jurídicos' : 'Clientes Naturales' }}</span>
              <input
                type="checkbox"
                id="client-type-switch"
                class="client-switch"
                v-model="isJuridico"
                aria-label="Alternar tipo de cliente"
              />
            </div>
          </template>

          <DxColumn
            v-for="column in activeColumns"
            :key="column.key"
            :data-field="column.key"
            :caption="column.label"
            :alignment="column.alignment"
            :allow-header-filtering="column.allowHeaderFiltering"
            :width="column.width"
            :visible="column.visible"
          />

          <DxColumn type="buttons" caption="Acciones" :width="160">
            <DxButton icon="search" hint="Ver Detalles" :on-click="onDetailClick" />
            <DxButton icon="car" hint="Ver Vehículos" :on-click="onViewVehiclesClick" />
            <DxButton icon="edit" hint="Editar" :on-click="onEditClick" />
            <DxButton icon="trash" hint="Eliminar" :on-click="onDeleteClick" />
          </DxColumn>
        </DxDataGrid>
      </div>

      <div v-else class="datagrid-container">
        <h1 class="page-title">Tabla General de Clientes</h1>
        <DxDataGrid
          :data-source="generalData"
          :show-borders="true"
          :key-expr="keyExpr"
          :allow-column-reordering="true"
          :row-alternation-enabled="false"
          :paging="{ pageSize: 20 }"
          :pager="pagerConfig"
          @exporting="onExporting"
          :width="'100%'"
          :column-auto-width="true"
          :allow-column-resizing="true"
        >
          <DxFilterRow :visible="true" />
          <DxHeaderFilter :visible="true" />
          <DxSearchPanel :visible="true" :width="250" />
          <DxColumnChooser :enabled="true" mode="select" title="Seleccionar Columnas" />
          <DxExport :enabled="true" file-name="Reporte General de Clientes" />

          <DxToolbar>
            <DxItem location="before">
              <button
                class="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 flex items-center gap-2"
                @click="showAddModal = true"
              >
                + Agregar Cliente
              </button>
            </DxItem>
            <DxItem location="after">
              <button @click="showGeneralTable = false" class="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-600 flex items-center gap-2">
                Mostrar Tablas Separadas
              </button>
            </DxItem>
            <DxItem location="after" name="columnChooserButton" />
            <DxItem location="after" name="searchPanel" />
            <DxItem location="after" name="exportButton" />
          </DxToolbar>

          <DxColumn
            v-for="column in generalColumns"
            :key="column.key"
            :data-field="column.key"
            :caption="column.label"
            :visible="column.visible"
            :alignment="column.alignment"
            :allow-header-filtering="column.allowHeaderFiltering"
            :width="column.width"
          />

          <DxColumn type="buttons" caption="Acciones" :width="160">
            <DxButton icon="search" hint="Ver Detalles" :on-click="onDetailClick" />
            <DxButton icon="car" hint="Ver Vehículos" :on-click="onViewVehiclesClick" />
            <DxButton icon="edit" hint="Editar" :on-click="onEditClick" />
            <DxButton icon="trash" hint="Eliminar" :on-click="onDeleteClick" />
          </DxColumn>
        </DxDataGrid>
      </div>

      <div v-if="showVehicles" class="mt-8" ref="vehiclesSectionRef">
        <CarSelection @hide-vehicles="showVehicles = false" />
      </div>

      <AddClientModal
        v-if="showAddModal"
        v-model:open="showAddModal"
        @client-added="handleAddClient"
      />
      <DetailModal
        v-if="showDetailModal"
        v-model:open="showDetailModal"
        :client-data="selectedClient"
        :client-type="selectedClientType"
      />
      <EditClientModal
        v-if="showEditModal"
        v-model:open="showEditModal"
        :client-data="selectedClient"
        :client-type="selectedClientType"
        @client-updated="handleClientUpdated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useReceptionStore } from '~/store/reception';

// Importaciones de DevExtreme
import {
  DxDataGrid,
  DxColumn,
  DxToolbar,
  DxItem,
  DxColumnChooser,
  DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel,
  DxButton,
  DxExport
} from 'devextreme-vue/data-grid';

import { confirm } from 'devextreme/ui/dialog';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

// Importaciones de componentes
import AddClientModal from '~/components/clientReception/AddClientModal.vue';
import DetailModal from '~/components/customers/ClientDetailModal.vue';
import EditClientModal from '~/components/customers/EditClientModal.vue';
import CarSelection from './quickVehicle.vue';

const route = useRoute();
const router = useRouter();
const receptionStore = useReceptionStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDetailModal = ref(false);
const showVehicles = ref(false);
const showGeneralTable = ref(false);

const selectedClient = ref(null);
const selectedClientType = ref('');
const selectedClientId = ref(null);
const selectedClientName = ref('');

const isJuridico = ref(route.query.cliente === 'juridico');
const currentStep = ref(1);
const dataRefreshKey = ref(0);
const vehiclesSectionRef = ref(null);

const naturalClients = ref([]);
const juridicalClients = ref([]);

const dataUrl = 'https://gist.githubusercontent.com/OwenMoli/f9113649947b77740e1f249b745a991d/raw/1b5b4b33816f72f8ab1b13aa815eb87cc1605bd0/gistfile1.txt';

const fetchData = async () => {
  try {
    const response = await axios.get(dataUrl);
    naturalClients.value = response.data.naturales ?? [];
    juridicalClients.value = response.data.juridicos ?? [];
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
};

onMounted(() => fetchData());

watch(showVehicles, (newValue) => currentStep.value = newValue ? 2 : 1);
watch(isJuridico, (newValue) => {
  router.push({ query: { cliente: newValue ? 'juridico' : 'natural' } });
  showVehicles.value = false;
});
watch(() => route.query.cliente, (newType) => isJuridico.value = newType === 'juridico');

const activeData = computed(() => {
    const data = isJuridico.value ? juridicalClients.value : naturalClients.value;
    return data.map(item => {
        if (isJuridico.value) {
            return {
                ...item,
                cliente: item.empresaNombre
            };
        } else {
            return {
                ...item,
                cliente: `${item.nombre} ${item.apellido}`
            };
        }
    });
});
const keyExpr = computed(() => 'id');

const naturalColumns = [
    { key: 'cliente', label: 'Cliente', visible: true, allowHeaderFiltering: true },
    { key: 'nombre', label: 'Nombre', visible: false, allowHeaderFiltering: true },
    { key: 'apellido', label: 'Apellido', visible: false, allowHeaderFiltering: true },
    { key: 'tipoDocumento', label: 'Tipo de Documento', allowHeaderFiltering: true },
    { key: 'numeroIdentificacion', label: 'No. Identificación', allowHeaderFiltering: true },
    { key: 'rtn', label: 'RTN', allowHeaderFiltering: true },
    { key: 'telefono', label: 'Teléfono', allowHeaderFiltering: true },
    { key: 'correo', label: 'Correo Electrónico', allowHeaderFiltering: true },
    { key: 'direccion', label: 'Dirección', allowHeaderFiltering: true },
    { key: 'sexo', label: 'Sexo', allowHeaderFiltering: true, width: 60, alignment: 'center' },
];

const juridicoColumns = [
    { key: 'cliente', label: 'Cliente', visible: true, allowHeaderFiltering: true },
    { key: 'empresaNombre', label: 'Nombre de la Empresa', visible: false, allowHeaderFiltering: true },
    { key: 'empresaRubro', label: 'Rubro', allowHeaderFiltering: true },
    { key: 'empresaRtn', label: 'RTN de la Empresa', allowHeaderFiltering: true },
    { key: 'empresaDireccion', label: 'Dirección de la Empresa', allowHeaderFiltering: true },
    { key: 'contactoNombre', label: 'Nombre del Contacto', allowHeaderFiltering: true },
    { key: 'contactoApellido', label: 'Apellido del Contacto', allowHeaderFiltering: true },
    { key: 'contactoCargo', label: 'Cargo', allowHeaderFiltering: true },
    { key: 'contactoTelefono', label: 'Teléfono del Contacto', allowHeaderFiltering: true },
    { key: 'contactoCorreo', label: 'Correo del Contacto', allowHeaderFiltering: true },
    { key: 'contactoDireccion', label: 'Dirección del Contacto', allowHeaderFiltering: true },
];

const generalColumns = [
    { key: 'tipoCliente', label: 'Tipo de Cliente', visible: true, allowHeaderFiltering: true },
    { key: 'cliente', label: 'Cliente', visible: true, allowHeaderFiltering: true },
    { key: 'tipoDocumento', label: 'Tipo de Documento', visible: true, allowHeaderFiltering: true },
    { key: 'numeroIdentificacion', label: 'No. Identificación', visible: true, allowHeaderFiltering: true },
    { key: 'rtn', label: 'RTN', visible: true, allowHeaderFiltering: true },
    { key: 'empresaRtn', label: 'RTN de la Empresa', visible: true, allowHeaderFiltering: true },
    { key: 'correo', label: 'Correo', visible: true, allowHeaderFiltering: true },
    { key: 'direccion', label: 'Dirección', visible: true, allowHeaderFiltering: true },
    { key: 'empresaDireccion', label: 'Dirección de la Empresa', visible: true, allowHeaderFiltering: true },

    { key: 'nombre', label: 'Nombre', visible: false, allowHeaderFiltering: true },
    { key: 'apellido', label: 'Apellido', visible: false, allowHeaderFiltering: true },
    { key: 'sexo', label: 'Sexo', visible: false, allowHeaderFiltering: true, alignment: 'center' },
    { key: 'telefono', label: 'Teléfono', visible: false, allowHeaderFiltering: true },
    { key: 'empresaNombre', label: 'Nombre de la Empresa', visible: false, allowHeaderFiltering: true },
    { key: 'empresaRubro', label: 'Rubro', visible: false, allowHeaderFiltering: true },
    { key: 'contactoNombre', label: 'Nombre del Contacto', visible: false, allowHeaderFiltering: true },
    { key: 'contactoApellido', label: 'Apellido del Contacto', visible: false, allowHeaderFiltering: true },
    { key: 'contactoCargo', label: 'Cargo', visible: false, allowHeaderFiltering: true },
    { key: 'contactoTelefono', label: 'Teléfono del Contacto', visible: false, allowHeaderFiltering: true },
    { key: 'contactoCorreo', label: 'Correo del Contacto', visible: false, allowHeaderFiltering: true },
    { key: 'contactoDireccion', label: 'Dirección del Contacto', visible: false, allowHeaderFiltering: true },
];

const activeColumns = computed(() => isJuridico.value ? juridicoColumns : naturalColumns);
const gridTitle = computed(() => isJuridico.value ? 'Clientes Jurídicos' : 'Clientes Naturales');
const reportFileName = computed(() => isJuridico.value ? 'Reporte de Clientes Jurídicos' : 'Reporte de Clientes Naturales');

const pagerConfig = { visible: true, showPageSizeSelector: true, allowedPageSizes: [20, 30, 40], showInfo: true, showNavigationButtons: true };

const generalData = computed(() => {
    const naturalesNormalizados = naturalClients.value.map(c => ({
        ...c,
        cliente: `${c.nombre} ${c.apellido}`,
        tipoCliente: 'Natural'
    }));
    const juridicosNormalizados = juridicalClients.value.map(c => ({
        ...c,
        cliente: c.empresaNombre,
        tipoCliente: 'Jurídico'
    }));
    return [...naturalesNormalizados, ...juridicosNormalizados];
});

const refreshData = () => { dataRefreshKey.value++; showVehicles.value = false; };

const handleAddClient = (client) => {
  const list = client.tipo === 'natural' ? naturalClients.value : juridicalClients.value;
  const newId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
  list.push({ ...client.data, id: newId });
  dataRefreshKey.value++;
};

const handleClientUpdated = (updatedClient) => {
  const list = isJuridico.value ? juridicalClients.value : naturalClients.value;
  const index = list.findIndex(c => c.id === updatedClient.id);
  if (index !== -1) list[index] = updatedClient;
  dataRefreshKey.value++;
};

const scrollToSection = (refEl) => {
  nextTick(() => {
    if (refEl.value) {
      refEl.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

const onDetailClick = (e) => {
  const clientType = showGeneralTable.value ?
    (e.row.data.tipoCliente === 'Jurídico' ? 'juridico' : 'natural') :
    (isJuridico.value ? 'juridico' : 'natural');
  selectedClientType.value = clientType;
  selectedClient.value = e.row.data;
  showDetailModal.value = true;
};

const onViewVehiclesClick = (e) => {
  const data = e.row.data;
  receptionStore.setClient({ ...data, email: data.correo });
  showVehicles.value = true;
  scrollToSection(vehiclesSectionRef);
};

const onEditClick = (e) => {
  const clientType = showGeneralTable.value ?
    (e.row.data.tipoCliente === 'Jurídico' ? 'juridico' : 'natural') :
    (isJuridico.value ? 'juridico' : 'natural');
  selectedClientType.value = clientType;
  selectedClient.value = e.row.data;
  showEditModal.value = true;
};

const onDeleteClick = async (e) => {
  const data = e.row.data;
  const clientName = data?.nombre || data?.empresaNombre || 'Cliente';
  const result = await confirm(`¿Está seguro de que desea eliminar al cliente ${clientName}?`, 'Confirmar Eliminación');
  if(result){
    const list = showGeneralTable.value ?
      (data?.tipoCliente === 'Jurídico' ? juridicalClients.value : naturalClients.value) :
      (isJuridico.value ? juridicalClients.value : naturalClients.value);
    const clientId = data?.id;
    if(clientId != null) list.splice(list.findIndex(c => c.id === clientId), 1);
  }
};

const onExporting = (e) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(e.fileName);
  exportDataGrid({ worksheet, component: e.component }).then(() => {
    workbook.xlsx.writeBuffer().then(buffer => saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${e.fileName}.xlsx`));
  });
};

const steps = [
  { id: 1, label: 'Buscar Cliente' },
  { id: 2, label: 'Buscar Vehículo' },
  { id: 3, label: 'Recepción de Vehículo' },
  { id: 4, label: 'Chequeo del Vehículo' },
];

const formatNullCellTemplate = (container, options) => {
  container.textContent = options.value;
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: hidden;
  padding: 0;
  margin: 0;
}

.content-container {
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 20px 100px;
  scrollbar-width: none;
}
.content-container::-webkit-scrollbar { display: none; }

.datagrid-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px;
  margin-bottom: 20px;
}

.page-title {
  text-align: center;
  margin: 40px 0 20px;
  font-size: 2.5em;
  color: #2c3e50;
  font-weight: bold;
}

.client-switch {
  position: relative;
  width: 44px;
  height: 24px;
  -webkit-appearance: none;
  background: #c6c6c6;
  outline: none;
  border-radius: 20px;
  transition: 0.4s;
}
.client-switch:before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  top: 2px; left: 2px;
  background: #fff;
  transition: 0.4s;
}
.client-switch:checked { background: #34c759; }
.client-switch:checked:before { transform: translateX(20px); }

/* Barra de progreso */
.progress-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  text-align: center;
  transition: color 0.3s;
}
.progress-step.active { color: #1f2937; font-weight: bold; }

.step-icon {
  width: 2rem; height: 2rem;
  display: flex; align-items: center; justify-content: center;
  background-color: #d1d5db; color: #4b5563;
  border-radius: 9999px; font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}
.progress-line {
  height: 2px; width: 4rem;
  background-color: #d1d5db;
  transition: background-color 0.3s;
}
.progress-line.active { background-color: #2563eb; }
</style>
