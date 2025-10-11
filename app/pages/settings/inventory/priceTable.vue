<template>
    <div class="bg-white p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow-xl max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Gestión Centralizada de Precios 💰</h1>

        <DxDataGrid
            :data-source="flattenedPrices"
            key-expr="id"
            :show-borders="true"
            :row-alternation-enabled="true"
            :hover-state-enabled="true"
            :allow-column-resizing="true"
            :column-auto-width="true"
            @row-dbl-click="editPriceRecord(data.row.data)"
            @toolbar-preparing="onToolbarPreparing"
            ref="dataGridRef"
        >
            <DxPaging :page-size="20" />
            <DxPager :show-page-size-selector="true" :allowed-page-sizes="[10, 20, 50]" :show-info="true" />
            <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
            <DxSearchPanel :visible="true" :width="240" placeholder="Buscar por Producto, Código, Tipo de Precio..." />
            <DxColumnChooser :enabled="true" mode="select" />

            <DxExport :enabled="true" :allow-export-selected-data="true" />


            <DxColumn data-field="productCode" caption="Código" :width="100" alignment="left" :fixed="true" />
            <DxColumn data-field="productDescription" caption="Producto/Servicio" alignment="left" />

            <DxColumn data-field="priceTypeLabel" caption="Tipo de Precio" :width="150" alignment="left" :fixed="false" />
            <DxColumn data-field="costValue" caption="Costo" data-type="number" format="currency" :width="100" alignment="right" />
            <DxColumn data-field="utilityPercentage" caption="Utilidad %" data-type="number" format="0.00' %'" :width="100" alignment="center" />
            <DxColumn data-field="priceValue" caption="Monto Neto" data-type="number" format="currency" :width="120" alignment="right" :css-class="'font-bold text-green-700 dark:text-green-400'" />

            <DxColumn type="buttons" :width="80" caption="Acciones">
                <DxButton icon="edit" hint="Editar Precio" @click="editPriceRecord(data.row.data)" />
            </DxColumn>

        </DxDataGrid>

        <DxPopup
            :visible="isPopupVisible"
            :drag-enabled="true"
            :close-on-outside-click="false"
            :show-title="true"
            :title="popupTitle"
            :width="550"
            :height="'auto'"
            shading-color="rgba(0, 0, 0, 0.5)"
            @hidden="isPopupVisible = false"
        >
            <div class="p-4">
                <form @submit.prevent="handlePriceUpdate" class="space-y-4">
                    <div v-if="currentRecord && currentRecord.priceKey && currentRecord.priceKey.includes('precio1')">
                        <label for="costo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Costo (Neto)</label>
                        <input
                            type="number"
                            id="costo"
                            v-model.number="tempPriceState.costValue"
                            step="0.01"
                            min="0"
                            class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5"
                        />
                    </div>
                    <div>
                        <label for="utilityPercentage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilidad (%)</label>
                        <input
                            type="number"
                            id="utilityPercentage"
                            v-model.number="tempPriceState.utilityPercentage"
                            step="0.01"
                            min="0"
                            class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5"
                        />
                    </div>
                    <div>
                        <label for="priceValue" class="block text-sm font-bold text-gray-800 dark:text-white mb-1">Precio Neto <span class="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="priceValue"
                            v-model.number="tempPriceState.priceValue"
                            step="0.01"
                            min="0"
                            required
                            class="mt-1 block w-full rounded-lg border-green-500 dark:border-green-500 dark:bg-green-900/50 dark:text-white shadow-sm sm:text-base p-2.5 font-semibold"
                        />
                    </div>

                    <div class="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                        <button type="button" @click="isPopupVisible = false" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                            Cancelar
                        </button>
                        <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </DxPopup>

    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useProductStore } from '~/store/product';

// Importaciones de DevExtreme
import DxDataGrid, {
    DxColumn, DxButton, DxPaging, DxPager,
    DxFilterRow, DxHeaderFilter, DxSearchPanel,
    DxColumnChooser, DxExport
} from 'devextreme-vue/data-grid';
import DxPopup from 'devextreme-vue/popup';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

const productStore = useProductStore();
const dataGridRef = ref(null);
const isPopupVisible = ref(false);
const currentRecord = ref(null);
const tempPriceState = reactive({
    priceValue: 0,
    utilityPercentage: 0,
    costValue: 0
});
const popupTitle = ref('');

