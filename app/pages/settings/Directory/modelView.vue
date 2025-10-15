<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-4">
      <input
        id="show-inactive"
        type="checkbox"
        v-model="showAll"
        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label for="show-inactive" class="text-sm font-medium text-gray-700">
        Mostrar registros inactivos
      </label>
    </div>

    <DataGrid
      ref="dataGridRef"
      page-title="Catálogo de Modelos de Vehículos"
      :data-source="currentDataSource"
      :columns="gridColumns"
      key-expr="ID"
      add-button-text="Agregar Modelo"
      :show-add-button="true"
      @add-click="handleAdd"
      :on-view-click="handleView"
      :on-edit-click="handleEdit"
      :on-delete-click="handleDeactivate"
      :on-activate-click="handleActivate"
      @refresh-data="fetchData"
    />

    <FormModal
      v-model:visible="isModalVisible"
      :title="modalTitle"
      :form-component="ModeloForm"
      :form-data="editingItem"
      :form-props="{ marcas: activeMarcas, estilos: activeEstilos }"
      :is-view-mode="isViewMode"
      key-expr="ID"
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

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DataGrid from '@/components/elements/ReusableDataGrid.vue';
import FormModal from '@/components/forms/FormModal.vue';
import ModeloForm from '@/components/forms/carModelForm.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import { useDataGrid } from '@/composables/useDataGrid';
import notify from 'devextreme/ui/notify';

import {
  modeloService,
  marcaService,
  estiloService,
  type Modelo,
  type Marca,
  type Estilo
} from '@/service/apiService';

// Referencias
const dataGridRef = ref(null);
const {
  currentDataSource,
  showAll,
  fetchData: fetchModelos,
  addItem,
  updateItem,
  softDeleteItem,
  activateItem
} = useDataGrid<Modelo>(modeloService);

// Estado para el modal del formulario
const allMarcas = ref<Marca[]>([]);
const allEstilos = ref<Estilo[]>([]);
const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref<Partial<Modelo> | null>(null);
const isViewMode = ref(false);

// Estado para el modal de confirmación de acciones
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<Function | null>(null);

// Propiedades computadas para filtrar solo las marcas y estilos activos para el formulario
const activeMarcas = computed(() => allMarcas.value.filter(m => m.EsActivo));
const activeEstilos = computed(() => allEstilos.value.filter(e => e.EsActivo));

const gridColumns = computed(() => [
  { dataField: 'ID', caption: 'ID', width: 80 },
  { dataField: 'Nombre', caption: 'Modelo' },
  {
    dataField: 'MarcaID',
    caption: 'Marca',
    // El lookup usa la lista completa para poder mostrar nombres de registros antiguos
    lookup: { dataSource: allMarcas.value, valueExpr: 'ID', displayExpr: 'Nombre' },
  },
  {
    dataField: 'EstiloID',
    caption: 'Estilo',
    lookup: { dataSource: allEstilos.value, valueExpr: 'ID', displayExpr: 'Nombre' },
  },
  { dataField: 'Año', caption: 'Año', width: 100 },
  {
    type: 'buttons',
    width: 150,
    buttons: [
      { hint: 'Ver Detalles', icon: 'search' },
      { hint: 'Editar', icon: 'edit' },
      { hint: 'Desactivar', icon: 'trash', visible: (e: any) => e.row.data.EsActivo },
      { hint: 'Activar', icon: 'check', visible: (e: any) => !e.row.data.EsActivo },
    ],
  },
]);

const fetchData = async () => {
  try {
    const [marcasData, estilosData] = await Promise.all([
      marcaService.getAll(),
      estiloService.getAll()
    ]);
    // Guardamos la lista completa de marcas y estilos
    allMarcas.value = marcasData;
    allEstilos.value = estilosData;
    await fetchModelos();
    notify('Datos actualizados', 'success', 1000);
  } catch (error) {
    notify('Error al cargar los datos', 'error', 2000);
  }
};

onMounted(fetchData);

const handleAdd = () => {
  editingItem.value = { Nombre: '', Año: new Date().getFullYear() };
  modalTitle.value = 'Agregar Nuevo Modelo';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleEdit = (data: Modelo) => {
  editingItem.value = { ...data };
  modalTitle.value = 'Editar Modelo';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleView = (data: Modelo) => {
  editingItem.value = { ...data };
  modalTitle.value = `Detalles del Modelo #${data.ID}`;
  isViewMode.value = true;
  isModalVisible.value = true;
};

const handleSave = async (data: Modelo) => {
  if (data.ID) {
    await updateItem(data);
    notify('Modelo actualizado correctamente', 'success', 1500);
  } else {
    await addItem(data);
    notify('Modelo creado correctamente', 'success', 1500);
  }
};

const handleDeactivate = (data: Modelo) => {
  confirmationTitle.value = `Confirmar Desactivación`;
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar el modelo #${data.ID}?`;
  actionToConfirm.value = async () => {
    await softDeleteItem(data);
    notify('Modelo desactivado', 'info', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const handleActivate = (data: Modelo) => {
  confirmationTitle.value = 'Confirmar Activación';
  confirmationMessage.value = `¿Estás seguro de que quieres activar el modelo #${data.ID}?`;
  actionToConfirm.value = async () => {
    await activateItem(data);
    notify('Modelo activado', 'success', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const executeConfirmedAction = async () => {
  if (actionToConfirm.value) {
    await actionToConfirm.value();
    actionToConfirm.value = null;
  }
};
</script>
