<template>
  <UDashboardPanel>
    <UDashboardNavbar title="Área de trabajo">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-8 flex flex-col gap-6 bg-gray-100 min-h-screen w-full relative">
      <div class="flex items-start gap-6">
        <div class="flex flex-col gap-2 w-48">
          <UButton color="white" variant="solid" class="text-white font-medium py-4 px-6 rounded-md bg-green-500">
            Pausa
          </UButton>
        </div>

        <draggable v-model="pausedOrders" group="orders" item-key="numero"
          class="grid grid-rows-2 auto-cols-max grid-flow-col gap-4 flex-1 min-h-[180px] p-4 rounded-md bg-gray-300 border-2 border-dashed border-transparent hover:border-yellow-400 overflow-x-auto"
          @end="handleDrop">
          <template #item="{ element }">
            <OrderCard :order="element" @click="openOrder(element)" />
          </template>
        </draggable>
      </div>

      <div class="grid grid-cols-4 gap-6 mt-4 w-full">
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Pendientes</div>
          <draggable ref="pendingDraggable" v-model="pendingOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">En Proceso</div>
          <draggable v-model="inProcessOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Enviados</div>
          <draggable v-model="sentOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md"
            @end="handleDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>
      </div>

      <transition name="slide">
        <div v-if="selectedOrder" class="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl p-6 overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Orden #{{ selectedOrder.numero }}</h2>
            <UButton variant="ghost" icon="i-heroicons-x-mark" @click="selectedOrder = null" />
          </div>

          <p><strong>Cliente:</strong> {{ selectedOrder.cliente }}</p>
          <p><strong>Placa:</strong> {{ selectedOrder.placa }}</p>
          <p><strong>Vehículo:</strong> {{ selectedOrder.marca }} {{ selectedOrder.modelo }} ({{ selectedOrder.anio }})</p>
          <p><strong>Fecha/Hora:</strong> {{ selectedOrder.fechaHora }}</p>
          <p><strong>Tiempo:</strong> {{ selectedOrder.contador }}s</p>

          <h3 class="mt-4 font-semibold">Checklist</h3>
          <ul class="list-disc ml-5 text-sm text-gray-700">
            <li>Motor</li>
            <li>Transmisión</li>
            <li>Frenos</li>
            <li>Eléctrico</li>
          </ul>

          <div v-if="selectedOrder.comentarioGuardado" class="mt-2">
            <div class="flex justify-between items-center text-sm text-gray-700 bg-gray-100 rounded-md p-2">
              <p>{{ selectedOrder.comentarioGuardado }}</p>
              <span v-if="isSaved" class="text-green-600 text-lg">✔️</span>
            </div>
          </div>

          <h3 class="mt-4 font-semibold">Comentario del Mecánico</h3>
          <textarea v-model="notes" class="w-full border rounded-lg p-2 mt-2 text-sm" rows="4"
            placeholder="Escribe aquí las notas del diagnóstico" @input="isSaved = false" />

          <!-- --- Sección de Orden Denegada Actualizada --- -->
          <div v-if="selectedOrder.denegada" class="mt-4 bg-red-100 border border-red-400 p-3 rounded-md">
            <p class="text-red-700 font-semibold">🚫 Orden denegada</p>
            <!-- Texto del motivo ingresado en el InfoModal -->
             <p class="text-sm text-red-600 mt-1">❌ Orden denegada por el mecánico.</p>
            <p class="text-sm mt-1">{{ selectedOrder.motivoDenegada }}</p>
            <UButton size="sm" color="gray" class="mt-2 cursor-pointer hover:bg-red-200" @click="removeDenial">
              Quitar Denegación
            </UButton>
          </div>

          <h3 class="mt-4 font-semibold">Adjuntar Archivos</h3>
          <div class="flex items-center gap-2 mt-2">
            <label class="cursor-pointer flex items-center gap-1 text-blue-600 text-sm">
              📎 Subir archivos
              <input type="file" multiple class="hidden" @change="handleFileChange" />
            </label>
          </div>

          <ul v-if="selectedOrder.archivos && selectedOrder.archivos.length > 0"
            class="mt-2 text-sm text-gray-600 list-disc ml-5">
            <li v-for="(item, idx) in selectedOrder.archivos" :key="idx" class="flex items-center gap-2">
              <span>{{ item.file.name }}</span>
              <img v-if="item.preview" :src="item.preview" class="w-12 h-12 object-cover rounded-md border" />
              <button v-if="item.isPdf" @click="openPdf(item.file)"
                class="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs hover:bg-gray-300">
                Abrir PDF
              </button>
              <button @click="removeFile(idx)"
                class="bg-red-200 text-red-800 px-2 py-1 rounded-md text-xs hover:bg-red-300">
                ✖
              </button>
            </li>
          </ul>

          <div class="flex justify-end mt-6 gap-2 items-center">
            <UButton color="red"
              class="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 cursor-pointer"
              @click="denyOrder">
              Denegar
            </UButton>
            <UButton color="gray" class="hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
              @click="selectedOrder = null">
              Cancelar
            </UButton>
            <div class="flex items-center gap-2">
              <UButton color="blue" class="hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                @click="saveComment">
                Guardar
              </UButton>
            </div>
            <UButton color="primary"
              class="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 cursor-pointer"
              @click="sendToBoss">
              Enviar al Jefe
            </UButton>
          </div>
        </div>
      </transition>
    </div>

    <InfoModal :open.sync="infoModalOpen" :title="infoModalTitle" :message="infoModalMessage"
      :show-confirm="infoModalShowConfirm" :show-cancel="infoModalShowCancel" :show-input="infoModalShowInput"
      v-model="infoModalInput" @confirmed="handleModalConfirm(infoModalInput)" @closed="handleModalClose" />
  </UDashboardPanel>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import OrderCard from '~/components/mecanicos/OrderCard.vue'
