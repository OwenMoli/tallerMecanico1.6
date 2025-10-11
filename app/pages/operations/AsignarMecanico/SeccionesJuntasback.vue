<template>
  <UDashboardPanel>
    <UDashboardNavbar title="Área de trabajo">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-8 flex flex-col gap-6 bg-gray-100 min-h-screen w-full relative">

      <!-- Tabs -->
      <div class="flex items-center justify-center">
        <div class="flex items-center w-1/2 h-8 rounded-lg overflow-hidden border border-gray-300">
          <div @click="activeTab = 'diagnostico'" :class="{
            'bg-green-500 text-white': activeTab === 'diagnostico',
            'bg-gray-200 text-gray-700': activeTab !== 'diagnostico'
          }"
            class="font-medium flex items-center justify-center h-full w-1/2 cursor-pointer transition-colors duration-300">
            Diagnóstico
          </div>
          <div @click="activeTab = 'reparacion'" :class="{
            'bg-blue-500 text-white': activeTab === 'reparacion',
            'bg-gray-200 text-gray-700': activeTab !== 'reparacion'
          }"
            class="font-medium flex items-center justify-center h-full w-1/2 cursor-pointer transition-colors duration-300">
            Reparación
          </div>
        </div>
      </div>

      <!-- Pausa -->
      <div class="flex items-start gap-6">
        <div class="flex flex-col gap-2 w-48">
          <UButton color="white" variant="solid"
            :class="{ 'bg-blue-500': activeTab === 'reparacion', 'bg-green-500': activeTab === 'diagnostico' }"
            class="text-white font-medium py-4 px-6 rounded-md">
            Pausa
          </UButton>
        </div>

        <!-- Pausa Diagnóstico -->
        <draggable v-if="activeTab === 'diagnostico'" v-model="pausaDiagnosticoOrders" group="orders" item-key="numero"
          class="grid grid-rows-2 auto-cols-max grid-flow-col gap-4 flex-1 min-h-[180px] p-4 rounded-md bg-gray-300 border-2 border-dashed border-transparent hover:border-yellow-400 overflow-x-auto"
          @end="confirmarInicioPostDrop">
          <template #item="{ element }">
            <OrderCard :order="element" @click="openOrder(element)" />
          </template>
        </draggable>

        <!-- Pausa Reparación -->
        <draggable v-else v-model="pausaReparacionOrders" group="orders" item-key="numero"
          class="grid grid-rows-2 auto-cols-max grid-flow-col gap-4 flex-1 min-h-[180px] p-4 rounded-md bg-gray-300 border-2 border-dashed border-transparent hover:border-yellow-400 overflow-x-auto"
          @end="confirmarInicioPostDrop">
          <template #item="{ element }">
            <OrderCard :order="element" @click="openOrder(element)" />
          </template>
        </draggable>
      </div>

      <!-- TAB: Diagnóstico -->
      <div v-if="activeTab === 'diagnostico'" class="grid grid-cols-4 gap-6 mt-4">
        <!-- Órdenes -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Pendientes</div>
          <draggable ref="draggableOrdenes" v-model="diagnosticoOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <!-- Revisión -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">En Proceso</div>
          <draggable v-model="revisionOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <!-- Cotización -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Enviados</div>
          <draggable v-model="cotizacionOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-green-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>
      </div>

      <!-- TAB: Reparación -->
      <div v-if="activeTab === 'reparacion'" class="grid grid-cols-4 gap-6 mt-4">
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Órdenes Reparación</div>
          <draggable ref="draggableReparacion" v-model="reparacionOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Reparando</div>
          <draggable v-model="pruebasOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Pruebas</div>
          <draggable v-model="controlCalidadOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Enviado</div>
          <draggable v-model="entregaOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>
      </div>

      <!-- 📌 Panel lateral con detalle -->
      <transition name="slide">
        <div v-if="selectedOrder" class="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl p-6 overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Orden #{{ selectedOrder.numero }}</h2>
            <UButton variant="ghost" icon="i-heroicons-x-mark" @click="selectedOrder = null" />
          </div>

          <p><strong>Cliente:</strong> {{ selectedOrder.cliente }}</p>
          <p><strong>Placa:</strong> {{ selectedOrder.placa }}</p>
          <p><strong>Vehículo:</strong> {{ selectedOrder.marca }} {{ selectedOrder.modelo }} ({{ selectedOrder.anio }})
          </p>
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
          <textarea v-model="notas" class="w-full border rounded-lg p-2 mt-2 text-sm" rows="4"
            placeholder="Escribe aquí las notas del diagnóstico" @input="isSaved = false" />

          <div v-if="selectedOrder.denegada" class="mt-4 bg-red-100 border border-red-400 p-3 rounded-md curso">
            <p class="text-red-700 font-semibold">🚫 Orden denegada</p>
            <p class="text-sm text-red-600 mt-1">{{ selectedOrder.motivoDenegada }}</p>
            <UButton size="sm" color="gray" class="mt-2 cursor-pointer hover:bg-red-200" @click="quitarDenegacion">
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

              <!-- Vista previa de imagen -->
              <img v-if="item.preview" :src="item.preview" class="w-12 h-12 object-cover rounded-md border" />

              <!-- Botón PDF -->
              <button v-if="item.isPdf" @click="abrirPDF(item.file)"
                class="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs hover:bg-gray-300">
                Abrir PDF
              </button>

              <!-- Botón eliminar -->
              <button @click="removerArchivo(idx)"
                class="bg-red-200 text-red-800 px-2 py-1 rounded-md text-xs hover:bg-red-300">
                ✖
              </button>
            </li>
          </ul>





          <div class="flex justify-end mt-6 gap-2 items-center">
            <UButton color="red"
              class="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 cursor-pointer"
              @click="denegarOrden">
              Denegar
            </UButton>

            <UButton color="gray" class="hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
              @click="selectedOrder = null">
              Cancelar
            </UButton>

            <div class="flex items-center gap-2">
              <UButton color="blue" class="hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                @click="guardarComentario">
                Guardar
              </UButton>
            </div>

            <UButton color="primary"
              class="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 cursor-pointer"
              @click="enviarAlJefe">
              Enviar al Jefe
            </UButton>
          </div>
        </div>
      </transition>

    </div>
  </UDashboardPanel>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import OrderCard from '~/components/mecanicos/OrderCard.vue'
