<template>
  <div class="w-full h-screen flex flex-col">
    <UDashboardPanel class="flex-1 relative">
      <div class="flex w-full h-full space-x-6 p-8 bg-gray-100">

        <div class="flex-none w-1/6">
          <h2 class="text-xl font-bold mb-6 text-gray-800">Mecánicos Disponibles</h2>
          <div v-for="rango in mecanicosDataWithCount" :key="rango.id"
            class="mb-3 rounded-lg overflow-hidden shadow-sm">
            <details class="group">
              <summary
                class="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-100 font-semibold">
                {{ rango.nombre }}
                <span class="transition-transform group-open:rotate-90">▶</span>
              </summary>
              <div class="p-2 bg-white">
                <div v-for="mecanico in rango.mecanicos" :key="`${rango.id}-${mecanico.id}`">
                  <UCard
                    class="mb-2 h-16 px-4 py-2 flex items-center justify-between shadow-sm border rounded-md cursor-grab"
                    :class="getMecanicoClass(mecanico.tareasAsignadas)" draggable="true"
                    @dragstart="onDragStart($event, mecanico)" @dragend="onDragEnd">
                    <div class="flex flex-col justify-center w-full">
                      <span class="font-semibold text-gray-900 text-base leading-tight">
                        {{ mecanico.nombre }}
                      </span>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-500 text-xs leading-tight">Tareas Asignadas</span>
                        <span class="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white" :class="{
                          'bg-red-500': mecanico.tareasAsignadas > 4,
                          'bg-yellow-500': mecanico.tareasAsignadas > 2 && mecanico.tareasAsignadas <= 4,
                          'bg-green-500': mecanico.tareasAsignadas <= 2
                        }">
                          {{ mecanico.tareasAsignadas }}
                        </span>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
            </details>
          </div>
        </div>

        <NotificationMenu class="absolute top-4 right-4 z-50" @selectAndHighlightOrder="highlightOrder"
          :user-nombre="currentUser.nombre" :user-rol="currentUser.rol" />

        <div class="flex-1 bg-white rounded-lg shadow-lg p-6">
          <DxDataGrid :data-source="receptionOrders" :show-borders="true" :show-row-lines="true"
            :allow-column-reordering="true" :allow-column-resizing="true" key-expr="id" :column-auto-width="true"
            height="calc(100vh - 200px)" ref="dataGridInstance" :focused-row-enabled="true"
            :focused-row-key="focusedOrderId" :scrolling="{ mode: 'standard', showScrollbar: 'always' }">
            <DxPaging :page-size="10" />

            <DxPager :visible="true" :show-page-size-selector="true" :allowed-page-sizes="[10, 15, 30, 50]"
              :show-info="true" :show-navigation-buttons="true" />

            <DxHeaderFilter :visible="true" />
            <DxSearchPanel :visible="true" />

            <DxColumn data-field="id" caption="Orden" alignment="center" header-alignment="center"
              cell-template="id-cell" />
            <template #id-cell="{ data }">
              <a href="#" class="text-blue-600 font-semibold hover:underline" @click.prevent="openPdf(data.data.id)">
                {{ data.data.id }}
              </a>
            </template>
            <DxColumn data-field="recepcion" caption="Recepcion" alignment="center" header-alignment="center"
              :column-auto-width="true" />
            <DxColumn data-field="fecha" caption="F. Recepcion" data-type="date" :customize-text="formatDate"
              alignment="center" header-alignment="center" :column-auto-width="true" />
            <DxColumn data-field="cliente" caption="Cliente" alignment="center" header-alignment="center"
              :column-auto-width="true" />
            <DxColumn data-field="placa" caption="Placa" alignment="center" header-alignment="center"
              :column-auto-width="true" />
            <DxColumn data-field="coche" caption="Coche" alignment="center" header-alignment="center"
              :column-auto-width="true" />



            <DxColumn data-field="mecanico" caption="Mecánico" cell-template="mechanic-cell"
              :column-auto-width="true" />

            <template #mechanic-cell="{ data }">
              <div class="mechanic-drop-area h-full w-full flex items-center justify-center p-2 rounded cursor-info"
                :class="{ 'border-2 border-dashed border-blue-500 bg-blue-50': isOverDropZone(data.data.id) }"
                @dragover.prevent @dragenter="onDragEnter(data.data.id)" @dragleave="onDragLeave"
                @drop="onCellDrop($event, data.data)"
                :title="data.data.mecanico ? formatAssignmentDate(data.data.mecanicoAsignadoFecha) : 'Arrastra aquí para asignar un mecánico'">

                {{ data.data.mecanico || 'Arrastra un mecánico' }}
              </div>
            </template>


            <DxColumn data-field="priority" caption="Prioridad" cell-template="priority-dropdown" alignment="center"
              header-alignment="center" :column-auto-width="true" />
            <template #priority-dropdown="{ data }">
              <select :value="data.data.priority ? data.data.priority.toUpperCase() : 'NORMAL'"
                @change="event => handlePriorityChange(data.data, event.target.value)"
                :class="getPriorityClass(data.data.priority)"
                class="w-full text-center px-2 py-1 rounded-md border-2 cursor-pointer transition-colors">
                <option value="URGENTE">Alta</option>
                <option value="PRIORITARIO">Media</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            </template>

            <DxColumn data-field="status" caption="Status" cell-template="status-cell" alignment="center"
              header-alignment="center" :allow-header-filtering="true" :column-auto-width="true" />
            <DxColumn alignment="center" cell-template="actions-cell" :column-auto-width="true" />

            <template #actions-cell="{ data }">
              <UDropdownMenu :items="actionItems(data.data)">
                <UButton color="gray" size="sm" icon="i-heroicons-bars-4" variant="ghost"
                  class="cursor-pointer hover:bg-gray-100" />
              </UDropdownMenu>
            </template>

            <template #status-cell="{ data }">
              <span class="px-3 py-1 rounded-full text-white text-sm font-semibold"
                :class="getStatusClass(data.data.status)">
                {{ data.data.status }}
              </span>
            </template>
          </DxDataGrid>
        </div>
      </div>
    </UDashboardPanel>
  </div>

  <transition name="slide">
    <OrderSidebar v-if="selectedOrder" :order="selectedOrder" :isSaved="isSaved" :isBoss="true"
      @close="selectedOrder = null" @save="(notesValue) => { notes = notesValue; saveComment() }" @deny="denegar"
      @remove-denial="removeDenial" @send-to-boss="aprobar" @open-pdf="openPdf" @remove-file="removeFile"
      @file-change="handleFileChange" @editing="isSaved = false" />
  </transition>

  <InfoModal :open.sync="infoModalOpen" :title="infoModalTitle" :message="infoModalMessage"
    :show-confirm="infoModalShowConfirm" :show-cancel="infoModalShowCancel" :show-input="infoModalShowInput"
    v-model="infoModalInput" @confirmed="handleModalConfirm(infoModalInput)" @canceled="handleModalCancel" />

  <NotificationActionModal :is-open="notificationActionModalOpen" :order-id="notificationActionOrder?.id || ''"
    :car-model="notificationActionOrder?.coche || ''" :mechanic-name="notificationActionOrder?.mecanico || ''"
    :user-nombre="currentUser.nombre" :user-rol="currentUser.rol" :orderStatus="notificationActionOrder?.status || ''"
    @close="notificationActionModalOpen = false" />

