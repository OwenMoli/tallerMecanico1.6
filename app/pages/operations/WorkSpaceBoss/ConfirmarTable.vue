<template>
  <div class="w-full h-screen flex flex-col">
    <UDashboardPanel class="flex-1 relative">
      <div class="flex w-full h-full space-x-6 p-8 bg-gray-100">

        <div class="flex-1 bg-white rounded-lg shadow-lg p-6">
          <DxDataGrid
            :data-source="receptionOrders" :show-borders="true"
            :show-row-lines="true"
            :allow-column-reordering="true"
            :allow-column-resizing="true"
            key-expr="id"
            :column-auto-width="true"
            height="calc(100vh - 200px)"
            ref="dataGridInstance"
            :focused-row-enabled="true"
            :focused-row-key="focusedOrderId">

            <DxHeaderFilter :visible="true" />
            <DxSearchPanel :visible="true" />
            
            <DxColumn data-field="id" caption="Orden" alignment="center" header-alignment="center" cell-template="id-cell" />
            <template #id-cell="{ data }">
              <a href="#" class="text-blue-600 font-semibold hover:underline" @click.prevent="openPdf(data.data.id)">
                {{ data.data.id }}
              </a>
            </template>
            <DxColumn data-field="recepcion" caption="Recepcion" alignment="center" header-alignment="center" :column-auto-width="true" />
            <DxColumn data-field="fecha" caption="F. Recepcion" data-type="date" :customize-text="formatDate" alignment="center" header-alignment="center" :column-auto-width="true" />
            <DxColumn data-field="cliente" caption="Cliente" alignment="center" header-alignment="center" :column-auto-width="true" />
            <DxColumn data-field="placa" caption="Placa" alignment="center" header-alignment="center" :column-auto-width="true" />
            <DxColumn data-field="coche" caption="Coche" alignment="center" header-alignment="center" :column-auto-width="true" />

            <DxColumn data-field="mecanico" caption="Mecánico" cell-template="mechanic-cell" :column-auto-width="true" />
            
            <DxColumn data-field="priority" caption="Prioridad" cell-template="priority-dropdown" alignment="center" header-alignment="center" :column-auto-width="true" />
            <template #priority-dropdown="{ data }">
              <select
                :value="data.data.priority ? data.data.priority.toUpperCase() : 'NORMAL'"
                @change="event => handlePriorityChange(data.data, event.target.value)" :class="getPriorityClass(data.data.priority)"
                class="w-full text-center px-2 py-1 rounded-md border-2 cursor-pointer transition-colors">
                <option value="URGENTE">URGENTE</option>
                <option value="PRIORITARIO">PRIORITARIO</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            </template>

            <DxColumn data-field="status" caption="Status" cell-template="status-cell" alignment="center" header-alignment="center" :allow-header-filtering="true" :column-auto-width="true" />
            <DxColumn alignment="center" cell-template="actions-cell" :column-auto-width="true" />

            <template #actions-cell="{ data }">
              <UDropdownMenu :items="actionItems(data.data)">
                <UButton color="gray" size="sm" icon="i-heroicons-bars-4" variant="ghost" class="cursor-pointer hover:bg-gray-100" />
              </UDropdownMenu>
            </template>

            <template #mechanic-cell="{ data }">
              <div class="mechanic-drop-area h-full w-full flex items-center justify-center p-2 rounded"
                :class="{ 'border-2 border-dashed border-blue-500 bg-blue-50': isOverDropZone(data.data.id) }"
                @dragover.prevent
                @dragenter="onDragEnter(data.data.id)"
                @dragleave="onDragLeave"
                @drop="onCellDrop($event, data.data)"> {{ data.data.mecanico || 'Arrastra un mecánico' }}
              </div>
            </template>

            <template #status-cell="{ data }">
              <span class="px-3 py-1 rounded-full text-white text-sm font-semibold" :class="getStatusClass(data.data.status)">
                {{ data.data.status }}
              </span>
            </template>
          </DxDataGrid>
        </div>
      </div>
    </UDashboardPanel>
  </div>

  <transition name="slide">
    <OrderSidebar
      v-if="selectedOrder"
      :order="selectedOrder"
      :isSaved="isSaved"
      :isBoss="true"
      @close="selectedOrder = null"
      @save="(notesValue) => { notes = notesValue; saveComment() }"
      @deny="denegar"
      @remove-denial="removeDenial"
      @send-to-boss="aprobar"
      @open-pdf="openPdf"
      @remove-file="removeFile"
      @file-change="handleFileChange"
      @editing="isSaved = false"
    />
  </transition>

  <InfoModal
    :open.sync="infoModalOpen"
    :title="infoModalTitle"
    :message="infoModalMessage"
    :show-confirm="infoModalShowConfirm"
    :show-cancel="infoModalShowCancel"
    :show-input="infoModalShowInput"
    v-model="infoModalInput"
    @confirmed="handleModalConfirm(infoModalInput)"
    @canceled="handleModalCancel"
  />

  <NotificationActionModal
    :is-open="notificationActionModalOpen"
    :order-id="notificationActionOrder?.id || ''"
    :car-model="notificationActionOrder?.coche || ''"
    :mechanic-name="notificationActionOrder?.mecanico || ''"
    @close="notificationActionModalOpen = false"
    @submit="handleNotificationSubmit"
  />
