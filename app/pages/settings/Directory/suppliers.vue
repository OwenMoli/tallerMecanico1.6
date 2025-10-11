<template>
  <div class="dx-page">
    <div class="datagrid-container">
      <DxDataGrid
        :data-source="proveedores"
        :show-borders="true"
        key-expr="ID_Proveedor"
        :allow-column-reordering="true"
        :row-alternation-enabled="false"
        :paging="{ pageSize: 10 }"
        :pager="{
          visible: true,
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 30, 40],
          showInfo: true,
          showNavigationButtons: true,
        }"
        @exporting="onExporting"
      >
        <DxFilterRow :visible="true" />
        <DxSearchPanel :visible="true" :width="250" />

        <DxToolbar>
          <DxItem location="before">
            <div>
              <button
                class="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 flex items-center gap-2"
                @click="showAddModal = true"
              >
                + Agregar Proveedor
              </button>
            </div>
          </DxItem>
          <DxItem location="after">
            <dx-button
              text="Refrescar"
              icon="refresh"
              @click="refreshData"
            />
          </DxItem>
          <DxItem location="after" name="columnChooserButton" />
          <DxItem location="after" name="searchPanel" />
          <DxItem location="after" name="exportButton" />
        </DxToolbar>

        <DxExport :enabled="true" file-name="Reporte de Proveedores" />

        <DxColumnChooser :enabled="true" mode="select" title="Selecionar Columnas"/>

        <DxColumn data-field="ID_Proveedor" caption="ID" :width="70" />
        <DxColumn data-field="NombreProveedor" caption="Nombre Proveedor" />
        <DxColumn data-field="NombreContacto" caption="Nombre Contacto" />
        <DxColumn data-field="Teléfono" caption="Teléfono" />
        <DxColumn data-field="CorreoElectrónico" caption="Email" />
        <DxColumn data-field="Dirección" caption="Dirección" />
        <DxColumn data-field="Ciudad" caption="Ciudad" />
        <DxColumn data-field="País" caption="País" />
        <DxColumn data-field="RTN" caption="RTN" />
        <DxColumn data-field="TipoProveedor" caption="Tipo Proveedor" />

        <DxColumn type="buttons" caption="Acciones" :width="110">
          <DxButton icon="edit" hint="Editar" :on-click="onEditClick" />
          <DxButton icon="trash" hint="Eliminar" :on-click="onDeleteClick" />
          <DxButton icon="search" hint="Ver Detalles" :on-click="onViewClick" />
        </DxColumn>
      </DxDataGrid>
    </div>
    <AddProveedorModal v-model:open="showAddModal" @proveedor-added="handleAddProveedor" />
    <ViewProveedorModal v-model:open="showViewModal" :proveedor-data="selectedProveedor" />
    <EditProveedorModal
      v-model:open="showEditModal"
      :proveedor-data="selectedProveedor"
      @proveedor-updated="handleUpdateProveedor"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxToolbar,
  DxItem,
  DxColumnChooser,
  DxFilterRow,
  DxSearchPanel,
  DxButton,
  DxExport
} from 'devextreme-vue/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import AddProveedorModal from './AddSupplierModal.vue';
import ViewProveedorModal from './ViewSupplierModal.vue';
import EditProveedorModal from './EditSupplierModal.vue';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

const showAddModal = ref(false);
const showViewModal = ref(false);
const showEditModal = ref(false);
const selectedProveedor = ref(null);
const proveedores = ref([]);

