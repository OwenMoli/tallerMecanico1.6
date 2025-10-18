<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-4">
      <input
        id="show-inactive-proveedores"
        type="checkbox"
        v-model="showAll"
        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label for="show-inactive-proveedores" class="text-sm font-medium text-gray-700">
        Mostrar proveedores inactivos
      </label>
    </div>

    <DataGrid
      ref="dataGridRef"
      page-title="Catálogo de Proveedores"
      :data-source="currentDataSource"
      :columns="gridColumns"
      key-expr="ID"
      add-button-text="Agregar Proveedor"
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
      :form-component="ProveedorForm"
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
import ProveedorForm from '@/components/forms/suppliersForm.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import { useDataGrid } from '@/composables/useDataGrid';
import { proveedorService, type Proveedor } from '@/service/apiService';
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
} = useDataGrid<Proveedor>(proveedorService);

// Estado de modales
const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref<Partial<Proveedor> | null>(null);
const isViewMode = ref(false);
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<Function | null>(null);

onMounted(fetchData);

const gridColumns = [
  { dataField: 'ID', caption: 'ID', width: 80 },
  { dataField: 'NombreProveedor', caption: 'Proveedor' },
  { dataField: 'NombreContacto', caption: 'Contacto' },
  { dataField: 'Telefono', caption: 'Teléfono' },
  { dataField: 'TipoProveedor', caption: 'Tipo' },
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
  editingItem.value = {};
  modalTitle.value = 'Agregar Nuevo Proveedor';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleEdit = (data: Proveedor) => {
  editingItem.value = { ...data };
  modalTitle.value = 'Editar Proveedor';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleView = (data: Proveedor) => {
  editingItem.value = { ...data };
  modalTitle.value = `Detalles del Proveedor #${data.ID}`;
  isViewMode.value = true;
  isModalVisible.value = true;
};

const handleSave = async (data: Proveedor) => {
  if (data.ID) {
    await updateItem(data);
    notify('Proveedor actualizado', 'success', 1500);
  } else {
    await addItem(data);
    notify('Proveedor creado', 'success', 1500);
  }
};

const handleDeactivate = (data: Proveedor) => {
  confirmationTitle.value = 'Confirmar Desactivación';
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar al proveedor #${data.ID}?`;
  actionToConfirm.value = async () => {
    await softDeleteItem(data);
    notify('Proveedor desactivado', 'info', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const handleActivate = (data: Proveedor) => {
  confirmationTitle.value = 'Confirmar Activación';
  confirmationMessage.value = `¿Estás seguro de que quieres activar al proveedor #${data.ID}?`;
  actionToConfirm.value = async () => {
    await activateItem(data);
    notify('Proveedor activado', 'success', 1500);
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