</template>

<script setup>
/* ============================
    I. IMPORTS
============================ */
import { ref, computed, watch } from 'vue'
// ➡️ Importamos la Store de Órdenes
import { useWorkOrdersStore } from '~/store/workOrdersStore' 
// ➡️ Importamos la Store de Mecánicos si es necesario, o la data si es estática
// import { useMechanicStore } from '~/stores/mechanicStore' 


import { DxDataGrid, DxColumn, DxHeaderFilter, DxSearchPanel } from 'devextreme-vue/data-grid'
import InfoModal from '~/components/elements/InfoModal.vue'
import OrderSidebar from '~/components/mecanicos/OrderSidebar.vue'
import NotificationMenu from '~/components/mecanicos/notificaciones.vue'
import NotificationActionModal from '~/components/mecanicos/notificacionesModal.vue'

// ➡️ Inicializamos la Store
const store = useWorkOrdersStore() 


/* ============================
    II. PROPS & EMITS 
============================ */
// ❌ ELIMINAMOS PROPS Y EMITS RELACIONADOS CON DATOS CENTRALES
// const props = defineProps({ allData: { type: Array, required: true } })
// const emit = defineEmits(['update-order'])


/* ============================
    III. STATE (refs/reactive)
============================ */
// ❌ ELIMINAMOS localData y el watcher de props
// const localData = ref([...props.allData]) 
const dataGridInstance = ref(null)
const focusedOrderId = ref(null)

const selectedOrder = ref(null)
const isSaved = ref(true)
const notes = ref('')

const notificationActionModalOpen = ref(false)
const notificationActionOrder = ref(null)

// ➡️ PROPIEDAD COMPUTADA: FILTRO DE ÓRDENES (Lectura de Pinia)
const receptionOrders = computed(() => {
  // Leemos el array directamente del Store: store.activeOrders
  return store.activeOrders.filter(order => 
    order.status === 'Completado'||
    order.status === 'Cotizando' // Ajusta el filtro según las órdenes de 'Recepción'
  );
});

/* ============================
    IV. WATCHERS
============================ */
// ❌ ELIMINAMOS el watcher de props.allData

/* ============================
    V. MECÁNICOS (Ahora usa el array de Pinia para el conteo)
============================ */
const mecanicosData = ref([ /* ... datos estáticos de rangos/mecánicos ... */ ])

const mecanicosDataWithCount = computed(() => {
  // ➡️ Usa el array reactivo de Pinia: store.activeOrders
  const taskCounts = store.activeOrders.reduce((acc, item) => {
    if (item.mecanico) acc[item.mecanico] = (acc[item.mecanico] || 0) + 1
    return acc
  }, {})
  return mecanicosData.value.map(rango => ({
    ...rango,
    mecanicos: rango.mecanicos.map(m => ({
      ...m,
      tareasAsignadas: taskCounts[m.nombre] || 0
    }))
  }))
})