const loadProveedores = () => {
  proveedores.value = [
    { ID_Proveedor: 1, NombreProveedor: 'AutoPartes S.A.', NombreContacto: 'Ana García', Teléfono: '9988-7766', CorreoElectrónico: 'ana@autopartes.com', Dirección: 'Calle 10', Ciudad: 'Tegucigalpa', País: 'Honduras', RTN: '08011985123456', TipoProveedor: 'Repuestos' },
    { ID_Proveedor: 2, NombreProveedor: 'Lubricantes del Atlántico', NombreContacto: 'Juan Pérez', Teléfono: '8877-6655', CorreoElectrónico: 'juan@lubricantes.com', Dirección: 'Ave. Los Pinos', Ciudad: 'San Pedro Sula', País: 'Honduras', RTN: '08011990987654', TipoProveedor: 'Lubricantes' },
    { ID_Proveedor: 3, NombreProveedor: 'Honduras Herramientas', NombreContacto: 'Pedro Gómez', Teléfono: '3322-1100', CorreoElectrónico: 'pedro@hondurasherramientas.hn', Dirección: 'Blvd. Suyapa', Ciudad: 'Tegucigalpa', País: 'Honduras', RTN: '08012000010203', TipoProveedor: 'Herramientas' },
    { ID_Proveedor: 4, NombreProveedor: 'Servicios de Taller Express', NombreContacto: 'Carlos López', Teléfono: '9988-5544', CorreoElectrónico: 'carlos@tallerxpress.com', Dirección: 'Calle Principal', Ciudad: 'San Pedro Sula', País: 'Honduras', RTN: '08011995040506', TipoProveedor: 'Servicios externos' },
  ];
};

const refreshData = () => {
  loadProveedores();
};

const onEditClick = (e) => {
  selectedProveedor.value = { ...e.row.data };
  showEditModal.value = true;
};

const onDeleteClick = async (e) => {
  const result = await confirm(`¿Está seguro de que desea eliminar al proveedor <b>${e.row.data.NombreProveedor}</b>?`, 'Confirmar Eliminación');

  if (result) {
    const proveedorId = e.row.data.ID_Proveedor;
    proveedores.value = proveedores.value.filter(p => p.ID_Proveedor !== proveedorId);
    console.log('Proveedor eliminado:', e.row.data);
  } else {
    console.log('Eliminación cancelada.');
  }
};

const onViewClick = (e) => {
  selectedProveedor.value = e.row.data;
  showViewModal.value = true;
};

const handleAddProveedor = (newProveedor) => {
  const nextId = proveedores.value.length > 0
    ? Math.max(...proveedores.value.map(p => p.ID_Proveedor)) + 1
    : 1;
  const updatedProveedores = [
    ...proveedores.value,
    { ID_Proveedor: nextId, ...newProveedor }
  ];
  proveedores.value = updatedProveedores;
};

const handleUpdateProveedor = (updatedProveedor) => {
  const updatedProveedores = proveedores.value.map(p => {
    if (p.ID_Proveedor === updatedProveedor.ID_Proveedor) {
      return updatedProveedor;
    }
    return p;
  });
  proveedores.value = updatedProveedores;
};

// **NUEVA FUNCIÓN:** Maneja la exportación a Excel
const onExporting = (e) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Proveedores');

  exportDataGrid({
    worksheet: worksheet,
    component: e.component
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte de Proveedores.xlsx');
    });
  });
};

loadProveedores();
</script>

<style scoped>
/* Los estilos se mantienen igual */
.datagrid-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  overflow: hidden;
}

.dx-datagrid {
  border: none !important;
  font-family: Arial, sans-serif;
}

.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: transparent;
  color: #555;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
}

.dx-datagrid-rowsview .dx-row > td {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 18px 15px;
  text-align: left;
}

.dx-datagrid-rowsview .dx-row:last-child > td {
  border-bottom: none;
}

.dx-datagrid-rowsview .dx-row:hover {
  background-color: #f9f9f9;
}

.dx-datagrid-filter-row > .dx-row > td {
  background-color: transparent !important;
  border: none !important;
  padding-top: 5px;
  padding-bottom: 5px;
}

.dx-datagrid-search-panel {
  background-color: transparent !important;
  border: none !important;
  padding: 0;
}

.dx-datagrid-table .dx-command-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
