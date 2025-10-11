<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <input type="checkbox" id="showAllProducts" v-model="showAll" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
      <label for="showAllProducts">Mostrar productos inactivos</label>
    </div>

    <ReusableDataGrid
      page-title="Listado de Productos y Servicios Registrados"
      key-expr="id"
      :data-source="currentDataSource"
      :columns="columns"
      add-button-text="Registrar Nuevo Elemento"
      :show-add-button="true"
      @add-click="handleAddClick"
      @refresh-data="handleRefresh"
      :on-view-click="handleViewClick"
      :on-edit-click="handleEditClick"
      :on-delete-click="handleSoftDeleteClick"
      :on-activate-click="handleActivateClick"
    />

    <DxPopup
      v-model:visible="isFormModalOpen"
      :title="isEditing ? 'Editar Producto/Servicio' : 'Registrar Nuevo Producto/Servicio'"
      :show-close-button="true"
      :width="1200"
      :height="800"
      :shading="true"
      :close-on-outside-click="false"
      @hiding="isEditing = false; currentRecord = null"
    >
      <template #content>
        <ProductForm
          :initial-data="currentRecord"
          :is-editing="isEditing"
          @form-saved="handleFormSaved"
          @cancel="isFormModalOpen = false"
        />
      </template>
    </DxPopup>

    <ViewModal
      v-model:open="isViewModalOpen" :initial-form-data="currentRecord"
      :form-items="productViewItems"
    />

    <DeleteModal
      v-model:open="isDeleteModalOpen" :item-name="currentRecord ? currentRecord.descripcion : ''"
      @confirmed="handleSoftDeleteItemConfirmed"
    />

    <InfoModal
      v-model:open="isActivateModalOpen" title="Confirmar Activación"
      :message="`¿Está seguro de que desea activar al registro **${currentRecord ? currentRecord.descripcion : ''}**?`"
      @confirmed="handleActivateItemConfirmed"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';

import ReusableDataGrid from '~/components/elements/ReusableDataGrid.vue';
import DeleteModal from '~/components/elements/DeleteModal.vue';
import ViewModal from '~/components/elements/ViewModal.vue';
import InfoModal from '~/components/elements/InfoModal.vue';

import ProductForm from './products.vue'; // Asumida la ruta

import { useDataGrid, type GridItem } from '~/composables/useDataGrid';

// --- 1. Tipado Específico para Productos (EXTENDIDO) ---
interface Product extends GridItem {
  id: number;
  tipo: 'Producto' | 'Servicio' | 'Insumo';
  esServicio: boolean;
  descripcion: string;
  codigo: string;
  codigoBarra: string; // Nuevo
  condicion: 'Nuevo' | 'Usado';
  unidadMedida: string; // Nuevo
  precioVenta: number;
  precioCosto: number; // Necesario para la vista de detalles
  margenGanancia: number; // Necesario para la vista de detalles
  stockActual: number;
  estanteria: string;
  estado: 'Activo' | 'Inactivo';
  EsActivo: boolean;
  notas: string; // Nuevo
}

// --- 2. Datos Mock de Ejemplo (EXTENDIDO y DETALLADO) ---
const mockData = ref<Product[]>([
  {
    id: 1,
    tipo: 'Producto',
    esServicio: false,
    descripcion: 'Aceite Sintético 5W-30 (Galón) de Alto Rendimiento. Cumple con normativas API SN.',
    codigo: 'AC-5W30-G',
    codigoBarra: '800555123456',
    condicion: 'Nuevo',
    unidadMedida: 'Galón (Gl.)',
    precioCosto: 500.00,
    margenGanancia: 50.00,
    precioVenta: 750.00,
    stockActual: 150,
    estanteria: 'A-05-B',
    estado: 'Activo',
    EsActivo: true,
    notas: 'Producto con alta rotación. Se recomienda mantener stock de seguridad.',
  },
  {
    id: 2,
    tipo: 'Servicio',
    esServicio: true,
    descripcion: 'Diagnóstico Electrónico General utilizando escáner de última generación.',
    codigo: 'SRV-DIAG01',
    codigoBarra: '',
    condicion: 'Nuevo',
    unidadMedida: 'Unidad (Und.)',
    precioCosto: 150.00,
    margenGanancia: 233.33,
    precioVenta: 500.00,
    stockActual: 0,
    estanteria: 'N/A',
    estado: 'Activo',
    EsActivo: true,
    notas: 'Requiere 1 hora de trabajo técnico.',
  },
  {
    id: 3,
    tipo: 'Insumo',
    esServicio: false,
    descripcion: 'Filtro de Aire estándar para Modelo FDX, compatible con versiones 2018-2023.',
    codigo: 'FIL-AIRE-FDX',
    codigoBarra: '800555789012',
    condicion: 'Nuevo',
    unidadMedida: 'Unidad (Und.)',
    precioCosto: 100.00,
    margenGanancia: 50.00,
    precioVenta: 150.00,
    stockActual: 30,
    estanteria: 'C-01-A',
    estado: 'Activo',
    EsActivo: true,
    notas: 'Insumo esencial, se pide por lote de 100 unidades.',
  },
  {
    id: 4,
    tipo: 'Producto',
    esServicio: false,
    descripcion: 'Batería Automotriz 12V Usada, reacondicionada, con 3 meses de garantía.',
    codigo: 'BAT-12V-U',
    codigoBarra: '800555456789',
    condicion: 'Usado',
    unidadMedida: 'Unidad (Und.)',
    precioCosto: 600.00,
    margenGanancia: 33.33,
    precioVenta: 800.00,
    stockActual: 5,
    estanteria: 'A-02-C',
    estado: 'Inactivo',
    EsActivo: false,
    notas: 'Requiere validación de carga antes de la venta.',
  }
]);

