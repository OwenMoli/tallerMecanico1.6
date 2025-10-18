<template>
  <div class="bg-white p-4 rounded-lg border border-gray-300 shadow-lg">
    <h1 v-if="pageTitle" class="text-2xl font-bold mb-4 text-center">{{ pageTitle }}</h1>

    <DxDataGrid
      ref="dxDataGridRef"
      :data-source="dataSource"
      :columns="adjustedColumns"
      :key-expr="keyExpr"
      :show-borders="true"
      :column-auto-width="true"
      @toolbar-preparing="onToolbarPreparing"
      allow-column-reordering="true"
      allow-column-resizing="true"
      column-resizing-mode="widget"
    >
      <DxPaging :page-size="20" />
      <DxPager :show-page-size-selector="true" :allowed-page-sizes="[20, 30, 40]" />
      <DxFilterRow :visible="true" />
      
      <DxHeaderFilter :visible="true" :popup="{ width: 'auto' }" />

      <DxSearchPanel :visible="true" :width="240" placeholder="Buscar..." />
      <DxColumnChooser :enabled="true" mode="select" />
      <DxSelection mode="multiple" />
      <DxExport :enabled="true" :allow-export-selected-data="true" />
    </DxDataGrid>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DxDataGrid,
  DxPaging,
  DxPager,
  DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel,
  DxColumnChooser,
  DxExport,
  DxSelection
} from 'devextreme-vue/data-grid';
import { DxButton } from 'devextreme-vue/button';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

// (El resto del script no necesita cambios)
interface DataGridButton {
  hint: string;
  icon: string;
  visible?: (e: any) => boolean;
  onClick?: (e: any) => void;
}
interface DataGridColumn {
  type?: 'buttons' | string;
  buttons?: DataGridButton[];
  dataField?: string;
  caption?: string;
  width?: number;
  [key: string]: any;
}
const props = defineProps<{
  dataSource: any[];
  columns: DataGridColumn[];
  keyExpr: string;
  addButtonText?: string;
  showAddButton?: boolean;
  pageTitle?: string;
  onViewClick?: (data: any) => void;
  onEditClick?: (data: any) => void;
  onDeleteClick?: (data: any) => void;
  onActivateClick?: (data: any) => void;
}>();
const emit = defineEmits(['add-click', 'refresh-data']);

const adjustedColumns = computed(() => {
  return props.columns.map(column => {
    if (column.type === 'buttons' && column.buttons) {
      return {
        ...column,
        buttons: column.buttons.map(button => {
          let onClick = button.onClick;
          if (button.hint === 'Ver Detalles' && props.onViewClick) onClick = (e: any) => props.onViewClick!(e.row.data);
          if (button.hint === 'Editar' && props.onEditClick) onClick = (e: any) => props.onEditClick!(e.row.data);
          if (button.hint === 'Desactivar' && props.onDeleteClick) onClick = (e: any) => props.onDeleteClick!(e.row.data);
          if (button.hint === 'Activar' && props.onActivateClick) onClick = (e: any) => props.onActivateClick!(e.row.data);
          return {
            ...button,
            onClick: onClick
          };
        })
      };
    }
    return column;
  });
});
function onToolbarPreparing(e: any) {
  e.toolbarOptions.items.push(
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'Exportar a Excel',
        icon: 'xlsxfile',
        onClick: () => {
          const workbook = new Workbook();
          const worksheet = workbook.addWorksheet('Datos');
          exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true
          }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
              saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'datos.xlsx');
            });
          });
        }
      }
    }
  );
  e.toolbarOptions.items.unshift(
    {
      location: 'before',
      widget: 'dxButton',
      options: {
        text: props.addButtonText,
        icon: 'add',
        type: 'success',
        onClick: () => emit('add-click'),
      },
      visible: props.showAddButton,
    },
    {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        onClick: () => emit('refresh-data'),
      },
    }
  );
}

const dxDataGridRef = ref(null);
defineExpose({
  instance: computed(() => (dxDataGridRef.value as any)?.instance)
});
</script>

<style>
.dx-datagrid-action-buttons {
  text-align: right;
}
</style>