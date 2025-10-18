<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-4">
      <input
        id="show-inactive-tipos-motor"
        type="checkbox"
        v-model="showAll"
        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label for="show-inactive-tipos-motor" class="text-sm font-medium text-gray-700">
        Mostrar tipos de motor inactivos
      </label>
    </div>

    <DataGrid
      ref="dataGridRef"
      page-title="Catálogo de Tipos de Motor"
      :data-source="currentDataSource"
      :columns="gridColumns"
      key-expr="ID"
      add-button-text="Agregar Tipo de Motor"
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
      :form-component="TipoMotorForm"
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
import TipoMotorForm from '@/components/forms/EngineTypesForm.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import { useDataGrid } from '@/composables/useDataGrid';
import { tipoMotorService, type TipoMotor } from '@/service/apiService';
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
} = useDataGrid<TipoMotor>(tipoMotorService);

// Estado de modales
const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref<Partial<TipoMotor> | null>(null);
const isViewMode = ref(false);
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<Function | null>(null);

onMounted(fetchData);

const gridColumns = [
  { dataField: 'ID', caption: 'ID', width: 80 },
  { dataField: 'Nombre', caption: 'Tipo de Motor' },
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
  modalTitle.value = 'Agregar Nuevo Tipo de Motor';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleEdit = (data: TipoMotor) => {
  editingItem.value = { ...data };
  modalTitle.value = 'Editar Tipo de Motor';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleView = (data: TipoMotor) => {
  editingItem.value = { ...data };
  modalTitle.value = `Detalles del Tipo de Motor #${data.ID}`;
  isViewMode.value = true;
  isModalVisible.value = true;
};

const handleSave = async (data: TipoMotor) => {
  if (data.ID) {
    await updateItem(data);
    notify('Tipo de motor actualizado', 'success', 1500);
  } else {
    await addItem(data);
    notify('Tipo de motor creado', 'success', 1500);
  }
};

const handleDeactivate = (data: TipoMotor) => {
  confirmationTitle.value = 'Confirmar Desactivación';
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar el tipo de motor #${data.ID}?`;
  actionToConfirm.value = async () => {
    await softDeleteItem(data);
    notify('Tipo de motor desactivado', 'info', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const handleActivate = (data: TipoMotor) => {
  confirmationTitle.value = 'Confirmar Activación';
  confirmationMessage.value = `¿Estás seguro de que quieres activar el tipo de motor #${data.ID}?`;
  actionToConfirm.value = async () => {
    await activateItem(data);
    notify('Tipo de motor activado', 'success', 1500);
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
