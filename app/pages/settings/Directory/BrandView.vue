<template>
  <div class="p-6">
    <div class="flex items-center gap-2 mb-4">
      <input
        id="show-inactive-marcas"
        type="checkbox"
        v-model="showAll"
        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label for="show-inactive-marcas" class="text-sm font-medium text-gray-700">
        Mostrar marcas inactivas
      </label>
    </div>

    <DataGrid
      ref="dataGridRef"
      page-title="Catálogo de Marcas"
      :data-source="currentDataSource"
      :columns="gridColumns"
      key-expr="ID"
      add-button-text="Agregar Marca"
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
      :form-component="MarcaForm"
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
import MarcaForm from '@/components/forms/BrandForm.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import { useDataGrid } from '@/composables/useDataGrid';
import { marcaService, type Marca } from '@/service/apiService';
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
} = useDataGrid<Marca>(marcaService);

// Estado para el modal del formulario
const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref<Partial<Marca> | null>(null);
const isViewMode = ref(false);

// Estado para el modal de confirmación de acciones
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<Function | null>(null);

onMounted(fetchData);

const gridColumns = [
  { dataField: 'ID', caption: 'ID', width: 80 },
  { dataField: 'Nombre', caption: 'Nombre de la Marca' },
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
  modalTitle.value = 'Agregar Nueva Marca';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleEdit = (data: Marca) => {
  editingItem.value = { ...data };
  modalTitle.value = 'Editar Marca';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleView = (data: Marca) => {
  editingItem.value = { ...data };
  modalTitle.value = `Detalles de la Marca #${data.ID}`;
  isViewMode.value = true;
  isModalVisible.value = true;
};

const handleSave = async (data: Marca) => {
  if (data.ID) {
    await updateItem(data);
    notify('Marca actualizada', 'success', 1500);
  } else {
    await addItem(data);
    notify('Marca creada', 'success', 1500);
  }
};

const handleDeactivate = (data: Marca) => {
  confirmationTitle.value = 'Confirmar Desactivación';
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar la marca con el ID ${data.ID}?`;
  actionToConfirm.value = async () => {
    await softDeleteItem(data);
    notify('Marca desactivada', 'info', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const handleActivate = (data: Marca) => {
  confirmationTitle.value = 'Confirmar Activación';
  confirmationMessage.value = `¿Estás seguro de que quieres activar la marca con el ID ${data.ID}?`;
  actionToConfirm.value = async () => {
    await activateItem(data);
    notify('Marca activada', 'success', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const executeConfirmedAction = async () => {
  if (actionToConfirm.value) {
    await actionToConfirm.value();
    actionToConfirm.value = null; // Limpiamos la acción pendiente
  }
};
</script>