</template>

<script setup>


/* ============================
    I. IMPORTS
============================ */
import { ref, computed } from 'vue'

// Stores de Pinia
import { useWorkOrdersStore } from '~/store/workOrdersStore'
import { useHistoryStore } from '~/store/historyStore'
import { useMecanicosStore } from '~/store/mecanicosStore'

// Componentes DevExtreme y Vue
import { DxDataGrid, DxColumn, DxHeaderFilter, DxSearchPanel, DxPaging, DxPager } from 'devextreme-vue/data-grid'
import InfoModal from '~/components/elements/InfoModal.vue'
import OrderSidebar from '~/components/mecanicos/OrderSidebar.vue'
import NotificationMenu from '~/components/mecanicos/notificaciones.vue'
import NotificationActionModal from '~/components/mecanicos/notificacionesModal.vue'

// Inicializamos ambas Stores
const store = useWorkOrdersStore()
const historyStore = useHistoryStore()
const mecanicosStore = useMecanicosStore()

/* ============================
    II. DATOS DEL USUARIO
============================ */
// Define el usuario que realiza la acción (Jefe) dependiendo el rol funcionaran diferente los 
// componentes de notificacion y el Modal de info lateral
const currentUser = {
  nombre: 'Orlando Mendez',
  rol: 'Jefe Mecanico',
}

/* ============================
    III. STATE (refs/reactive)
============================ */
const dataGridInstance = ref(null)
const focusedOrderId = ref(null)

const selectedOrder = ref(null)
const isSaved = ref(true)
const notes = ref('')

const notificationActionModalOpen = ref(false)
const notificationActionOrder = ref(null)

