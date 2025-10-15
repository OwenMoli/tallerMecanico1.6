<template>
  <div class="p-6">
    <DataGrid
      page-title="Catálogo de Modelos de Vehículos"
      :data-source="currentDataSource"
      :columns="gridColumns"
      key-expr="ID"
      add-button-text="Agregar Modelo"
      :show-add-button="true"
      @add-click="handleAddClick"
      @on-edit-click="handleEditClick"
      @on-delete-click="handleDeleteClick"
      @on-activate-click="handleActivateClick"
      @refresh-data="fetchModels"
    />

    <ModeloForm
      v-model:visible="isFormVisible"
      :model-value="editingModel"
      :marcas="marcas"
      @save="handleFormSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataGrid from '@/components/elements/ReusableDataGrid.vue'; // Ajusta la ruta a tu componente
import ModeloForm from '@/components/forms/carModelForm.vue'; // Ajusta la ruta a tu formulario
import { useDataGrid } from '@/composables/useDataGrid'; // Ajusta la ruta a tu composable
import notify from 'devextreme/ui/notify';

// --- Interfaces para los datos ---
interface Modelo {
  ID: number;
  Nombre: string;
  Año: number;
  MarcaID: number;
  EsActivo: boolean;
}

interface Marca {
  ID: number;
  Nombre: string;
}

// --- Mock de datos (reemplazar con llamadas a API) ---
const mockMarcas: Marca[] = [
  { ID: 1, Nombre: 'Toyota' },
  { ID: 2, Nombre: 'Honda' },
  { ID: 3, Nombre: 'Ford' },
  { ID: 4, Nombre: 'Nissan' },
];

const mockModelos = ref<Modelo[]>([
  { ID: 1, Nombre: 'Corolla', Año: 2022, MarcaID: 1, EsActivo: true },
  { ID: 2, Nombre: 'Hilux', Año: 2023, MarcaID: 1, EsActivo: true },
  { ID: 3, Nombre: 'Civic', Año: 2021, MarcaID: 2, EsActivo: true },
  { ID: 4, Nombre: 'CR-V', Año: 2024, MarcaID: 2, EsActivo: false },
  { ID: 5, Nombre: 'F-150', Año: 2020, MarcaID: 3, EsActivo: true },
]);

// --- Estado del componente ---
const isFormVisible = ref(false);
const editingModel = ref<Modelo | null>(null);
const marcas = ref<Marca[]>([]);

// --- Uso del composable para manejar la data del grid ---
const {
  currentDataSource,
  softDeleteItem,
  activateItem,
  refreshData,
  addItem, // Usaremos addItem y updateItem si manejas estado localmente
  updateItem,
} = useDataGrid<Modelo>(mockModelos, 'ID');


// --- Definición de columnas para el DataGrid ---
const gridColumns = [
  { dataField: 'ID', caption: 'ID', width: 80 },
  { dataField: 'Nombre', caption: 'Modelo' },
  {
    dataField: 'MarcaID',
    caption: 'Marca',
    // Usamos 'lookup' para mostrar el nombre de la marca en lugar del ID
    lookup: {
      dataSource: marcas,
      valueExpr: 'ID',
      displayExpr: 'Nombre',
    },
  },
  { dataField: 'Año', caption: 'Año', width: 100 },
  {
    type: 'buttons',
    width: 150,
    buttons: [
      {
        hint: 'Editar',
        icon: 'edit',
        // El onClick se enlaza automáticamente por tu componente DataGrid a la prop onEditClick
      },
      {
        hint: 'Desactivar',
        icon: 'trash',
        visible: (e: any) => e.row.data.EsActivo,
        // Enlazado a onDeleteClick
      },
      {
        hint: 'Activar',
        icon: 'check',
        visible: (e: any) => !e.row.data.EsActivo,
        // Enlazado a onActivateClick
      },
    ],
  },
];

// --- Lógica de carga de datos (simulada) ---
const fetchModels = async () => {
  console.log('🔄 Refrescando datos de modelos...');
  // Aquí harías tu llamada a la API para obtener modelos
  // const dataFromApi = await api.getModels();
  // refreshData(dataFromApi);
  notify('Datos actualizados', 'success', 1500);
};

const fetchMarcas = async () => {
  console.log('🚗 Cargando marcas...');
  // Aquí harías tu llamada a la API para obtener las marcas
  marcas.value = mockMarcas;
};

onMounted(() => {
  fetchModels();
  fetchMarcas();
});

// --- Manejadores de eventos del DataGrid ---
const handleAddClick = () => {
  editingModel.value = { ID: 0, Nombre: '', Año: new Date().getFullYear(), MarcaID: 0, EsActivo: true };
  isFormVisible.value = true;
};

const handleEditClick = (data: Modelo) => {
  editingModel.value = { ...data }; // Creamos una copia para evitar mutaciones directas
  isFormVisible.value = true;
};

const handleDeleteClick = (data: Modelo) => {
  console.log('Desactivando modelo:', data);
  // Aquí iría tu llamada a la API: await api.deactivateModel(data.ID);
  softDeleteItem(data); // Actualiza la UI instantáneamente
  notify('Modelo desactivado', 'info', 1500);
};

const handleActivateClick = (data: Modelo) => {
  console.log('Activando modelo:', data);
  // Aquí iría tu llamada a la API: await api.activateModel(data.ID);
  activateItem(data); // Actualiza la UI
  notify('Modelo activado', 'success', 1500);
};

// --- Manejador de evento del Formulario ---
const handleFormSave = (modelData: Modelo) => {
  if (modelData.ID) { // Si tiene ID, es una actualización
    console.log('Actualizando modelo:', modelData);
    // Aquí iría tu llamada a la API: await api.updateModel(modelData);
    updateItem(modelData);
    notify('Modelo actualizado correctamente', 'success', 2000);
  } else { // Si no, es una creación
    console.log('Creando nuevo modelo:', modelData);
    // Aquí iría tu llamada a la API: const newModel = await api.createModel(modelData);
    // addItem(newModel); // Si tu API devuelve el objeto creado con su ID

    // Simulación para el ejemplo local:
    const newModelWithId = { ...modelData, ID: Math.floor(Math.random() * 1000) + 10 };
    addItem(newModelWithId);
    notify('Modelo creado correctamente', 'success', 2000);
  }
  isFormVisible.value = false;
};
</script>