// --- Definición de las claves de precios anidados ---
const priceKeys = [
    { key: 'precio1', label: 'Precio 1 (Base)', utilityKey: 'porcentajeUtilidad1', costKey: 'costo1' },
    { key: 'precio2', label: 'Precio 2 (Mayoreo)', utilityKey: 'porcentajeUtilidad2', costKey: 'costo1' },
    { key: 'precio3', label: 'Precio 3 (Especial)', utilityKey: 'porcentajeUtilidad3', costKey: 'costo1' },
    { key: 'precio4', label: 'Precio 4 (Fidelidad)', utilityKey: 'porcentajeUtilidad4', costKey: 'costo1' },
];

// --- LÓGICA CLAVE: APLANAMIENTO DE DATOS ---
const flattenedPrices = computed(() => {
    const prices = [];

    if (!productStore.allProducts || !Array.isArray(productStore.allProducts)) {
        return [];
    }

    productStore.allProducts.forEach(product => {
        const productBase = {
            productId: product.id,
            productCode: product.generalidades.codigo,
            productDescription: product.generalidades.descripcion,
            originalProduct: product
        };

        priceKeys.forEach(pKey => {
            if (product.precios) {
                const priceValue = product.precios[pKey.key];

                // Aseguramos que la utilidad sea un número (muy importante)
                const utilityPercentage = Number(product.precios[pKey.utilityKey] || 0);

                // Aseguramos que el costo sea un número
                const costValue = Number(pKey.costKey ? product.precios[pKey.costKey] : 0);

                prices.push({
                    id: `${product.id}-${pKey.key}`,
                    ...productBase,
                    priceKey: pKey.key,
                    priceTypeLabel: pKey.label,
                    priceValue: Number(priceValue), // Aseguramos que el precio también sea Number
                    utilityKey: pKey.utilityKey,
                    utilityPercentage: utilityPercentage, // Valor ya convertido
                    costKey: pKey.costKey,
                    costValue: costValue, // Valor ya convertido
                });
            }
        });
    });

    return prices;
});


// --- LÓGICA DE EDICIÓN Y GUARDADO ---
const editPriceRecord = (record) => {
    currentRecord.value = record;
    // Al asignar, usamos Number() para garantizar que el formulario reciba números puros
    Object.assign(tempPriceState, {
        priceValue: Number(record.priceValue),
        utilityPercentage: Number(record.utilityPercentage),
        // Muestra el costo1 para la edición (solo si es Precio 1)
        costValue: record.costKey === 'costo1'
            ? Number(record.costValue)
            : Number(record.originalProduct.precios.costo1),
    });

    popupTitle.value = `Editar ${record.priceTypeLabel} de [${record.productCode}]`;
    isPopupVisible.value = true;
};

