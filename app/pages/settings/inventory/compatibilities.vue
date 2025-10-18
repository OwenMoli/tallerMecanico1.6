<template>
    <div class="p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl mx-auto border border-gray-200 dark:border-gray-700">
        <header class="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                Gestor de Compatibilidades de Vehículos ⚙️
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Visualiza y gestiona todas las compatibilidades de productos registradas en el sistema.
            </p>
        </header>

        <div class="flex items-center gap-2 mb-4">
            <input
                id="show-inactive-compatibilities"
                type="checkbox"
                v-model="showAll"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="show-inactive-compatibilities" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar compatibilidades inactivas
            </label>
        </div>

        <div v-if="productStore.isLoading" class="text-center py-16">
            <p class="text-gray-500 dark:text-gray-400">Cargando compatibilidades...</p>
        </div>

        <div v-else-if="currentDataSource.length === 0" class="text-center py-16 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            <p class="text-gray-500 dark:text-gray-400">No se encontraron compatibilidades para mostrar.</p>
        </div>

        <div v-else>
            <DxDataGridReusable
                ref="dataGridRef"
                :data-source="currentDataSource"
                key-expr="uniqueId"
                :columns="gridColumns"
                :search-panel-visible="true"
                :column-auto-width="true"
                :show-borders="true"
                :show-row-lines="true"
                :on-view-click="handleView"
                :on-edit-click="handleEdit"
                :on-delete-click="handleDeactivate"
                :on-activate-click="handleActivate"
            />
        </div>

        <FormModal
            v-model:visible="isModalVisible"
            :title="modalTitle"
            :form-component="CompatibilityForm"
            :form-data="editingItem"
            :is-view-mode="isViewMode"
            key-expr="uniqueId"
            @save="handleSave"
        />

        <ConfirmationModal
            v-model:visible="isActionConfirmVisible"
            :title="confirmationTitle"
            :message="confirmationMessage"
            @confirmed="executeConfirmedAction"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '~/store/product';
import DxDataGridReusable from '~/components/elements/ReusableDataGrid.vue';
import FormModal from '@/components/forms/FormModal.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import CompatibilityForm from '@/components/forms/compatibilityForm.vue';
import notify from 'devextreme/ui/notify';

const productStore = useProductStore();
const dataGridRef = ref(null);
const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref(null);
const isViewMode = ref(false);
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref(null);

// ✅ 3. ESTADO PARA EL CHECKBOX
const showAll = ref(false);

// ✅ 4. BOTONES DINÁMICOS
const gridColumns = ref([
    { dataField: 'productCode', caption: 'Cód. Producto', width: 120 },
    { dataField: 'productDescription', caption: 'Descripción del Producto' },
    { dataField: 'marca', caption: 'Marca Vehículo', width: 150 },
    { dataField: 'modelo', caption: 'Modelo Vehículo', width: 150 },
    { dataField: 'anio', caption: 'Año', width: 80, alignment: 'center' },
    { dataField: 'descripcion', caption: 'Notas de Compatibilidad' },
    {
        type: 'buttons',
        width: 120,
        buttons: [
            { hint: 'Ver Detalles', icon: 'search' },
            { hint: 'Editar', icon: 'edit' },
            { hint: 'Desactivar', icon: 'trash', visible: (e) => e.row.data.esActivo },
            { hint: 'Activar', icon: 'check', visible: (e) => !e.row.data.esActivo }
        ],
    },
]);

// La lista completa con todos los datos (activos e inactivos)
const compatibilityList = computed(() => {
    return productStore.products.flatMap(product =>
        (product.compatibilidades || []).map(comp => ({
            uniqueId: `${product.id}-${comp.id}`,
            productId: product.id,
            productCode: product.generalidades.codigo,
            productDescription: product.generalidades.descripcion,
            esActivo: comp.esActivo !== false, // Por defecto es activo si no existe la propiedad
            ...comp
        }))
    );
});

// ✅ 5. DATASOURCE FILTRADO PARA LA TABLA
const currentDataSource = computed(() => {
    if (showAll.value) {
        return compatibilityList.value; // Mostrar todos
    }
    return compatibilityList.value.filter(item => item.esActivo); // Mostrar solo activos
});

const handleView = (data) => {
    editingItem.value = { ...data };
    modalTitle.value = `Detalles de Compatibilidad`;
    isViewMode.value = true;
    isModalVisible.value = true;
};

const handleEdit = (data) => {
    editingItem.value = { ...data };
    modalTitle.value = 'Editar Compatibilidad';
    isViewMode.value = false;
    isModalVisible.value = true;
};

const handleSave = (data) => {
    const product = productStore.products.find(p => p.id === data.productId);
    if (product) {
        const compIndex = product.compatibilidades.findIndex(c => c.id === data.id);
        if (compIndex !== -1) {
            Object.assign(product.compatibilidades[compIndex], {
                marca: data.marca,
                modelo: data.modelo,
                anio: data.anio,
                descripcion: data.descripcion,
            });
        }
    }
    notify('Compatibilidad actualizada correctamente', 'success', 1500);
    isModalVisible.value = false;
};

// ✅ 6. LÓGICA DE SOFT-DELETE
const handleDeactivate = (data) => {
    confirmationTitle.value = 'Confirmar Desactivación';
    confirmationMessage.value = `¿Estás seguro de que quieres desactivar la compatibilidad para el ${data.marca} ${data.modelo} ${data.anio}?`;
    actionToConfirm.value = () => {
        const product = productStore.products.find(p => p.id === data.productId);
        if (product) {
            const comp = product.compatibilidades.find(c => c.id === data.id);
            if (comp) {
                comp.esActivo = false; // Simplemente cambiamos el estado
            }
        }
        notify('Compatibilidad desactivada', 'info', 1500);
        dataGridRef.value?.instance?.refresh();
    };
    isActionConfirmVisible.value = true;
};

// ✅ 7. NUEVA LÓGICA PARA ACTIVAR
const handleActivate = (data) => {
    confirmationTitle.value = 'Confirmar Activación';
    confirmationMessage.value = `¿Estás seguro de que quieres activar la compatibilidad para el ${data.marca} ${data.modelo} ${data.anio}?`;
    actionToConfirm.value = () => {
        const product = productStore.products.find(p => p.id === data.productId);
        if (product) {
            const comp = product.compatibilidades.find(c => c.id === data.id);
            if (comp) {
                comp.esActivo = true; // Cambiamos el estado a activo
            }
        }
        notify('Compatibilidad activada', 'success', 1500);
        dataGridRef.value?.instance?.refresh();
    };
    isActionConfirmVisible.value = true;
};

const executeConfirmedAction = () => {
  if (actionToConfirm.value) {
    actionToConfirm.value();
    actionToConfirm.value = null;
  }
};

onMounted(() => {
    if (productStore.products.length === 0) {
        productStore.fetchAllProducts();
    }
});
</script>
