<template>
  <UDashboardPanel>
    <div class="p-2 flex flex-col gap-6 bg-gray-100 min-h-screen w-full relative">
      <div class="flex items-start gap-6">
        <div class="flex flex-col gap-2 w-48">
          <UButton color="white" variant="solid" class="text-white font-medium py-4 px-6 rounded-md bg-green-500">
            Pausa
          </UButton>
        </div>

        <draggable :model-value="pausedOrders" @update:model-value="handleListChange($event, 'Pausado')" group="orders"
          item-key="id"
          class="grid grid-rows-2 grid-flow-col auto-cols-max gap-4 flex-1 min-h-[180px] p-4 rounded-md bg-gray-300 border-2 border-dashed border-transparent hover:border-yellow-400 overflow-x-auto overscroll-x-contain"
          @end="handleDrop">
          <template #item="{ element }">
            <OrderCard :order="element" @click="openOrder(element)" />
          </template>
        </draggable>
        <div class="ml-auto">
          <NotificationMenu @selectAndHighlightOrder="highlightOrder" :user-nombre="currentUser.nombre" :user-rol="currentUser.rol" />
        </div>
      </div>

      <div class="flex flex-row gap-4 overflow-x-auto flex-nowrap custom-scroll">

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Denegado</div>
          <draggable :model-value="deniedOrders" @update:model-value="handleListChange($event, 'Denegado')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-red-400 rounded-b-md overflow-y-auto">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Rechazado</div>
          <draggable :model-value="refusedOrders" @update:model-value="handleListChange($event, 'Rechazado')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-red-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">En Cola</div>
          <draggable :model-value="pendingOrders" @update:model-value="handleListChange($event, 'En Espera')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Diagnóstico</div>
          <draggable :model-value="diagnosticOrders" @update:model-value="handleListChange($event, 'Diagnostico')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Taller</div>
          <draggable :model-value="inProcessOrders" @update:model-value="handleListChange($event, 'Taller')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Pruebas</div>
          <draggable :model-value="testOrders" @update:model-value="handleListChange($event, 'Pruebas')" group="orders"
            item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Completado</div>
          <draggable :model-value="completedOrders" @update:model-value="handleListChange($event, 'Completado')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4 flex-shrink-0 w-90">
          <div class="bg-white font-medium p-4 rounded-t-md text-center">Cotizando</div>
          <draggable :model-value="sentOrders" @update:model-value="handleListChange($event, 'Cotizando')"
            group="orders" item-key="id"
            class="flex flex-col gap-4 flex-1 min-h-[120px] max-h-[500px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md overflow-y-auto"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>
      </div>
      <transition name="slide">
        <OrderSidebar v-if="selectedOrder" :order="selectedOrder" :isSaved="isSaved" :isBoss="true"
          @close="selectedOrder = null" @save="saveComment" @deny="denyOrder" @remove-denial="removeDenial"
          @send-to-boss="sendToBoss" @open-pdf="openPdf" @remove-file="removeFile" @file-change="handleFileChange"
          @editing="isSaved = false" />
      </transition>
    </div>

    <InfoModal :open.sync="infoModalOpen" :title="infoModalTitle" :message="infoModalMessage"
      :show-confirm="infoModalShowConfirm" :show-cancel="infoModalShowCancel" :show-input="infoModalShowInput"
      v-model="infoModalInput" @confirmed="handleModalConfirm(infoModalInput)" @canceled="handleModalCancel" />
  </UDashboardPanel>
</template>

<script setup>
import { ref, computed } from 'vue'

import draggable from 'vuedraggable'

import OrderCard from '~/components/mecanicos/OrderCard.vue'
import InfoModal from '~/components/elements/InfoModal.vue'
import OrderSidebar from '~/components/mecanicos/OrderSidebar.vue'
import NotificationMenu from '~/components/mecanicos/notificaciones.vue';