const handlePriceUpdate = async () => {
    if (!currentRecord.value) return;

    // 1. Clonar el objeto original y obtener las claves
    const productToUpdate = JSON.parse(JSON.stringify(currentRecord.value.originalProduct));
    const { priceKey, utilityKey, costKey } = currentRecord.value;

    // Obtener los valores del estado temporal (estos ya vienen como Number)
    const newPriceValue = tempPriceState.priceValue;
    const newUtilityPercentage = tempPriceState.utilityPercentage;
    const newCostValue = tempPriceState.costValue;

    // Obtener el costo base (siempre debe ser costo1 para los cálculos)
    let baseCost = productToUpdate.precios.costo1;


    // 2. LOGICA DE RECALCULO Y SINCRONIZACION

    // 2.1. Manejar el cambio de Costo (solo aplica al editar Precio 1)
    if (costKey === 'costo1' && priceKey === 'precio1' && newCostValue !== currentRecord.value.costValue) {
        baseCost = newCostValue;
        productToUpdate.precios[costKey] = newCostValue;
        // Sincronizar todos los demás costos
        productToUpdate.precios.costo2 = newCostValue;
        productToUpdate.precios.costo3 = newCostValue;
        productToUpdate.precios.costo4 = newCostValue;
    }


    // 2.2. Manejar el cambio en Porcentaje de Utilidad
    if (utilityKey && newUtilityPercentage !== currentRecord.value.utilityPercentage) {
        // Guardar el nuevo porcentaje (como Number)
        productToUpdate.precios[utilityKey] = newUtilityPercentage;

        // RECALCULAR EL PRECIO NETO basado en el nuevo % de utilidad y el costo base
        const calculatedNetPrice = baseCost * (1 + (newUtilityPercentage / 100));
        productToUpdate.precios[priceKey] = parseFloat(calculatedNetPrice.toFixed(2)); // Guardar con 2 decimales
    }
    // 2.3. Manejar el cambio en Precio Neto
    else if (priceKey && newPriceValue !== currentRecord.value.priceValue) {
        // Guardar el nuevo precio neto
        productToUpdate.precios[priceKey] = newPriceValue;

        // RECALCULAR EL PORCENTAJE DE UTILIDAD basado en el nuevo precio neto y el costo base
        const calculatedUtility = (baseCost > 0)
            ? ((newPriceValue - baseCost) / baseCost) * 100
            : (newPriceValue > 0 ? 100 : 0); // Manejo para costo cero

        // Almacenar el resultado del porcentaje de utilidad como Number, con 2 decimales
        productToUpdate.precios[utilityKey] = parseFloat(calculatedUtility.toFixed(2));
    } else {
        // Si no hubo cambio, aseguramos que los valores se copien
        // Esto es un 'catch-all' para el caso en que se abrió y cerró sin cambios significativos
        productToUpdate.precios[priceKey] = newPriceValue;
        productToUpdate.precios[utilityKey] = newUtilityPercentage;
    }


    // 3. LÓGICA FINAL: Recalcular el Precio Con Impuesto (solo si es precio 1)
    if (priceKey === 'precio1') {
        const precioNeto = productToUpdate.precios.precio1;
        const impuestoRate = productToUpdate.precios.impuesto === 'ISV 15%' ? 0.15 :
                             productToUpdate.precios.impuesto === 'ISV 18%' ? 0.18 : 0;

        if (productToUpdate.precios.aplicaImpuesto) {
            productToUpdate.precios.precioConImpuesto1 = parseFloat((precioNeto * (1 + impuestoRate)).toFixed(2));
        } else {
            productToUpdate.precios.precioConImpuesto1 = precioNeto;
        }
        // Mapear los campos finales para la tabla/API
        productToUpdate.precios.precioVentaNeto = precioNeto;
        productToUpdate.precios.precioVentaConImpuesto = productToUpdate.precios.precioConImpuesto1;
    }


    // 4. Llamar a la Store de Pinia
    try {
        // El argumento 'true' indica que es una actualización
        const savedProduct = await productStore.saveOrUpdateProduct(productToUpdate, true);

        if (savedProduct) {
            isPopupVisible.value = false;
            // Refrescar el DataGrid
            if (dataGridRef.value) dataGridRef.value.instance.refresh();
        }
    } catch (error) {
        console.error("Error al actualizar el precio:", error);
        alert("Ocurrió un error al guardar los cambios de precio. Verifique la consola.");
    }
};

// --- FUNCIÓN CLAVE: EXPORTAR A EXCEL ---
const exportGridToExcel = () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Precios');

    exportDataGrid({
        component: dataGridRef.value.instance,
        worksheet: worksheet,
        autoFilterEnabled: true
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'precios_centralizados.xlsx');
        });
    });
};


// --- LÓGICA DE LA BARRA DE HERRAMIENTAS ---
const onToolbarPreparing = (e) => {
    e.toolbarOptions.items.unshift(
        // Botón de Exportar a Excel
        {
            location: 'after',
            widget: 'dxButton',
            options: {
                text: 'Exportar a Excel',
                icon: 'xlsxfile',
                onClick: exportGridToExcel
            }
        },
        // Botón de Recargar/Refrescar datos
        {
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'refresh',
                hint: 'Recargar Precios',
                onClick: () => {
                    productStore.loadAllProducts();
                    if (dataGridRef.value && dataGridRef.value.instance) {
                        dataGridRef.value.instance.refresh();
                    }
                },
            },
        }
    );
};

onMounted(() => {
    // Carga inicial de datos desde Pinia
    productStore.loadAllProducts();
});
</script>

<style scoped>
/* Estilos para resaltar el precio neto */
.font-bold { font-weight: bold; }
.text-green-700 { color: #047857; }
.dark\:text-green-400 { color: #4ade80; }
</style>