import draggable from 'vuedraggable'

const activeTab = ref('diagnostico')
const selectedOrder = ref(null)
const notas = ref('')
const archivos = ref([])
const isSaved = ref(false)

const openOrder = (order) => {
  selectedOrder.value = order
  notas.value = order.comentarioGuardado || ''
  archivos.value = []
  isSaved.value = true
}

const handleFileChange = (e) => {
  if (!selectedOrder.value) return

  const nuevosArchivos = Array.from(e.target.files).map(file => {
    let preview = null
    let isPdf = false

    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file)
    } else if (file.type === 'application/pdf') {
      isPdf = true
    }

    return { file, preview, isPdf }
  })

  if (!selectedOrder.value.archivos) {
    selectedOrder.value.archivos = []
  }

  selectedOrder.value.archivos.push(...nuevosArchivos)
}

const abrirPDF = (file) => {
  const url = URL.createObjectURL(file)
  window.open(url, '_blank')
}


const removerArchivo = (index) => {
  if (!selectedOrder.value || !selectedOrder.value.archivos) return

  const archivo = selectedOrder.value.archivos[index]

  // Liberar memoria si es imagen
  if (archivo.preview) URL.revokeObjectURL(archivo.preview)

  // Eliminar de la lista
  selectedOrder.value.archivos.splice(index, 1)
}



const guardarComentario = () => {
  if (selectedOrder.value) {
    selectedOrder.value.comentarioGuardado = notas.value.trim()
    isSaved.value = true
  }
}

const denegarOrden = () => {
  if (selectedOrder.value) {
    const motivo = prompt("Ingrese el motivo de la denegación (opcional):")
    selectedOrder.value.denegada = true
    selectedOrder.value.motivoDenegada = motivo || "❌ Orden denegada por el mecánico."
  }
}

const quitarDenegacion = () => {
  if (selectedOrder.value) {
    selectedOrder.value.denegada = false
    selectedOrder.value.motivoDenegada = ""
  }
}

const enviarAlJefe = () => {
  if (!selectedOrder.value) return

  // Preguntar si desea finalizar el trabajo
  const confirmado = confirm(`¿Desea finalizar el trabajo de la orden #${selectedOrder.value.numero}?`)
  if (!confirmado) return

  // Detener contador si está activo
  if (selectedOrder.value.inicio) {
    selectedOrder.value.acumulado += Math.floor((Date.now() - new Date(selectedOrder.value.inicio)) / 1000)
    selectedOrder.value.inicio = null
  }

  // Remover de la lista actual
  const listas = [
    diagnosticoOrders,
    revisionOrders,
    diagnosticoDetalleOrders,
    pausaDiagnosticoOrders,
    reparacionOrders,
    pruebasOrders,
    controlCalidadOrders,
    entregaOrders,
    pausaReparacionOrders
  ]
  for (const lista of listas) {
    const index = lista.value.findIndex(o => o.numero === selectedOrder.value.numero)
    if (index !== -1) {
      lista.value.splice(index, 1)
      break
    }
  }

  // Agregar a la lista de enviados
  cotizacionOrders.value.push(selectedOrder.value)

  // Cerrar panel lateral
  selectedOrder.value = null
}