const receptionOrders = computed(() => {
  return store.activeOrders;
});


/* ============================
    IV. MECÁNICOS 
============================ */


const baseMecanicosData = computed(() => mecanicosStore.getMecanicosData);

const mecanicosDataWithCount = computed(() => {
  const taskCounts = store.activeOrders.reduce((acc, item) => {
    if (item.mecanico) acc[item.mecanico] = (acc[item.mecanico] || 0) + 1
    return acc
  }, {})
  // Usamos baseMecanicosData.value
  return baseMecanicosData.value.map(rango => ({
    ...rango,
    mecanicos: rango.mecanicos.map(m => ({
      ...m,
      tareasAsignadas: taskCounts[m.nombre] || 0
    }))
  }))
})

/* ============================
    V. MODAL (InfoModal) 
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
    VI. FUNCIONES UTILITARIAS 
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

const formatAssignmentDate = (isoDate) => {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    const datePart = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const timePart = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return `Asignado: ${datePart} a las ${timePart} hrs.`;
  } catch (e) {
    console.error("Error al parsear la fecha de asignación:", e);
    return '';
  }
};

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
    case 'Taller': case 'En Proceso': return 'bg-yellow-500 text-black'
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
    VII. DRAG & DROP Y TRAZABILIDAD 💡 MODIFICADO
============================ */
const draggedMechanic = ref(null)
const dropTargetId = ref(null)
const onDragStart = (event, mecanico) => { draggedMechanic.value = mecanico }
const onDragEnd = () => { draggedMechanic.value = null }
const onDragEnter = (id) => { dropTargetId.value = id }
const onDragLeave = () => { dropTargetId.value = null }

// En la sección VII. DRAG & DROP Y TRAZABILIDAD

const onCellDrop = (event, rowData) => {
  event.preventDefault()
  if (!draggedMechanic.value) return

  const oldMechanic = rowData.mecanico
  const newMechanic = draggedMechanic.value.nombre

  // Evitar asignación si el mecánico ya está asignado
  if (oldMechanic === newMechanic) return;

  // 💡 LÓGICA AGREGADA: Registrar la fecha/hora de asignación
  // Esto solo se actualiza si el mecánico es diferente al actual.
  rowData.mecanico = newMechanic
  rowData.mecanicoAsignadoFecha = new Date().toISOString() // 👈 AQUÍ SE GUARDA LA FECHA/HORA

  if (rowData.status === 'Pendiente') rowData.status = 'En Espera'

  store.updateOrder(rowData)

  //  REGISTRAR EN EL HISTORIAL: Asignación de Mecánico
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: "Mecánico Asignado",
    comentario: `Mecánico asignado: ${newMechanic}. (Anterior: ${oldMechanic || 'N/A'}).`,
    orden: rowData.id,
    estado: rowData.status,
    pausado: rowData.status === 'Pausado',
  })

  draggedMechanic.value = null
  dropTargetId.value = null
}


const isOverDropZone = (id) => dropTargetId.value === id

/* ============================
    VIII. ACCIONES (ORDENES) Y TRAZABILIDAD 💡 MODIFICADO
============================ */
const actionItems = (row) => [[
  { label: '✅ Aprobar', onClick: () => aprobar(row) },
  { label: '🔁 Rechazar', onClick: () => rechazado(row) },
  { label: '🚫 Denegar', onClick: () => denegar(row) },
], [
  { label: row.status === 'Pausado' ? '▶️ Reanudar' : '⏸️ Pausar', onClick: () => togglePausa(row) },
  { label: '🔔 Notificación', onClick: () => notificar(row) },
  { label: '❌ Quitar Mecanico', onClick: () => quitarMecanico(row) },
  { label: '📚 Historial', onClick: () => historial(row) }, // 💡 MODIFICADO
  { label: '🔍 Detalles', onClick: () => verDetalles(row) },
]]

const handlePriorityChange = (row, newPriority) => {
  row.priority = newPriority.toUpperCase();
  store.updateOrder(row);
  // Podrías añadir un movimiento aquí también si la prioridad es crítica.
}

const togglePausa = (row) => {
  const isPausing = row.status !== 'Pausado'
  row.status = isPausing ? (row._prevStatus = row.status, 'Pausado') : row._prevStatus || 'Pendiente'

  store.updateOrder(row);

  //  REGISTRAR EN EL HISTORIAL: Pausa/Reanudar
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: isPausing ? "Orden Pausada (Jefe)" : "Orden Reanudada (Jefe)",
    comentario: isPausing ? "Pausa manual del Jefe de Mecánicos." : "Orden reanudada por el Jefe.",
    orden: row.id,
    estado: row.status,
    pausado: isPausing,
  })
}