// --- 3. Uso del Composable y Variable showAll (Se mantienen) ---
const {
    data,
    currentDataSource,
    addItem,
    updateItem,
    softDeleteItem,
    activateItem,
    refreshData,
    showAll
} = useDataGrid<Product>(
  mockData.value,
  'id'
);

// --- 4. Estado de los Modales (Se mantienen) ---
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const isViewModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isActivateModalOpen = ref(false);

const currentRecord = ref<Product | null>(null);

// Sincronizar el campo visual 'estado' (Se mantiene)
watch(data, (newVal) => {
  newVal.forEach(item => {
    item.estado = item.EsActivo ? 'Activo' : 'Inactivo';
  });
}, { deep: true, immediate: true });


// --- 5. Definición de FormItems para ViewModal (EXTENDIDO) ---
// Se ha extendido para incluir los nuevos campos y los campos de precio
const productFormItems = ref([
  { dataField: 'codigo', caption: 'Código', colSpan: 1, validationRules: [{ type: 'required', message: 'Código es requerido' }] },
  { dataField: 'codigoBarra', caption: 'Código de Barra', colSpan: 1 },
  { dataField: 'tipo', caption: 'Tipo de Inventario', colSpan: 1, editorType: 'dxSelectBox', editorOptions: { items: ['Producto', 'Servicio', 'Insumo'], placeholder: 'Seleccione un tipo' }, validationRules: [{ type: 'required', message: 'Tipo es requerido' }] },
  { dataField: 'condicion', caption: 'Condición', colSpan: 1, editorType: 'dxSelectBox', editorOptions: { items: ['Nuevo', 'Usado'], placeholder: 'Seleccione la condición' }, validationRules: [{ type: 'required', message: 'Condición es requerida' }] },
  { dataField: 'unidadMedida', caption: 'Unidad de Medida', colSpan: 1 },
  { dataField: 'esServicio', caption: 'Es Servicio', colSpan: 1, editorType: 'dxSwitch', editorOptions: { text: 'Sí / No' } },
  { dataField: 'descripcion', caption: 'Descripción', colSpan: 3, editorType: 'dxTextArea', editorOptions: { height: 70 } },

  // Detalle de Precios
  { dataField: 'precioCosto', caption: 'Precio de Costo', colSpan: 1, editorType: 'dxNumberBox', format: '#,##0.00' },
  { dataField: 'margenGanancia', caption: 'Margen (%)', colSpan: 1, editorType: 'dxNumberBox', format: '##0.00' },
  { dataField: 'precioVenta', caption: 'Precio Venta', colSpan: 1, editorType: 'dxNumberBox', format: '#,##0.00' },

  // Detalle de Inventario y Notas
  { dataField: 'stockActual', caption: 'Stock Actual', colSpan: 1, editorType: 'dxNumberBox' },
  { dataField: 'estanteria', caption: 'Ubicación (Estantería)', colSpan: 1 },
  { dataField: 'estado', caption: 'Estado', colSpan: 1 },
  { dataField: 'notas', caption: 'Notas', colSpan: 3, editorType: 'dxTextArea', editorOptions: { height: 70 } },
]);

const productViewItems = computed(() => {
    return productFormItems.value.map(item => ({
        dataField: item.dataField,
        caption: item.caption,
        colSpan: item.colSpan,
    }));
});

