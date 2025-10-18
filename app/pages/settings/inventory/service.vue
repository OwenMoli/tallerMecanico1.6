<template>
    <div class="bg-white p-4 rounded-lg border border-gray-300 shadow-lg">
        <h1 class="text-2xl font-bold mb-4 text-center">Gestión de Productos y Servicios</h1>

        <DxDataGrid
            ref="dataGridRef"
            :data-source="store.products"
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
            width="100%"
        >
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
            <DxColumn data-field="generalidades.descripcion" caption="Descripción/Nombre" :width="350" alignment="left" :allow-resizing="true" />

            <DxColumn
                data-field="generalidades.tipoProducto"
                caption="Tipo"
                :width="100"
                alignment="center"
            >
                <template #cell="{ data }">
                    <span
                        :class="{
                            'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': data.value === 'Producto',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': data.value === 'Insumo',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': data.value === 'Servicio'
                        }"
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                        {{ data.value }}
                    </span>
                </template>
            </DxColumn>
            <DxColumn data-field="generalidades.referencia" caption="Referencia" :width="150" alignment="center" :visible="true" />
            <DxColumn data-field="condicion" caption="Condición" :width="100" alignment="center" />

            <DxColumn
                data-field="precios.aplicaImpuesto"
                caption="Aplica ISV"
                :width="100"
                alignment="center"
                data-type="boolean"
            >
                <template #cell="{ data }">
                    <span :class="{'dx-icon-check text-green-500': data.value, 'dx-icon-close text-red-500': !data.value}"></span>
                </template>
            </DxColumn>
            <DxColumn data-field="precios.impuesto" caption="% Impuesto" :width="100" alignment="center" :visible="true" />
            <DxColumn data-field="precios.precio1" caption="Precio Neto ($)" data-type="number" format="currency" :width="130" alignment="right" :visible="true" />
            <DxColumn data-field="inventario.almacenId" caption="Almacén ID" :width="110" alignment="center" :visible="true" />
            <DxColumn data-field="inventario.binId" caption="Estantería" :width="110" alignment="center" :visible="true" />

            <DxColumn
                type="buttons"
                :width="130"
                caption="Acciones"
                :fixed="true"
                fixed-position="right"
                :buttons="[
                    { hint: 'Ver Detalles', icon: 'info', onClick: (e) => viewDetails(e.row.data) },
                    { hint: 'Editar', icon: 'edit', onClick: (e) => editProduct(e.row.data) },
                    { hint: 'Eliminar', icon: 'trash', onClick: (e) => deleteProduct(e.row.data) }
                ]"
            />

            <DxColumn data-field="generalidades.codigoBarra" caption="Cód. Barra" :width="100" :visible="false" />
            <DxColumn data-field="precios.costo1" caption="Costo ($)" data-type="number" format="currency" :width="100" alignment="right" :visible="false" />
            <DxColumn data-field="precios.precioConImpuesto1" caption="Precio Venta Final" data-type="number" format="currency" :width="130" alignment="right" :visible="false" />
            <DxColumn data-field="precios.porcentajeUtilidad1" caption="% Utilidad" data-type="number" format="#,##0.00' %'" :width="90" alignment="center" :visible="false" />
            <DxColumn data-field="precios.precio2" caption="Precio 2" data-type="number" format="currency" :width="110" alignment="right" :visible="false" />
            <DxColumn data-field="precios.precio3" caption="Precio 3" data-type="number" format="currency" :width="110" alignment="right" :visible="false" />
            <DxColumn data-field="precios.precio4" caption="Precio 4" data-type="number" format="currency" :width="110" alignment="right" :visible="false" />
            <DxColumn data-field="stock.existenciasIniciales" caption="Stock Inicial" data-type="number" :width="90" alignment="center" :visible="false" />
            <DxColumn data-field="duracionServicio" caption="Duración (Hrs)" :width="100" alignment="center" :visible="false" />
            <DxColumn data-field="notas" caption="Notas Detalladas" :width="150" :visible="false" />
        </DxDataGrid>

        <DxPopup
            :visible="isPopupVisible"
            :drag-enabled="true"
            :close-on-outside-click="false"
            :show-title="true"
            :title="popupTitle"
            :width="1200"
            :height="'auto'"
            :max-height="'95vh'"
            :resize-enabled="true"
            shading-color="rgba(0, 0, 0, 0.5)"
            @hidden="isPopupVisible = false"
        >
            <div class="product-form-container">
                <ProductForm
                    :key="formKey"
                    :initial-data="currentProduct"
                    :is-editing="!!currentProduct"
                    :is-view-mode="isViewMode"
                    @save-success="onProductSaved"
                    @cancel="isPopupVisible = false"
                />
            </div>
        </DxPopup>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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
import { confirm as customConfirm } from 'devextreme/ui/dialog';
import ProductForm from './products.vue';

const store = useProductStore();
const isPopupVisible = ref(false);
const currentProduct = ref(null);
const dataGridRef = ref(null);
const formKey = ref(0);
const isViewMode = ref(false);

onMounted(() => {
    store.fetchAllProducts();
});

const popupTitle = computed(() => {
    if (isViewMode.value) return 'Detalles del Producto/Servicio';
    return currentProduct.value ? 'Editar Producto/Servicio' : 'Nuevo Producto/Servicio';
});

const goToProductForm = () => {
    currentProduct.value = null;
    isViewMode.value = false;
    formKey.value += 1;
    isPopupVisible.value = true;
};

const handleEdit = ({ data }) => editProduct(data);

const editProduct = (productData) => {
    currentProduct.value = JSON.parse(JSON.stringify(productData));
    isViewMode.value = false;
    formKey.value += 1;
    isPopupVisible.value = true;
};

const viewDetails = (productData) => {
    currentProduct.value = JSON.parse(JSON.stringify(productData));
    isViewMode.value = true;
    formKey.value += 1;
    isPopupVisible.value = true;
};

const deleteProduct = (productData) => {
    customConfirm('¿Está seguro de que desea eliminar permanentemente este elemento?', 'Confirmar Eliminación').then(async (dialogResult) => {
        if (dialogResult) {
            alert(`Simulando eliminación del ID: ${productData.id}`);
            dataGridRef.value?.instance?.refresh();
        }
    });
};

const onProductSaved = () => {
    isPopupVisible.value = false;
    currentProduct.value = null;
    dataGridRef.value?.instance?.refresh();
};

const onToolbarPreparing = (e) => {
    e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: { text: 'Nuevo Producto/Servicio', icon: 'add', type: 'success', onClick: goToProductForm },
    });
};

const exportGridToExcel = () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Datos');
    exportDataGrid({
        component: dataGridRef.value.instance,
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
/* (Tus estilos no necesitan cambios) */
.dx-popup-content {
    overflow-y: auto !important;
    padding-right: 15px;
}
.product-form-container {
    width: 100%;
    max-height: calc(95vh - 50px);
}
.product-form-container > div {
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
}
.dx-tabpanel-container {
    overflow-x: hidden !important;
}
.dx-datagrid, .dx-texteditor, .dx-selectbox, .dx-numberbox, .dx-textarea {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
}
</style>
