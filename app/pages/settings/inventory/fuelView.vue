<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-4">
      <input
        id="show-inactive-tipos-combustible"
        type="checkbox"
        v-model="showAll"
        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label for="show-inactive-tipos-combustible" class="text-sm font-medium text-gray-700">
        Mostrar tipos de combustible inactivos
      </label>
    </div>

    <DataGrid
      ref="dataGridRef"
      page-title="Catálogo de Tipos de Combustible"
      :data-source="currentDataSource"
      :columns="gridColumns"
      key-expr="ID"
      add-button-text="Agregar Tipo de Combustible"
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
      :form-component="TipoCombustibleForm"
      :form-data="editingItem"
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
import { ref, onMounted } from 'vue';
import DataGrid from '@/components/elements/ReusableDataGrid.vue';
import FormModal from '@/components/forms/FormModal.vue';
import TipoCombustibleForm from '@/components/forms/FuelForm.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import { useDataGrid } from '@/composables/useDataGrid';
import { tipoCombustibleService, type TipoCombustible } from '@/service/apiService';
import notify from 'devextreme/ui/notify';

// Referencias
const dataGridRef = ref(null);
const {
  currentDataSource,
  showAll,
  fetchData,
  addItem,
  updateItem,
  softDeleteItem,
  activateItem
} = useDataGrid<TipoCombustible>(tipoCombustibleService);

// Estado de modales
const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref<Partial<TipoCombustible> | null>(null);
const isViewMode = ref(false);
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<Function | null>(null);

onMounted(fetchData);

const gridColumns = [
  { dataField: 'ID', caption: 'ID', width: 80 },
  { dataField: 'Nombre', caption: 'Tipo de Combustible' },
  {
    type: 'buttons',
    width: 150,
    buttons: [
      { hint: 'Ver Detalles', icon: 'search' },
      { hint: 'Editar', icon: 'edit' },
      { hint: 'Desactivar', icon: 'trash', visible: (e: any) => e.row.data.EsActivo },
      { hint: 'Activar', icon: 'check', visible: (e: any) => !e.row.data.EsActivo }
    ],
  },
];

const handleAdd = () => {
  editingItem.value = { Nombre: '' };
  modalTitle.value = 'Agregar Nuevo Tipo de Combustible';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleEdit = (data: TipoCombustible) => {
  editingItem.value = { ...data };
  modalTitle.value = 'Editar Tipo de Combustible';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleView = (data: TipoCombustible) => {
  editingItem.value = { ...data };
  modalTitle.value = `Detalles del Tipo de Combustible #${data.ID}`;
  isViewMode.value = true;
  isModalVisible.value = true;
};

const handleSave = async (data: TipoCombustible) => {
  if (data.ID) {
    await updateItem(data);
    notify('Tipo de combustible actualizado', 'success', 1500);
  } else {
    await addItem(data);
    notify('Tipo de combustible creado', 'success', 1500);
  }
};

const handleDeactivate = (data: TipoCombustible) => {
  confirmationTitle.value = 'Confirmar Desactivación';
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar el tipo de combustible #${data.ID}?`;
  actionToConfirm.value = async () => {
    await softDeleteItem(data);
    notify('Tipo de combustible desactivado', 'info', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const handleActivate = (data: TipoCombustible) => {
  confirmationTitle.value = 'Confirmar Activación';
  confirmationMessage.value = `¿Estás seguro de que quieres activar el tipo de combustible #${data.ID}?`;
  actionToConfirm.value = async () => {
    await activateItem(data);
    notify('Tipo de combustible activado', 'success', 1500);
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