// --- 6. Definición de Columnas (Añadido 'unidadMedida') ---
const columns = ref([
  { dataField: 'codigo', caption: 'Código', width: 100, allowFiltering: true, alignment: 'center' },
  { dataField: 'descripcion', caption: 'Descripción del Elemento', minWidth: 250, allowFiltering: true },
  { dataField: 'tipo', caption: 'Tipo', width: 100, allowFiltering: true },
  { dataField: 'condicion', caption: 'Condición', width: 90, allowFiltering: true },
  { dataField: 'unidadMedida', caption: 'Unidad', width: 100, allowFiltering: true },
  { dataField: 'precioVenta', caption: 'P. Venta', dataType: 'number', format: '#,##0.00', width: 110, alignment: 'right', allowFiltering: true },
  {
    dataField: 'stockActual',
    caption: 'Stock',
    dataType: 'number',
    width: 80,
    alignment: 'center',
    allowFiltering: true,
    cellTemplate: (container: any, options: any) => {
        // ... (Lógica de stock condicional se mantiene)
        if (options.data.esServicio) {
            container.textContent = 'N/A';
            container.style.color = '#718096';
        } else {
            container.textContent = options.value;
            if (options.value < 10 && options.value > 0) {
                 container.style.backgroundColor = 'rgba(252, 211, 77, 0.4)';
                 container.style.fontWeight = 'bold';
            } else if (options.value === 0) {
                 container.style.backgroundColor = 'rgba(248, 113, 113, 0.4)';
                 container.style.fontWeight = 'bold';
            }
        }
    }
  },
  { dataField: 'estanteria', caption: 'Ubicación', width: 90, alignment: 'center', allowFiltering: true },
  {
    dataField: 'estado',
    caption: 'Estado',
    width: 90,
    alignment: 'center',
    allowFiltering: true,
    cellTemplate: (container: any, options: any) => {
        // ... (Lógica de estado se mantiene)
        const span = document.createElement('span');
        const isActive = options.value === 'Activo';
        span.textContent = options.value;
        span.className = `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`;
        container.appendChild(span);
    }
  },
  {
    type: 'buttons',
    caption: 'Acciones',
    width: 150,
    fixed: true,
    fixedPosition: 'right',
    buttons: [
      { hint: 'Ver Detalles', icon: 'eyeopen', onClick: (e: any) => handleViewClick(e.row.data) },
      { hint: 'Editar', icon: 'edit', onClick: (e: any) => handleEditClick(e.row.data) },
      {
        hint: 'Desactivar',
        icon: 'remove',
        cssClass: 'text-red-600',
        visible: (e: any) => e.row.data.estado === 'Activo',
        onClick: (e: any) => handleSoftDeleteClick(e.row.data)
      },
      {
        hint: 'Activar',
        icon: 'check',
        cssClass: 'text-green-600',
        visible: (e: any) => e.row.data.estado === 'Inactivo',
        onClick: (e: any) => handleActivateClick(e.row.data)
      }
    ]
  }
]);


// --- 7. Lógica de Apertura de Modales (Se mantiene) ---
const handleAddClick = () => {
  currentRecord.value = null;
  isEditing.value = false;
  isFormModalOpen.value = true;
};

const handleViewClick = (data: Product) => {
  currentRecord.value = data;
  isViewModalOpen.value = true;
};

const handleEditClick = (data: Product) => {
  currentRecord.value = data;
  isEditing.value = true;
  isFormModalOpen.value = true;
};

const handleSoftDeleteClick = (data: Product) => { currentRecord.value = data; isDeleteModalOpen.value = true; };
const handleActivateClick = (data: Product) => { currentRecord.value = data; isActivateModalOpen.value = true; };
const handleRefresh = () => { console.log('Datos refrescados (simulación API)'); };


// --- 8. Lógica de Submisión y Cierre de Modales (Corregida la asignación de ID) ---
const handleFormSaved = (formData: Product) => {
  if (isEditing.value) {
    // Modo Edición: Se asume que formData ya trae el ID
    updateItem(formData);
    console.log('Producto actualizado:', formData);
  } else {
    // Modo Creación: Añade ID y campos de estado
    const newItem = {
      ...formData,
      EsActivo: true,
      estado: 'Activo',
      // Genera un ID secuencial para la data mock
      id: data.value.length > 0 ? Math.max(...data.value.map(item => item.id)) + 1 : 1
    } as Product;
    addItem(newItem);
    console.log('Producto agregado:', newItem);
  }

  // Cierra el modal y limpia el estado
  isFormModalOpen.value = false;
  isEditing.value = false;
  currentRecord.value = null;
};

// ... (El resto de funciones de activación/desactivación se mantienen)
const handleSoftDeleteItemConfirmed = () => {
  if (currentRecord.value) {
    softDeleteItem(currentRecord.value);
    isDeleteModalOpen.value = false;
    console.log(`Producto ${currentRecord.value.descripcion} desactivado.`);
  }
};

const handleActivateItemConfirmed = () => {
  if (currentRecord.value) {
    activateItem(currentRecord.value);
    isActivateModalOpen.value = false;
    console.log(`Producto ${currentRecord.value.descripcion} activado.`);
  }
};
</script>