const aprobar = (row) => showModal(`¿Aprobar orden ${row.id}?`, 'Confirmar Aprobación', true, true, false, '', () => {
  row.status = 'Cotizando';
  store.updateOrder(row);

  //  REGISTRAR EN EL HISTORIAL: Aprobación
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: "Orden Aprobada",
    comentario: "Orden aprobada y enviada a Cotización.",
    orden: row.id,
    estado: row.status,
    pausado: false,
  })
})

const rechazado = (row) => showModal(`¿Rechazar orden ${row.id}?`, 'Confirmar Rechazo', true, true, false, '', () => {
  row.status = 'Rechazado';
  store.updateOrder(row);

  //  REGISTRAR EN EL HISTORIAL: Rechazo
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: "Orden Rechazada",
    comentario: "Orden rechazada por el Jefe.",
    orden: row.id,
    estado: row.status,
    pausado: false,
  })
})

const denegar = (row) => showModal('Ingrese motivo:', 'Denegar Orden', true, true, true, '', (motivo) => {
  row.status = 'Denegado';
  row.denegada = true;
  row.motivoDenegada = motivo || 'Sin motivo especificado';
  store.updateOrder(row);

  //  REGISTRAR EN EL HISTORIAL: Denegación
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: "Orden Denegada",
    comentario: `Motivo: ${row.motivoDenegada}`,
    orden: row.id,
    estado: row.status,
    pausado: false,
  })
})

const quitarMecanico = (row) => row.mecanico ? showModal(`¿Quitar a ${row.mecanico}?`, 'Confirmar Acción', true, true, false, '', () => {
  const oldMechanic = row.mecanico
  row.status = 'Pendiente';
  row.mecanico = '';
  row.mecanicoAsignadoFecha = null; // 👈 AQUI SE LIMPIA EL CAMPO
  store.updateOrder(row);

  //  REGISTRAR EN EL HISTORIAL: Quitar Mecánico
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: "Mecánico Removido",
    comentario: `${oldMechanic} fue removido de la orden. Vuelve a Pendiente.`,
    orden: row.id,
    estado: row.status,
    pausado: false,
  })
}) : showModal(`La orden ${row.id} no tiene mecánico.`, 'Información', false, true)


// MODIFICADO: Ahora envía el ID de la orden en el query parameter
const historial = (row) => {
  window.open(`/operations/WorkSpaceBoss/historial?orderId=${row.id}`, '_blank');
}

const notificar = (row) => { notificationActionOrder.value = row; notificationActionModalOpen.value = true }
const handleNotificationSubmit = (data) => showModal(`Notificación enviada para la orden ${data.orderId}. Motivo: ${data.reason}`, 'Notificación Enviada', false, true)
const verDetalles = (row) => { selectedOrder.value = row }

/* ============================
    IX. NOTAS Y COMENTARIOS
============================ */
const saveComment = () => {
  if (selectedOrder.value) {
    const oldComment = selectedOrder.value.comentarioJefe
    const newComment = notes.value.trim()

    // Solo registrar si el comentario realmente cambió o es nuevo
    if (oldComment !== newComment) {
      selectedOrder.value.comentarioJefe = newComment
      isSaved.value = true
      store.updateOrder(selectedOrder.value)

      //  REGISTRAR EN EL HISTORIAL: Comentario de Jefe
      historyStore.addMovement({
        usuario: currentUser.nombre,
        rol: currentUser.rol,
        evento: "Comentario de Jefe",
        comentario: newComment.length > 0 ? `Comentario actualizado: ${newComment.substring(0, 50)}...` : 'Comentario eliminado.',
        orden: selectedOrder.value.id,
        estado: selectedOrder.value.status,
        pausado: selectedOrder.value.status === 'Pausado',
      })
    } else {
      isSaved.value = true; // Si no hay cambio, sigue marcado como guardado
    }
  }
}

/* ============================
    X. HIGHLIGHT (Notificaciones) - (Manteniendo la estructura original)
============================ */
const highlightOrder = (id) => {
  focusedOrderId.value = id
  dataGridInstance.value.instance.navigateToRow(id)
}
</script>

<style scoped>
.cursor-info {
  cursor: help;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}

.mechanic-drop-area {
  transition: background-color 0.2s, border-color 0.2s;
}

.dx-row-focused {
  background-color: #b3e7ff !important;
}
</style>