// Pausas
const pausaDiagnosticoOrders = ref([
  { numero: 'PD01', fechaHora: '2025-09-04 15:00', cliente: 'Luis Mendoza', placa: 'JKL-999', marca: 'Mazda', modelo: '3', anio: 2018, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: "", comentarioGuardado: "" }
])
const pausaReparacionOrders = ref([
  { numero: 'PR01', fechaHora: '2025-09-04 16:00', cliente: 'Laura Rojas', placa: 'ZZZ-111', marca: 'Kia', modelo: 'Rio', anio: 2016, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: "", comentarioGuardado: "" }
])

const diagnosticoOrders = ref([
  { numero: '001', fechaHora: '2025-09-04 10:30', cliente: 'Juan Perez', placa: 'ABC-123', marca: 'Toyota', modelo: 'Corolla', anio: 2021, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: "", comentarioGuardado: "" },
  { numero: '002', fechaHora: '2025-09-04 11:00', cliente: 'Maria Lopez', placa: 'XYZ-456', marca: 'Honda', modelo: 'Civic', anio: 2020, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: "", comentarioGuardado: "" }
])
const revisionOrders = ref([
  { numero: '003', fechaHora: '2025-09-04 12:00', cliente: 'Carlos Gómez', placa: 'DEF-789', marca: 'Ford', modelo: 'Focus', anio: 2019, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: "", comentarioGuardado: "" }
])
const diagnosticoDetalleOrders = ref([])
const cotizacionOrders = ref([])

const reparacionOrders = ref([
  { numero: '004', fechaHora: '2025-09-04 13:00', cliente: 'Ana Torres', placa: 'GHI-321', marca: 'Nissan', modelo: 'Sentra', anio: 2022, inicio: null, contador: 0, acumulado: 0, denegada: false, motivoDenegada: "", comentarioGuardado: "" }
])
const pruebasOrders = ref([])
const controlCalidadOrders = ref([])
const entregaOrders = ref([])

const draggableOrdenes = ref(null)
const draggableReparacion = ref(null)

let interval = null
onMounted(() => {
  interval = setInterval(() => {
    const listas = [
      diagnosticoOrders.value, revisionOrders.value, diagnosticoDetalleOrders.value, cotizacionOrders.value,
      reparacionOrders.value, pruebasOrders.value, controlCalidadOrders.value, entregaOrders.value
    ]
    listas.forEach(lista => {
      lista.forEach(order => {
        if (order.inicio) {
          order.contador = order.acumulado + Math.floor((Date.now() - new Date(order.inicio)) / 1000)
        } else {
          order.contador = order.acumulado
        }
      })
    })
  }, 1000)
})
onUnmounted(() => clearInterval(interval))

const confirmarInicioPostDrop = (evt) => {
  const order = evt.item.__vueParentComponent.props.order
  const fromList = evt.from.__vueParentComponent.ctx[vModelKey(evt.from)]
  const toList = evt.to.__vueParentComponent.ctx[vModelKey(evt.to)]

  const pauseLists = [pausaDiagnosticoOrders.value, pausaReparacionOrders.value]

  if (pauseLists.includes(toList)) {
    if (order.inicio) {
      order.acumulado += Math.floor((Date.now() - new Date(order.inicio)) / 1000)
      order.inicio = null
    }
    return
  }

  if (pauseLists.includes(fromList)) {
    order.inicio = Date.now()
    return
  }

  const isDiagnosticoStart = evt.from === draggableOrdenes.value?.$el
  const isReparacionStart = evt.from === draggableReparacion.value?.$el

  if (isDiagnosticoStart || isReparacionStart) {
    const confirmado = confirm(`¿Iniciar tarea ${order.numero}?`)
    if (confirmado) {
      order.inicio = Date.now()
    } else {
      toList.splice(evt.newIndex, 1)
      fromList.splice(evt.oldIndex, 0, order)
    }
    return
  }

  if (toList === cotizacionOrders.value || toList === entregaOrders.value) {
    const confirmado = confirm(`¿Está seguro de que desea finalizar el trabajo ${order.numero}?`)
    if (confirmado) {
      order.acumulado += Math.floor((Date.now() - new Date(order.inicio)) / 1000)
      order.inicio = null
    } else {
      toList.splice(evt.newIndex, 1)
      fromList.splice(evt.oldIndex, 0, order)
    }
  }
}

function vModelKey(draggableEl) {
  const comp = draggableEl.__vueParentComponent
  return Object.keys(comp.props).find(k => k.startsWith('modelValue')) || 'v_model'
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