import { useOrderTimer } from '~/composables/mecanicos/useOrderTimer'

// ➡️ Importamos la Store
import { useWorkOrdersStore } from '~/store/workOrdersStore'
import { useHistoryStore } from '~/store/historyStore'


// ➡️ Inicializamos la Store
const store = useWorkOrdersStore()
const historyStore = useHistoryStore()


// =========================================================================
// I. ESTADO REACTIVO Y PINIA GETTERS
// =========================================================================

const selectedOrder = ref(null)
const notes = ref('')
const isSaved = ref(false)

// 🔹 Usuario actual (mecánico logueado)
const currentUser = {
  nombre: 'Luis P.',
  rol: 'Mecanico',
}


// =========================================================================
// II. FILTRADO DE ÓRDENES (Por mecánico + estado)
// =========================================================================

// 🔧 Helper para filtrar órdenes por estado y mecánico asignado
const filterByMechanicAndStatus = (statuses) =>
  store.activeOrders.filter(
    o => statuses.includes(o.status) && o.mecanico === currentUser.nombre
  )

// 🔹 Listas computadas
const pendingOrders = computed(() => filterByMechanicAndStatus(["En Espera", "En Cola"]))
const inProcessOrders = computed(() => filterByMechanicAndStatus(["Taller"]))
const deniedOrders = computed(() => filterByMechanicAndStatus(["Denegado"]))
const pausedOrders = computed(() => filterByMechanicAndStatus(["Pausado"]))
const refusedOrders = computed(() => filterByMechanicAndStatus(["Rechazado"]))
const diagnosticOrders = computed(() => filterByMechanicAndStatus(["Diagnóstico", "Diagnostico"]))
const testOrders = computed(() => filterByMechanicAndStatus(["Pruebas"]))
const completedOrders = computed(() => filterByMechanicAndStatus(["Completado"]))
const sentOrders = computed(() => filterByMechanicAndStatus(["Cotizando"]))

// ✅ Agrupamos todas las listas para el composable
const allLists = [
  pendingOrders,
  inProcessOrders,
  pausedOrders,
  sentOrders,
  deniedOrders,
  diagnosticOrders,
  testOrders,
  completedOrders,
]

// ✅ Llamamos al composable
const { pauseOrder, resumeOrder, finishOrder } = useOrderTimer(allLists)


// =========================================================================
// III. MODAL (igual que antes)
// =========================================================================

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


// =========================================================================
// IV. LÓGICA DE GESTIÓN DE ÓRDENES
// =========================================================================

const openOrder = (order) => {
  selectedOrder.value = order
  notes.value = order.comentarioJefe || ''
  if (!selectedOrder.value.archivos) selectedOrder.value.archivos = []
  isSaved.value = true
}

const saveComment = () => {
  if (selectedOrder.value) {
    const oldComment = selectedOrder.value.comentarioJefe
    const newComment = notes.value.trim()

    selectedOrder.value.comentarioJefe = newComment
    isSaved.value = true
    store.updateOrder(selectedOrder.value)

    if (oldComment !== newComment) {
      historyStore.addMovement({
        usuario: currentUser.nombre,
        rol: currentUser.rol,
        evento: "Comentario de Jefe",
        comentario: newComment.length > 0 ? `Comentario actualizado: ${newComment.substring(0, 50)}...` : 'Comentario eliminado.',
        orden: selectedOrder.value.id,
        estado: selectedOrder.value.status,
        pausado: selectedOrder.value.status === 'Pausado',
      })
    }
  }
}