import InfoModal from '~/components/elements/InfoModal.vue'
import draggable from 'vuedraggable'

// --- 📦 State Management --------------------------------------------------
const selectedOrder = ref(null)
const notes = ref('')
const isSaved = ref(false)




const pendingOrders = ref([
  { numero: 'R001', fechaHora: '2025-09-10 08:30', cliente: 'Juan Martínez', placa: 'ABC-123', marca: 'Toyota', modelo: 'Corolla', anio: 2018, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: '', comentarioGuardado: '' },
  { numero: 'R002', fechaHora: '2025-09-10 09:00', cliente: 'María López', placa: 'XYZ-456', marca: 'Honda', modelo: 'Civic', anio: 2020, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: '', comentarioGuardado: '' },
  { numero: 'R003', fechaHora: '2025-09-10 09:30', cliente: 'Carlos Gómez', placa: 'DEF-789', marca: 'Ford', modelo: 'Focus', anio: 2017, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: '', comentarioGuardado: '' },
  { numero: 'R004', fechaHora: '2025-09-10 10:00', cliente: 'Ana Torres', placa: 'GHI-321', marca: 'Nissan', modelo: 'Sentra', anio: 2021, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: '', comentarioGuardado: '' },
  { numero: 'R005', fechaHora: '2025-09-10 10:30', cliente: 'Luis Mendoza', placa: 'JKL-654', marca: 'Mazda', modelo: '3', anio: 2019, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: '', comentarioGuardado: '' },
  { numero: 'PD01', fechaHora: '2025-09-04 15:00', cliente: 'Luis Mendoza', placa: 'JKL-999', marca: 'Mazda', modelo: '3', anio: 2018, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: '', comentarioGuardado: '' },
])
const inProcessOrders = ref([])
const sentOrders = ref([])
const pausedOrders = ref([



  
])

// --- 📝 Modal Logic --------------------------------------------------------
const infoModalOpen = ref(false)
const infoModalTitle = ref('')
const infoModalMessage = ref('')
const infoModalShowConfirm = ref(true)
const infoModalShowCancel = ref(true)
const infoModalShowInput = ref(false)
const infoModalInput = ref('')
const infoModalOnConfirmRef = ref(null)

const showModal = (message, title = 'Aviso', showConfirm = true, showCancel = true, showInput = false, initialValue = '', onConfirm) => {
  infoModalTitle.value = title
  infoModalMessage.value = message
  infoModalShowConfirm.value = showConfirm
  infoModalShowCancel.value = showCancel
  infoModalShowInput.value = showInput
  infoModalInput.value = initialValue
  infoModalOnConfirmRef.value = onConfirm || null
  infoModalOpen.value = true
}

const handleModalConfirm = (input) => {
  if (infoModalOnConfirmRef.value) infoModalOnConfirmRef.value(input)
  infoModalOpen.value = false
}

const handleModalClose = () => {
  infoModalOpen.value = false
}

// --- 🛠️ Order & File Management Functions ----------------------------------
const openOrder = (order) => {
  selectedOrder.value = order
  notes.value = order.comentarioGuardado || ''
  if (!selectedOrder.value.archivos) selectedOrder.value.archivos = []
  isSaved.value = true
}

const saveComment = () => {
  if (selectedOrder.value) {
    selectedOrder.value.comentarioGuardado = notes.value.trim()
    isSaved.value = true
    updateOrderInList(selectedOrder.value)
  }
}

