<template>
  <div class="w-full h-screen flex flex-col">
    <UDashboardPanel class="flex-1 relative">
      <div class="flex w-full h-full space-x-6 p-8 bg-gray-100">


        <div class="flex-1 bg-white rounded-lg shadow-lg p-6">
          <DxDataGrid :data-source="filteredReceptionOrders" :show-borders="true" :show-row-lines="true"
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

            <DxColumn data-field="mecanico" caption="Mecánico" alignment="center" header-alignment="center"
              :column-auto-width="true" />

            <DxColumn data-field="priority" caption="Prioridad" cell-template="priority-cell" alignment="center"
              header-alignment="center" :column-auto-width="true" />
            <template #priority-cell="{ data }">
              <span :class="getPriorityClass(data.data.priority)"
                class="w-full text-center px-2 py-1 rounded-md border-2 transition-colors font-semibold block">
                {{ data.data.priority ? data.data.priority.toUpperCase() : 'NORMAL' }}
              </span>
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
        <NotificationMenu class="absolute top-4 right-4 z-50" @selectAndHighlightOrder="highlightOrder"
          :user-nombre="currentUser.nombre" :user-rol="currentUser.rol" />
      </div>
    </UDashboardPanel>
  </div>

  <transition name="slide">
    <OrderSidebar v-if="selectedOrder" :order="selectedOrder" :isSaved="isSaved" :isBoss="false"
      @close="selectedOrder = null" @save="(notesValue) => { notes = notesValue; saveComment() }"
      @remove-denial="removeDenial" @send-to-boss="sendToBoss" @open-pdf="openPdf" @remove-file="removeFile"
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
import { useWorkOrdersStore } from '~/store/workOrdersStore'
import { useHistoryStore } from '~/store/historyStore'

import { DxDataGrid, DxColumn, DxHeaderFilter, DxSearchPanel, DxPaging, DxPager } from 'devextreme-vue/data-grid'

import InfoModal from '~/components/elements/InfoModal.vue'
import OrderSidebar from '~/components/mecanicos/OrderSidebar.vue'
import NotificationMenu from '~/components/mecanicos/notificaciones.vue'
import NotificationActionModal from '~/components/mecanicos/notificacionesModal.vue'

// Inicializamos ambas Stores
const store = useWorkOrdersStore()
const historyStore = useHistoryStore()

/* ============================
    II. DATOS DEL USUARIO
============================ */
//  Asegúrate de que este nombre coincida exactamente con cómo se asigna la tarea
const currentUser = {
  nombre: 'Luis P.',
  rol: 'Mecanico',
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

//  CAMBIO CLAVE: Filtra las órdenes para mostrar solo las asignadas al mecánico\\

const filteredReceptionOrders = computed(() => {
  return store.activeOrders.filter(order => order.mecanico === currentUser.nombre);
});



/* ============================
    IV. MODAL (InfoModal) - (Sin cambios, se mantiene la utilidad)
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
    V. FUNCIONES UTILITARIAS - (Sin cambios, se mantiene el estilo de colores)
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

// 💡 Eliminada: getMecanicoClass (No es necesaria sin la lista de mecánicos)

const getPriorityClass = (priority) => {
  const p = priority ? priority.toUpperCase() : 'NORMAL'
  switch (p) {
    case 'URGENTE': case 'ALTA': return 'bg-red-200 text-red-800 border-red-400'
    case 'PRIORITARIO': case 'MEDIA': return 'bg-orange-100 text-orange-700 border-orange-400'
    default: return 'bg-gray-200 text-gray-700 border-gray-400'
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
    VII. ACCIONES (ORDENES) Y TRAZABILIDAD  MODIFICADO PARA EL MECÁNICO
============================ */
const actionItems = (row) => {
  const actions = []

  // Bloque 2: Acciones secundarias (separador)
  actions.push([
    { label: '✅ Iniciar', onClick: () => iniciar(row) },
    { label: '🔔 Notificación (Jefe)', onClick: () => notificar(row) },
    { label: '📚 Historial', onClick: () => historial(row) },
    { label: '🔍 Detalles', onClick: () => verDetalles(row) },
  ])
  return actions
}

//  Eliminado: handlePriorityChange (El mecánico no cambia la prioridad)

const iniciar = (row) => {
  //  CAMBIO CLAVE: Usar showModal con showInput en true
  showModal(
    `Por favor, agrega un comentario para iniciar la orden ${row.id}:`,
    'Confirmar Inicio',
    true, // showConfirm
    true, // showCancel
    true, // showInput: ¡AHORA ES TRUE!
    '',   // initialValue

    // Función de Confirmación (onConfirm)
    (comentarioUsuario) => {
      // Asegúrate de que el usuario haya escrito algo
      const comentario = comentarioUsuario && comentarioUsuario.trim() ? comentarioUsuario.trim() : `El Mecánico ${currentUser.nombre} inicia la tarea.`

      // 1. Actualizar el estado de la orden
      row.status = 'Diagnostico';
      store.updateOrder(row);

      // 2. Agregar el movimiento al historial con el comentario del usuario
      historyStore.addMovement({
        usuario: currentUser.nombre,
        rol: currentUser.rol,
        evento: "Trabajo Iniciado",
        //  Usamos el comentario del modal
        comentario: comentario,
        orden: row.id,
        estado: row.status,
        pausado: false,
      })
    },
    // Función de Cancelación (onCancel) - Opcional, puedes dejarla vacía si no haces nada
    () => {
      // Por ejemplo, si cancela, no hacemos nada.
    }
  );
};


const togglePausa = (row) => {
  const isPausing = row.status !== 'Pausado'
  row.status = isPausing ? (row._prevStatus = row.status, 'Pausado') : row._prevStatus || 'Diagnostico' // Vuelve a Diagnostico/En Proceso

  store.updateOrder(row);

  //  REGISTRAR EN EL HISTORIAL: Pausa/Reanudar
  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: isPausing ? "Orden Pausada (Mecánico)" : "Orden Reanudada (Mecánico)",
    comentario: isPausing ? "Pausa manual del mecánico." : "Orden reanudada por el mecánico.",
    orden: row.id,
    estado: row.status,
    pausado: isPausing,
  })
}

