<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <input id="show-inactive-clientes" type="checkbox" v-model="activeShowAll" class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"/>
        <label for="show-inactive-clientes" class="text-sm font-medium text-gray-700">Mostrar inactivos</label>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">Natural</label>
        <input type="checkbox" id="client-type-switch" class="client-switch" v-model="isJuridico"/>
        <label for="client-type-switch" class="text-sm font-medium text-gray-700">Jurídico</label>
      </div>
    </div>

    <DataGrid
      ref="dataGridRef"
      :page-title="gridTitle"
      :data-source="activeDataSource"
      :columns="activeColumns"
      key-expr="ID"
      add-button-text="Agregar Cliente"
      :show-add-button="true"
      @add-click="handleAdd"
      :on-view-click="handleView"
      :on-edit-click="handleEdit"
      :on-delete-click="handleDeactivate"
      :on-activate-click="handleActivate"
      @refresh-data="activeFetchData"
    />

    <FormModal
      v-model:visible="isModalVisible"
      :title="modalTitle"
      :form-component="activeFormComponent"
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

<style scoped>

.client-switch{position:relative;width:44px;height:24px;-webkit-appearance:none;appearance:none;background:#c6c6c6;outline:none;border-radius:20px;transition:.4s}.client-switch:before{content:'';position:absolute;width:20px;height:20px;border-radius:20px;top:2px;left:2px;background:#fff;transition:.4s}.client-switch:checked{background:#34c759}.client-switch:checked:before{transform:translateX(20px)}
</style>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import DataGrid from '@/components/elements/ReusableDataGrid.vue';
import FormModal from '@/components/forms/FormModal.vue';
import ConfirmationModal from '@/components/forms/ConfirmationModal.vue';
import ClienteNaturalForm from '@/components/forms/ClienteNaturalForm.vue';
import ClienteJuridicoForm from '@/components/forms/ClienteJuridicoForm.vue';
import { useDataGrid } from '@/composables/useDataGrid';
import { clienteNaturalService, clienteJuridicoService, type ClienteNatural, type ClienteJuridico } from '@/service/apiService';
import notify from 'devextreme/ui/notify';

const isJuridico = ref(false);
const dataGridRef = ref(null);


const naturalGrid = useDataGrid<ClienteNatural>(clienteNaturalService);


const juridicoGrid = useDataGrid<ClienteJuridico>(clienteJuridicoService);


const activeGridLogic = computed(() => isJuridico.value ? juridicoGrid : naturalGrid);
const activeDataSource = computed(() => activeGridLogic.value.currentDataSource.value);
const activeShowAll = computed({
  get: () => activeGridLogic.value.showAll.value,
  set: (val) => activeGridLogic.value.showAll.value = val,
});
const activeFetchData = () => activeGridLogic.value.fetchData();
const activeFormComponent = computed(() => isJuridico.value ? ClienteJuridicoForm : ClienteNaturalForm);


const naturalColumns = [
  { dataField: 'ID', caption: 'ID', width: 60 },
  { dataField: 'nombre', caption: 'Nombres' },
  { dataField: 'apellido', caption: 'Apellidos' },
  { dataField: 'tipoDocumento', caption: 'Tipo Documento' },
  { dataField: 'numeroIdentificacion', caption: 'No. Identificación' },
  { dataField: 'rtn', caption: 'RTN' },
  { dataField: 'telefono', caption: 'Teléfono' },
  { dataField: 'correo', caption: 'Correo' },
  { dataField: 'direccion', caption: 'Dirección' },
  { dataField: 'sexo', caption: 'Sexo', width: 80 },
];

const juridicoColumns = [
  { dataField: 'ID', caption: 'ID', width: 60 },
  { dataField: 'empresaNombre', caption: 'Nombre Empresa' },
  { dataField: 'empresaRubro', caption: 'Rubro' },
  { dataField: 'empresaRtn', caption: 'RTN Empresa' },
  { dataField: 'empresaDireccion', caption: 'Dirección Empresa' },
  { dataField: 'contactoNombre', caption: 'Nombre Contacto' },
  { dataField: 'contactoApellido', caption: 'Apellido Contacto' },
  { dataField: 'contactoCargo', caption: 'Cargo Contacto' },
  { dataField: 'contactoTelefono', caption: 'Teléfono Contacto' },
  { dataField: 'contactoCorreo', caption: 'Correo Contacto' },
  { dataField: 'contactoDireccion', caption: 'Dirección Contacto' },
];

const activeColumns = computed(() => {
    const baseColumns = isJuridico.value ? juridicoColumns : naturalColumns;
    return [
        ...baseColumns,
        { type: 'buttons', width: 150, buttons: [
            { hint: 'Ver Detalles', icon: 'search' },
            { hint: 'Editar', icon: 'edit' },
            { hint: 'Desactivar', icon: 'trash', visible: (e: any) => e.row.data.EsActivo },
            { hint: 'Activar', icon: 'check', visible: (e: any) => !e.row.data.EsActivo }
        ]}
    ];
});

const gridTitle = computed(() => isJuridico.value ? 'Catálogo de Clientes Jurídicos' : 'Catálogo de Clientes Naturales');


const isModalVisible = ref(false);
const modalTitle = ref('');
const editingItem = ref<Partial<ClienteNatural> | Partial<ClienteJuridico> | null>(null);
const isViewMode = ref(false);
const isActionConfirmVisible = ref(false);
const confirmationTitle = ref('');
const confirmationMessage = ref('');
const actionToConfirm = ref<Function | null>(null);

onMounted(() => {
  naturalGrid.fetchData();
  juridicoGrid.fetchData();
});

const handleAdd = () => {
  editingItem.value = {};
  modalTitle.value = isJuridico.value ? 'Agregar Cliente Jurídico' : 'Agregar Cliente Natural';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleEdit = (data: any) => {
  editingItem.value = { ...data };
  modalTitle.value = 'Editar Cliente';
  isViewMode.value = false;
  isModalVisible.value = true;
};

const handleView = (data: any) => {
  editingItem.value = { ...data };
  modalTitle.value = `Detalles del Cliente #${data.ID}`;
  isViewMode.value = true;
  isModalVisible.value = true;
};

const handleSave = async (data: any) => {
  const logic = activeGridLogic.value;
  if (data.ID) {
    await logic.updateItem(data);
    notify('Cliente actualizado', 'success', 1500);
  } else {
    await logic.addItem(data);
    notify('Cliente creado', 'success', 1500);
  }
};

const handleDeactivate = (data: any) => {
  confirmationTitle.value = 'Confirmar Desactivación';
  confirmationMessage.value = `¿Estás seguro de que quieres desactivar al cliente #${data.ID}?`;
  actionToConfirm.value = async () => {
    await activeGridLogic.value.softDeleteItem(data);
    notify('Cliente desactivado', 'info', 1500);
    (dataGridRef.value as any)?.instance?.refresh();
  };
  isActionConfirmVisible.value = true;
};

const handleActivate = (data: any) => {
  confirmationTitle.value = 'Confirmar Activación';
  confirmationMessage.value = `¿Estás seguro de que quieres activar al cliente #${data.ID}?`;
  actionToConfirm.value = async () => {
    await activeGridLogic.value.activateItem(data);
    notify('Cliente activado', 'success', 1500);
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