/* ============================
    VI. MODAL (InfoModal) - Sigue igual
============================ */
const infoModalOpen = ref(false)
const infoModalTitle = ref('')
const infoModalMessage = ref('')
const infoModalShowConfirm = ref(true)
const infoModalShowCancel = ref(true)
const infoModalShowInput = ref(false)
const infoModalInput = ref('')
const infoModalOnConfirmRef = ref(null)
const infoModalOnCancelRef = ref(null)

const showModal = (message, title = 'Aviso', showConfirm = true, showCancel = true, showInput = false, initialValue = '', onConfirm, onCancel) => {
  infoModalTitle.value = title
  infoModalMessage.value = message
  infoModalShowConfirm.value = showConfirm
  infoModalShowCancel.value = showCancel
  infoModalShowInput.value = showInput
  infoModalInput.value = initialValue
  infoModalOnConfirmRef.value = onConfirm || null
  infoModalOnCancelRef.value = onCancel || null
  infoModalOpen.value = true
}
const handleModalConfirm = (input) => {
  if (infoModalOnConfirmRef.value) infoModalOnConfirmRef.value(input)
  infoModalOpen.value = false
}
const handleModalCancel = () => {
  if (infoModalOnCancelRef.value) infoModalOnCancelRef.value()
  infoModalOpen.value = false
}

/* ============================
    VII. FUNCIONES UTILITARIAS - Siguen iguales
============================ */
const openPdf = (id) => {
  const pdfUrl = '/Autorizacion.pdf'
  window.open(pdfUrl, '_blank')
}
const formatDate = (cellInfo) => {
  if (!cellInfo.value) return ''
  const date = new Date(cellInfo.value)
  if (isNaN(date)) return cellInfo.value
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}
const getMecanicoClass = (t) => t > 4 ? 'bg-red-100 border border-red-400' : t > 2 ? 'bg-yellow-100 border border-yellow-400' : 'bg-white border border-gray-200'
const getPriorityClass = (priority) => {
  const p = priority ? priority.toUpperCase() : 'NORMAL'
  switch (p) {
    case 'URGENTE': case 'ALTA': return 'bg-red-200 text-red-800 border-red-400 hover:bg-red-300'
    case 'PRIORITARIO': case 'MEDIA': return 'bg-orange-100 text-orange-700 border-orange-400 hover:bg-orange-200'
    default: return 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-200'
  }
}
const getStatusClass = (status) => {
  switch (status) {
    case 'En Espera': return 'bg-gray-400 text-black'
    case 'Completado': return 'bg-green-500 text-white'
    case 'Diagnostico': return 'bg-blue-500 text-white'
    case 'En Curso': case 'En Proceso': return 'bg-yellow-500 text-black'
    case 'Pausado': return 'bg-orange-500 text-white'
    case 'Pruebas': return 'bg-lime-500 text-lime-900'
    case 'Pendiente': return 'bg-yellow-600 text-black'
    case 'Rechazado': return 'bg-red-500 text-white'
    case 'Denegado': return 'bg-red-800 text-white'
    case 'Cotizando': return 'bg-purple-500 text-white'
    default: return 'bg-gray-400 text-black'
  }
}

/* ============================
    VIII. DRAG & DROP (Llama a store.updateOrder)
============================ */
const draggedMechanic = ref(null)
const dropTargetId = ref(null)
const onDragStart = (event, mecanico) => { draggedMechanic.value = mecanico }
const onDragEnd = () => { draggedMechanic.value = null }
const onDragEnter = (id) => { dropTargetId.value = id }
const onDragLeave = () => { dropTargetId.value = null }
const onCellDrop = (event, rowData) => { // ⬅️ Recibimos el objeto de la fila
  event.preventDefault()
  if (!draggedMechanic.value) return

  // 1. Modificamos el objeto que vino de la grilla
  rowData.mecanico = draggedMechanic.value.nombre
  if (rowData.status === 'Pendiente') rowData.status = 'En Espera'

  // 2. Llamamos directamente a la acción del Store
  store.updateOrder(rowData) 

  draggedMechanic.value = null
  dropTargetId.value = null
}
const isOverDropZone = (id) => dropTargetId.value === id