const sendToBoss = (row) => showModal(`¿Enviar orden ${row.id} al Jefe para revisión/cotización?`, 'Confirmar Finalización de Etapa', true, true, false, '', () => {
  //  El mecánico la envía a una etapa de revisión/cotización/finalización.
  row.status = 'Pruebas'; // Por ejemplo, pasa a Pruebas o a Cotizando.
  store.updateOrder(row);

  historyStore.addMovement({
    usuario: currentUser.nombre,
    rol: currentUser.rol,
    evento: "Enviado a Jefe",
    comentario: "Mecánico ha finalizado su etapa y envía a revisión/pruebas.",
    orden: row.id,
    estado: row.status,
    pausado: false,
  })
})

//  Eliminadas: aprobar, rechazado, denegar, quitarMecanico. Estas son acciones del Jefe.

//  Nota: La función 'denegar' aún existe en el sidebar. Asegúrate de que el componente OrderSidebar
// esté diseñado para ocultar el botón 'Denegar' cuando `isBoss` es `false`.

const historial = (row) => {
  window.open(`/operations/WorkSpaceBoss/historial?orderId=${row.id}`, '_blank');
}

const notificar = (row) => { notificationActionOrder.value = row; notificationActionModalOpen.value = true }
const handleNotificationSubmit = (data) => showModal(`Notificación enviada para la orden ${data.orderId}. Motivo: ${data.reason}`, 'Notificación Enviada', false, true)
const verDetalles = (row) => { selectedOrder.value = row }
const removeDenial = () => { /* Lógica para eliminar denegación */ }
const removeFile = () => { /* Lógica para eliminar archivo */ }
const handleFileChange = () => { /* Lógica para manejar cambio de archivo */ }

/* ============================
    VIII. COMENTARIOS - (Ajustada para el rol de Mecánico)
============================ */
const saveComment = () => {
  if (selectedOrder.value) {
    //  El mecánico debe escribir en su propio campo de comentario, no en comentarioJefe
    const oldComment = selectedOrder.value.comentarioMecanico
    const newComment = notes.value.trim()

    if (oldComment !== newComment) {
      //  Asignamos al campo 'comentarioMecanico'
      selectedOrder.value.comentarioMecanico = newComment
      isSaved.value = true
      store.updateOrder(selectedOrder.value)

      //  REGISTRAR EN EL HISTORIAL: Comentario de Mecánico
      historyStore.addMovement({
        usuario: currentUser.nombre,
        rol: currentUser.rol,
        evento: "Comentario de Mecánico",
        comentario: newComment.length > 0 ? `Comentario actualizado: ${newComment.substring(0, 50)}...` : 'Comentario eliminado.',
        orden: selectedOrder.value.id,
        estado: selectedOrder.value.status,
        pausado: selectedOrder.value.status === 'Pausado',
      })
    } else {
      isSaved.value = true;
    }
  }
}

/* ============================
    IX. HIGHLIGHT (Notificaciones) - (Sin cambios)
============================ */
const highlightOrder = (id) => {
  focusedOrderId.value = id
  dataGridInstance.value.instance.navigateToRow(id)
}
</script>

<style scoped>
/* 💡 Eliminadas las clases de Drag & Drop innecesarias */
.dx-row-focused {
  background-color: #b3e7ff !important;
}
</style>