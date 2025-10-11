<template>
  <div class="dx-page">
    <div class="flex items-center gap-2 mb-4">
      <input type="checkbox" id="showAll" v-model="showAll" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
      <label for="showAll">Mostrar mecánicos inactivos</label>
    </div>

    <ReusableDataGrid
      :data-source="currentDataSource"
      :columns="mechanicsColumns"
      key-expr="ID_Mecanico"
      add-button-text="Agregar Mecánico"
      page-title="Tabla de Mecánicos"
      :show-add-button="true"
      @add-click="openModal('add')"
      :on-view-click="onViewClick"
      :on-edit-click="onEditClick"
      :on-delete-click="onDeleteClick"
      :on-activate-click="onActivateClick"
      @refresh-data="refreshDataFromComposable(initialMechanicsData)"
    />

    <AddFormModal
      v-if="modalType === 'add' && showModal"
      v-model:open="showModal"
      :form-items="mechanicsFormItems"
      @form-submitted="handleFormSubmit"
    />

    <EditFormModal
      v-if="modalType === 'edit' && showModal"
      v-model:open="showModal"
      :initial-form-data="selectedMechanic"
      :form-items="mechanicsFormItems"
      @form-submitted="handleFormSubmit"
    />

    <ViewFormModal
      v-if="modalType === 'view' && showModal"
      v-model:open="showModal"
      :initial-form-data="selectedMechanic"
      :form-items="mechanicsFormItems"
    />

    <DeleteConfirmationModal
      v-if="showDeleteModal"
      v-model:open="showDeleteModal"
      :item-name="itemToDelete?.name || ''"
      @confirmed="handleDeletionConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '#imports';
import ReusableDataGrid from '~/components/elements/ReusableDataGrid.vue';
import AddFormModal from '~/components/elements/AddModal.vue';
import EditFormModal from '~/components/elements/EditModal.vue';
import ViewFormModal from '~/components/elements/ViewModal.vue';
import DeleteConfirmationModal from '~/components/elements/DeleteModal.vue';
import { useDataGrid } from '~/composables/useDataGrid';
import { initialMechanicsData, mechanicsColumns, mechanicsFormItems, type Mechanic } from '~/config/mechanicsConfig';

type ModalType = 'add' | 'edit' | 'view';

const toast = useToast();

const showModal = ref<boolean>(false);
const modalType = ref<ModalType>('view');
const selectedMechanic = ref<Mechanic | null>(null);

const showDeleteModal = ref<boolean>(false);
const itemToDelete = ref<{ id: number; name: string } | null>(null);

const {
  showAll,
  currentDataSource,
  refreshData: refreshDataFromComposable,
  addItem,
  updateItem,
  softDeleteItem,
  activateItem
} = useDataGrid<Mechanic>(initialMechanicsData, 'ID_Mecanico');

const openModal = (type: ModalType, data: Mechanic | null = null) => {
  modalType.value = type;
  if (type === 'add') {
    selectedMechanic.value = {
      ID_Mecanico: 0,
      Nombre: '',
      Apellido: '',
      Fotografia: '',
      FechaNacimiento: '',
      TelefonoContacto: '',
      CorreoElectronico: '',
      Direccion: '',
      FechaIngreso: '',
      Rol: 'Aprendiz',
      Especialidad: 'Motor',
      NivelExperiencia: 'Básico',
      EsActivo: true,
    };
  } else {
    selectedMechanic.value = data ? { ...data } : null;
  }
  showModal.value = true;
};

const handleFormSubmit = (formData: Mechanic) => {
  if (modalType.value === 'add') {
    addItem(formData);
    toast.add({ title: 'Mecánico agregado', description: `El mecánico ${formData.Nombre} ${formData.Apellido} ha sido creado.`, color: 'success' });
  } else if (modalType.value === 'edit') {
    updateItem(formData);
    toast.add({ title: 'Mecánico actualizado', description: `El mecánico ${formData.Nombre} ${formData.Apellido} ha sido actualizado.`, color: 'success' });
  }
  showModal.value = false;
};

const onEditClick = (mechanicData: Mechanic) => openModal('edit', mechanicData);
const onViewClick = (mechanicData: Mechanic) => openModal('view', mechanicData);

const onDeleteClick = (mechanicData: Mechanic) => {
  itemToDelete.value = {
    id: mechanicData.ID_Mecanico,
    name: `${mechanicData.Nombre} ${mechanicData.Apellido}`
  };
  showDeleteModal.value = true;
};

const handleDeletionConfirmed = () => {
  if (itemToDelete.value) {
    const mechanicToDelete = currentDataSource.value.find(m => m.ID_Mecanico === itemToDelete.value?.id);
    if (mechanicToDelete) {
       softDeleteItem(mechanicToDelete);
       toast.add({ title: 'Mecánico desactivado', description: `El mecánico ${itemToDelete.value?.name} ha sido desactivado.`, color: 'success' });
    }
  }
};

const onActivateClick = (mechanicData: Mechanic) => {
  activateItem(mechanicData);
  toast.add({ title: 'Mecánico activado', description: `El mecánico ${mechanicData.Nombre} ${mechanicData.Apellido} ha sido activado.`, color: 'success' });
};

onMounted(() => {
  refreshDataFromComposable(initialMechanicsData);
});
</script>