const denyOrder = () => {
  if (!selectedOrder.value) return

  infoModalInput.value = '' // limpiar

  showModal(
    'Ingrese el motivo de la denegación (opcional):',
    'Denegar orden',
    true,
    true,
    true, // ← queremos mostrar el input
    '',
    () => {
      selectedOrder.value.denegada = true
      selectedOrder.value.motivoDenegada = infoModalInput.value || ''
      updateOrderInList(selectedOrder.value)
    }
  )
}

const updateOrderInList = (updatedOrder) => {
  const lists = [pendingOrders.value, inProcessOrders.value, pausedOrders.value, sentOrders.value]
  for (const list of lists) {
    const index = list.findIndex(o => o.numero === updatedOrder.numero)
    if (index !== -1) {
      Object.assign(list[index], updatedOrder)
      break
    }
  }
}

const removeDenial = () => {
  if (selectedOrder.value) {
    selectedOrder.value.denegada = false
    selectedOrder.value.motivoDenegada = ''
    updateOrderInList(selectedOrder.value)
  }
}

const sendToBoss = () => {
  if (!selectedOrder.value) return
  showModal(
    `¿Finalizar trabajo de la orden #${selectedOrder.value.numero}?`,
    'Confirmar envío',
    true,
    true,
    false,
    '',
    () => {
      if (selectedOrder.value.inicio) {
        selectedOrder.value.acumulado += Math.floor((Date.now() - new Date(selectedOrder.value.inicio)) / 1000)
        selectedOrder.value.inicio = null
      }
      const lists = [pendingOrders, inProcessOrders, pausedOrders]
      for (const list of lists) {
        const index = list.value.findIndex((o) => o.numero === selectedOrder.value.numero)
        if (index !== -1) {
          list.value.splice(index, 1)
          break
        }
      }
      sentOrders.value.push(selectedOrder.value)
      selectedOrder.value = null
    }
  )
}

const handleFileChange = (e) => {
  if (!selectedOrder.value) return
  const newFiles = Array.from(e.target.files).map((file) => {
    const isImage = file.type.startsWith('image/')
    const preview = isImage ? URL.createObjectURL(file) : null
    const isPdf = file.type === 'application/pdf'
    return { file, preview, isPdf }
  })
  selectedOrder.value.archivos.push(...newFiles)
}

const openPdf = (file) => window.open(URL.createObjectURL(file), '_blank')

const removeFile = (idx) => {
  const file = selectedOrder.value.archivos[idx]
  if (file.preview) URL.revokeObjectURL(file.preview)
  selectedOrder.value.archivos.splice(idx, 1)
}

// --- ⏱️ Timer & Lifecycle Hooks -------------------------------------------
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    [pendingOrders.value, inProcessOrders.value, sentOrders.value, pausedOrders.value].forEach((list) => {
      list.forEach((order) => {
        order.contador = order.inicio ? order.acumulado + Math.floor((Date.now() - new Date(order.inicio)) / 1000) : order.acumulado
      })
    })
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

// --- ✍️ Drag & Drop Logic -------------------------------------------------
const handleDrop = (evt) => {
  const order = evt.item.__vueParentComponent.props.order
  const fromList = evt.from.__vueParentComponent.ctx[getVModelKey(evt.from)]
  const toList = evt.to.__vueParentComponent.ctx[getVModelKey(evt.to)]

  const isDroppingIntoPause = toList === pausedOrders.value
  const isDroppingFromPause = fromList === pausedOrders.value
  const isDroppingIntoInProcess = toList === inProcessOrders.value
  const isDroppingIntoSent = toList === sentOrders.value

  if (isDroppingIntoPause) {
    if (order.inicio) {
      order.acumulado += Math.floor((Date.now() - new Date(order.inicio)) / 1000)
      order.inicio = null
    }
  } else if (isDroppingFromPause) {
    order.inicio = Date.now()
  }

  if (fromList === pendingOrders.value && isDroppingIntoInProcess) {
    showConfirmModal(`¿Iniciar la tarea de la orden #${order.numero}?`, 'Iniciar tarea', () => {
      order.inicio = Date.now()
    })
  }

  if (isDroppingIntoSent) {
    showConfirmModal(`¿Finalizar el trabajo de la orden #${order.numero}?`, 'Finalizar tarea', () => {
      order.acumulado += Math.floor((Date.now() - new Date(order.inicio)) / 1000)
      order.inicio = null
    })
  }
}

const showConfirmModal = (message, title = 'Confirmar', onConfirm) => {
  showModal(message, title, true, true, false, '', onConfirm)
}

const getVModelKey = (draggableEl) => {
  const comp = draggableEl.__vueParentComponent
  return Object.keys(comp.props).find((k) => k.startsWith('modelValue')) || 'v_model'
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
</style>