/* ============================
    IX. ACCIONES (ORDENES) (Llama a store.updateOrder)
============================ */
const actionItems = (row) => [[
  // Las funciones aquí se actualizan para modificar la fila y llamar a store.updateOrder
  { label: '✅ Aprobar', onClick: () => aprobar(row) },
  { label: '🔁 Rechazar', onClick: () => rechazado(row) },
  { label: '🚫 Denegar', onClick: () => denegar(row) },
], 
[
  //{ label: row.status === 'Pausado' ? '▶️ Reanudar' : '⏸️ Pausar', onClick: () => togglePausa(row) },
  { label: '🔔 Notificación', onClick: () => notificar(row) },
  //{ label: '❌ Quitar Mecanico', onClick: () => quitarMecanico(row) },
  { label: '📚 Historial', onClick: () => historial(row) },
  { label: '🔍 Detalles', onClick: () => verDetalles(row) },
]]

// Función de utilidad para manejar el cambio de prioridad
const handlePriorityChange = (row, newPriority) => {
    // 1. Clonamos la fila o la modificamos directamente (Vue/DevExtreme puede hacer reactiva la fila)
    row.priority = newPriority.toUpperCase();
    
    // 2. Llamamos al Store para guardar el cambio globalmente
    store.updateOrder(row);
}

const togglePausa = (row) => {
    row.status = row.status === 'Pausado' ? row._prevStatus || 'Pendiente' : (row._prevStatus = row.status, 'Pausado');
    store.updateOrder(row); 
}
const aprobar = (row) => showModal(`¿Aprobar orden ${row.id}?`, 'Confirmar Aprobación', true, true, false, '', () => { 
    row.status = 'Cotizando'; 
    store.updateOrder(row); 
})
const rechazado = (row) => showModal(`¿Rechazar orden ${row.id}?`, 'Confirmar Rechazo', true, true, false, '', () => { 
    row.status = 'Rechazado'; 
    store.updateOrder(row); 
})
const denegar = (row) => showModal('Ingrese motivo:', 'Denegar Orden', true, true, true, '', (motivo) => { 
    row.status = 'Denegado'; 
    row.denegada = true; 
    row.motivoDenegada = motivo || ''; 
    store.updateOrder(row); 
})
const historial = (row) => { window.open('/operations/WorkSpaceBoss/historial', '_blank');}
const notificar = (row) => { notificationActionOrder.value = row; notificationActionModalOpen.value = true }
const handleNotificationSubmit = (data) => showModal(`Notificación enviada para la orden ${data.orderId}. Motivo: ${data.reason}`, 'Notificación Enviada', false, true)
const quitarMecanico = (row) => row.mecanico ? showModal(`¿Quitar a ${row.mecanico}?`, 'Confirmar Acción', true, true, false, '', () => { 
    row.status = 'Pendiente'; 
    row.mecanico = ''; 
    store.updateOrder(row);
}) : showModal(`La orden ${row.id} no tiene mecánico.`, 'Información', false, true)
const verDetalles = (row) => { selectedOrder.value = row }

/* ============================
    X. NOTAS Y COMENTARIOS (Llama a store.updateOrder)
============================ */
const saveComment = () => {
  if (selectedOrder.value) {
    selectedOrder.value.comentarioJefe = notes.value.trim()
    isSaved.value = true
    // ➡️ Llamada directa a Pinia
    store.updateOrder(selectedOrder.value) 
  }
}

/* ============================
    XI. HIGHLIGHT (Notificaciones) - Sigue igual
============================ */
const highlightOrder = (id) => {
  focusedOrderId.value = id
  dataGridInstance.value.instance.navigateToRow(id)
}
</script>

<style scoped>
.cursor-grab { cursor: grab; }
.cursor-grab:active { cursor: grabbing; }
.mechanic-drop-area { transition: background-color 0.2s, border-color 0.2s; }
.dx-row-focused { background-color: #b3e7ff !important; }
</style>