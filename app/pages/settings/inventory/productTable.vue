<template>
    <div class="bg-white p-4 rounded-lg border border-gray-300 shadow-lg">
        <h1 class="text-2xl font-bold mb-4 text-center">Gestión de Productos y Servicios</h1>

        <DxDataGrid
            :data-source="store.allProducts"
            key-expr="id"
            :show-borders="true"
            :row-alternation-enabled="true"
            :hover-state-enabled="true"
            :allow-column-reordering="true"
            :allow-column-resizing="true"
            :column-auto-width="true"
            :remote-operations="false"
            @row-dbl-click="handleEdit"
            @toolbar-preparing="onToolbarPreparing"
            ref="dataGridRef"  >
            <DxPaging :page-size="10" />
            <DxPager
                :show-page-size-selector="true"
                :allowed-page-sizes="[10, 20, 30, 40]"
                :show-info="true"
            />
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
            <DxSearchPanel :visible="true" :width="240" placeholder="Buscar..." />
            <DxColumnChooser :enabled="true" mode="select" />
            <DxSelection mode="multiple" />
            <DxExport :enabled="true" :allow-export-selected-data="true" />


            <DxColumn data-field="generalidades.codigo" caption="Código" :width="110" alignment="left" :fixed="true" />
            <DxColumn data-field="generalidades.descripcion" caption="Descripción/Nombre" alignment="left" />
            <DxColumn data-field="generalidades.codigoBarra" caption="Cód. Barra" :width="100" :visible="true" />
            <DxColumn data-field="generalidades.referencia" caption="Referencia" :width="120" :visible="true" />
            <DxColumn data-field="generalidades.tipoProducto" caption="Tipo" :width="100" alignment="center" cell-template="type-cell" />
            <DxColumn data-field="condicion" caption="Condición" :width="90" alignment="center" />
            <DxColumn data-field="precios.precio1" caption="Precio Neto" data-type="number" format="currency" :width="110" alignment="right" />
            <DxColumn data-field="stock.existenciasIniciales" caption="Stock Inicial" data-type="number" :width="90" alignment="center" />
            <DxColumn data-field="notas" caption="Notas Detalladas" :width="150" :visible="true" />

            <DxColumn type="buttons" :width="110" caption="Acciones">
                <DxButton icon="info" hint="Ver Detalles" @click="viewDetails(data.row.data)" />
                <DxButton icon="edit" hint="Editar" @click="editProduct(data.row.data)" />
                <DxButton icon="trash" hint="Eliminar" @click="deleteProduct(data.row.data)" />
            </DxColumn>

            <template #type-cell="{ data }">
                <span
                    :class="{
                        'bg-green-100 text-green-800': data.value === 'Producto',
                        'bg-blue-100 text-blue-800': data.value === 'Insumo',
                        'bg-yellow-100 text-yellow-800': data.value === 'Servicio'
                    }"
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                >
                    {{ data.value }}
                </span>
            </template>

        </DxDataGrid>

        <DxPopup
            :visible="isPopupVisible"
            :drag-enabled="true"
            :close-on-outside-click="false"
            :show-title="false"
            :width="1200"
            :height="'auto'"
            :max-height="'95vh'"
            :resize-enabled="true"
            shading-color="rgba(0, 0, 0, 0.5)"
            @hidden="isPopupVisible = false"
        >
            <div class="product-form-container">
                <ProductForm
                    :initial-data="currentProduct"
                    :is-editing="!!currentProduct"
                    @save-success="onProductSaved"  @cancel="isPopupVisible = false"
                />
            </div>
        </DxPopup>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProductStore } from '~/store/product';
import DxDataGrid, {
    DxColumn, DxButton, DxPaging, DxPager,
    DxFilterRow, DxHeaderFilter, DxSearchPanel,
    DxColumnChooser, DxSelection, DxExport
} from 'devextreme-vue/data-grid';
import DxPopup from 'devextreme-vue/popup';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

// Importa aquí tu componente de formulario (Asegúrate de tener la ruta correcta)
import ProductForm from './products.vue';


const store = useProductStore();
const isPopupVisible = ref(false);
const currentProduct = ref(null);
// 🔑 CLAVE: Referencia Reactiva al componente DxDataGrid
const dataGridRef = ref(null);


// --- LÓGICA DE ACCIONES Y POPUP ---

const goToProductForm = () => {
    // Modo CREAR
    currentProduct.value = null;
    isPopupVisible.value = true;
};

// ... (handleEdit, editProduct, viewDetails, deleteProduct, onToolbarPreparing son los mismos) ...

// 🔑 FUNCIÓN CLAVE: Manejar el éxito del guardado
const onProductSaved = () => {
    isPopupVisible.value = false;
    currentProduct.value = null;

    // Forzar la actualización del DataGrid:
    // 1. Obtiene la instancia nativa de DevExtreme.
    const dataGridInstance = dataGridRef.value.instance;

    // 2. Llama al método refresh() de DevExtreme para actualizar la fuente de datos.
    // Esto es importante si el DataGrid tiene filtros, paginación o cache.
    if (dataGridInstance) {
        dataGridInstance.refresh();
        console.log("DataGrid: Refresco de datos forzado.");
    }
};

// --- LÓGICA DE HERRAMIENTAS DE LA GRILLA (TOOLBAR) ---
const onToolbarPreparing = (e) => {
    e.toolbarOptions.items.unshift(
        {
            location: 'before',
            widget: 'dxButton',
            options: {
                text: 'Nuevo Producto/Servicio',
                icon: 'add',
                type: 'success',
                onClick: goToProductForm,
            },
        },
        {
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'refresh',
                // Aseguramos que el botón de refrescar también llame al método refresh
                onClick: () => {
                    if (dataGridRef.value && dataGridRef.value.instance) {
                        dataGridRef.value.instance.refresh();
                        console.log('Datos refrescados manualmente.');
                    }
                },
            },
        },
        {
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Exportar a Excel',
                icon: 'xlsxfile',
                onClick: exportGridToExcel
            }
        }
    );
};

// --- LÓGICA DE EXPORTACIÓN (Omitida por brevedad) ---
const exportGridToExcel = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        autoFilterEnabled: true
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'productos_exportados.xlsx');
        });
    });
};
</script>

<style>
/* =================================================== */
/* ESTILOS CLAVE PARA ARREGLAR EL DESBORDAMIENTO EN DXPOPUP */
/* =================================================== */

/* Asegura que el contenido del popup se pueda desplazar si es muy alto */
.dx-popup-content {
    overflow-y: auto !important;
    padding-right: 15px;
}

/* Contenedor directo del formulario: esencial para que el formulario se ajuste */
.product-form-container {
    width: 100%;
    max-height: calc(95vh - 50px);
}

/* El componente raíz del formulario */
.product-form-container > div {
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
}

/* Arreglo para pestañas (DxTabPanel) si se salen horizontalmente */
.dx-tabpanel-container {
    overflow-x: hidden !important;
}

/* Asegura que los campos de DevExtreme se adapten al 100% del contenedor */
.dx-datagrid, .dx-texteditor, .dx-selectbox, .dx-numberbox, .dx-textarea {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
}
</style>