const sendToBoss = () => {
  if (!selectedOrder.value) return
  showModal(`¿Finalizar trabajo de la orden #${selectedOrder.value.id} y enviar a Cotización?`, 'Confirmar envío', true, true, false, '', () => {
    if (selectedOrder.value.inicio) {
      selectedOrder.value.acumulado += Math.floor((Date.now() - new Date(selectedOrder.value.inicio)) / 1000)
      selectedOrder.value.inicio = null
    }
    selectedOrder.value.status = 'Cotizando'
    store.updateOrder(selectedOrder.value)

    historyStore.addMovement({
      usuario: currentUser.nombre,
      rol: currentUser.rol,
      evento: "Orden Enviada a Cotización",
      comentario: "Trabajo finalizado, enviado a cotización.",
      orden: selectedOrder.value.id,
      estado: selectedOrder.value.status,
      pausado: false,
    })

    selectedOrder.value = null
  })
}


// =========================================================================
// V. ARCHIVOS
// =========================================================================

const handleFileChange = (e) => {
  if (!selectedOrder.value) return
  const newFiles = Array.from(e.target.files).map((file) => {
    const isImage = file.type.startsWith('image/')
    const preview = isImage ? URL.createObjectURL(file) : null
    const isPdf = file.type === 'application/pdf'
    return { file, preview, isPdf }
  })
  if (!selectedOrder.value.archivos) selectedOrder.value.archivos = []
  selectedOrder.value.archivos.push(...newFiles)
  store.updateOrder(selectedOrder.value)
}

const removeFile = (idx) => {
  const file = selectedOrder.value.archivos[idx]
  if (file.preview) URL.revokeObjectURL(file.preview)
  selectedOrder.value.archivos.splice(idx, 1)
  store.updateOrder(selectedOrder.value)
}


// =========================================================================
// VI. DRAG & DROP
// =========================================================================

const handleListChange = (newList, status) => { }

const handleDrop = (evt) => {
  const item = evt.item
  const targetListElement = evt.to
  const orderId = item.__vueParentComponent.props.order.id
  const newStatus = getStatusFromListElement(targetListElement)
  if (!newStatus) return

  const order = store.activeOrders.find(o => o.id === orderId)
  if (!order) return

  const confirmMove = (status) => () => {
    const oldStatus = order.status
    order.status = status
    store.updateOrder(order)

    if (['Denegado', 'Rechazado', 'En Espera', 'Pausado'].includes(status)) pauseOrder(order)
    else resumeOrder(order)

    historyStore.addMovement({
      usuario: currentUser.nombre,
      rol: currentUser.rol,
      evento: "Cambio de Estado",
      comentario: `Orden movida de "${oldStatus}" a "${status}"`,
      orden: order.id,
      estado: status,
      pausado: status === 'Pausado',
    })
  }

  const cancelMove = () => {
    console.log('Movimiento cancelado')
  }

  if (order.status === newStatus) return;

  showModal(
    `¿Mover a ${newStatus}?`,
    'Confirmar movimiento',
    true,
    true,
    false,
    '',
    confirmMove(newStatus),
    cancelMove
  )
}

const getStatusFromListElement = (element) => {
  const titleElement = element.parentElement.querySelector('div.rounded-t-md');
  if (titleElement) {
    const title = titleElement.textContent.trim();
    switch (title) {
      case 'Denegado': return 'Denegado';
      case 'Rechazado': return 'Rechazado';
      case 'En Cola': return 'En Espera';
      case 'Diagnóstico': return 'Diagnostico';
      case 'Taller': return 'Taller';
      case 'Pruebas': return 'Pruebas';
      case 'Completado': return 'Completado';
      case 'Cotizando': return 'Cotizando';
      case 'Pausa': return 'Pausado';
      default: return null;
    }
  }
  return null;
}


// =========================================================================
// VII. NOTIFICACIONES
// =========================================================================

const highlightOrder = (orderId) => {
  const order = store.activeOrders.find(o => o.id === orderId)
  if (order) openOrder(order)
}
</script>


<style>
/* Estilos para la transición del panel lateral */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Estilos para la barra de desplazamiento horizontal personalizada */
.custom-scroll::-webkit-scrollbar {
  height: 15px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #34d399;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #10b981;
}
</style>