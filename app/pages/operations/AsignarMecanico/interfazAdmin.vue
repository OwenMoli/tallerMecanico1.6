<template>
  <UDashboardPanel>
    <UDashboardNavbar title="Área de trabajo">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardNavbar>

    <div class="p-8 flex flex-col gap-6 bg-gray-100 min-h-screen w-full relative">

      <!-- Pausa Reparación -->
      <div class="flex items-start gap-6">
        <div class="flex flex-col gap-2 w-48">
          <UButton color="white" variant="solid"
            class="text-white font-medium py-4 px-6 rounded-md bg-blue-500">
            Pausa
          </UButton>
        </div>

        <draggable v-model="pausaReparacionOrders" group="orders" item-key="numero"
          class="grid grid-rows-2 auto-cols-max grid-flow-col gap-4 flex-1 min-h-[180px] p-4 rounded-md bg-gray-300 border-2 border-dashed border-transparent hover:border-yellow-400 overflow-x-auto"
          @end="confirmarInicioPostDrop">
          <template #item="{ element }">
            <OrderCard :order="element" @click="openOrder(element)" />
          </template>
        </draggable>
      </div>

      <!-- TAB: Reparación -->
      <div class="grid grid-cols-4 gap-6 mt-4">
        <!-- Órdenes Pendientes -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Pendientes</div>
          <draggable ref="draggableReparacion" v-model="reparacionOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <!-- En Reparación -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">En Reparación</div>
          <draggable v-model="enReparacionOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <!-- En Pruebas -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">En Pruebas</div>
          <draggable v-model="pruebasOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>

        <!-- Finalizadas -->
        <div class="flex flex-col gap-4">
          <div class="bg-white font-medium p-4 rounded-t-md">Finalizadas</div>
          <draggable v-model="entregaOrders" group="orders" item-key="numero"
            class="flex flex-col gap-4 flex-1 min-h-[120px] p-2 bg-white border-2 border-dashed border-transparent hover:border-blue-400 rounded-b-md"
            @end="confirmarInicioPostDrop">
            <template #item="{ element }">
              <OrderCard :order="element" @click="openOrder(element)" />
            </template>
          </draggable>
        </div>
      </div>

      <!-- Panel lateral con detalle -->
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
          <textarea v-model="notas" class="w-full border rounded-lg p-2 mt-2 text-sm" rows="4"
            placeholder="Escribe aquí las notas del diagnóstico" @input="isSaved = false" />

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
              <button v-if="item.isPdf" @click="abrirPDF(item.file)"
                class="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs hover:bg-gray-300">
                Abrir PDF
              </button>
              <button @click="removerArchivo(idx)"
                class="bg-red-200 text-red-800 px-2 py-1 rounded-md text-xs hover:bg-red-300">
                ✖
              </button>
            </li>
          </ul>

          <div class="flex justify-end mt-6 gap-2 items-center">
            <UButton color="gray" class="hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
              @click="selectedOrder = null">
              Cancelar
            </UButton>
            <UButton color="blue" class="hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
              @click="guardarComentario">
              Guardar
            </UButton>
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
import InfoModal from '~/components/elements/InfoModal.vue'
import draggable from 'vuedraggable'

const selectedOrder = ref(null)
const notas = ref('')
const isSaved = ref(false)

// Listas de órdenes
const reparacionOrders = ref([
  { numero: 'R001', fechaHora: '2025-09-10 08:30', cliente: 'Juan Martínez', placa: 'ABC-123', marca: 'Toyota', modelo: 'Corolla', anio: 2018, inicio:null, contador:0, acumulado:0, denegada:false, motivoDenegada:"", comentarioGuardado:"" },
  { numero: 'R002', fechaHora: '2025-09-10 09:00', cliente: 'María López', placa: 'XYZ-456', marca: 'Honda', modelo: 'Civic', anio: 2020, inicio:null, contador:0, acumulado:0, denegada:false, motivoDenegada:"", comentarioGuardado:"" },
  { numero: 'R003', fechaHora: '2025-09-10 09:30', cliente: 'Carlos Gómez', placa: 'DEF-789', marca: 'Ford', modelo: 'Focus', anio: 2017, inicio:null, contador:0, acumulado:0, denegada:false, motivoDenegada:"", comentarioGuardado:"" },
  { numero: 'R004', fechaHora: '2025-09-10 10:00', cliente: 'Ana Torres', placa: 'GHI-321', marca: 'Nissan', modelo: 'Sentra', anio: 2021, inicio:null, contador:0, acumulado:0, denegada:false, motivoDenegada:"", comentarioGuardado:"" },
  { numero: 'R005', fechaHora: '2025-09-10 10:30', cliente: 'Luis Mendoza', placa: 'JKL-654', marca: 'Mazda', modelo: '3', anio: 2019, inicio:null, contador:0, acumulado:0, denegada:false, motivoDenegada:"", comentarioGuardado:"" },
])
const enReparacionOrders = ref([])
const pruebasOrders = ref([])
const entregaOrders = ref([])
const pausaReparacionOrders = ref([
  { numero: 'PR01', fechaHora: '2025-09-10 11:00', cliente: 'Laura Rojas', placa: 'ZZZ-111', marca: 'Kia', modelo: 'Rio', anio:2016, inicio:null, contador:0, acumulado:0, denegada:false, motivoDenegada:"", comentarioGuardado:"" }
])

const draggableReparacion = ref(null)

// Funciones
const openOrder = (order) => { selectedOrder.value=order; notas.value=order.comentarioGuardado||''; if(!selectedOrder.value.archivos) selectedOrder.value.archivos=[]; isSaved.value=true }
const handleFileChange = (e) => { if(!selectedOrder.value) return; const nuevos=Array.from(e.target.files).map(f=>({file:f,preview:f.type.startsWith('image/')?URL.createObjectURL(f):null,isPdf:f.type==='application/pdf'})); selectedOrder.value.archivos.push(...nuevos) }
const abrirPDF = (file)=>window.open(URL.createObjectURL(file),'_blank')
const removerArchivo = (idx)=>{ const archivo=selectedOrder.value.archivos[idx]; if(archivo.preview) URL.revokeObjectURL(archivo.preview); selectedOrder.value.archivos.splice(idx,1) }
const guardarComentario=()=>{ if(selectedOrder.value){ selectedOrder.value.comentarioGuardado=notas.value.trim(); isSaved.value=true } }
const enviarAlJefe=()=>{ if(!selectedOrder.value) return; if(!confirm(`¿Finalizar trabajo de la orden #${selectedOrder.value.numero}?`)) return; if(selectedOrder.value.inicio){ selectedOrder.value.acumulado+=Math.floor((Date.now()-new Date(selectedOrder.value.inicio))/1000); selectedOrder.value.inicio=null } const listas=[reparacionOrders,enReparacionOrders,pruebasOrders,entregaOrders,pausaReparacionOrders]; for(const l of listas){ const i=l.value.findIndex(o=>o.numero===selectedOrder.value.numero); if(i!==-1){ l.value.splice(i,1); break } } entregaOrders.value.push(selectedOrder.value); selectedOrder.value=null }

let interval=null
onMounted(()=>{ interval=setInterval(()=>{ [reparacionOrders.value,enReparacionOrders.value,pruebasOrders.value,entregaOrders.value,pausaReparacionOrders.value].forEach(lista=>{ lista.forEach(o=>{ o.contador=o.inicio?o.acumulado+Math.floor((Date.now()-new Date(o.inicio))/1000):o.acumulado }) }) },1000) })
onUnmounted(()=>clearInterval(interval))

const confirmarInicioPostDrop=(evt)=>{ const order=evt.item.__vueParentComponent.props.order; const fromList=evt.from.__vueParentComponent.ctx[vModelKey(evt.from)]; const toList=evt.to.__vueParentComponent.ctx[vModelKey(evt.to)]; const pauseLists=[pausaReparacionOrders.value]; if(pauseLists.includes(toList)){ if(order.inicio){ order.acumulado+=Math.floor((Date.now()-new Date(order.inicio))/1000); order.inicio=null } return } if(pauseLists.includes(fromList)){ order.inicio=Date.now(); return } if(evt.from===draggableReparacion.value?.$el){ if(confirm(`¿Iniciar tarea ${order.numero}?`)) order.inicio=Date.now(); else{ toList.splice(evt.newIndex,1); fromList.splice(evt.oldIndex,0,order) } } if(toList===entregaOrders.value){ if(confirm(`¿Finalizar trabajo ${order.numero}?`)){ order.acumulado+=Math.floor((Date.now()-new Date(order.inicio))/1000); order.inicio=null } else{ toList.splice(evt.newIndex,1); fromList.splice(evt.oldIndex,0,order) } } }
function vModelKey(el){ const c=el.__vueParentComponent; return Object.keys(c.props).find(k=>k.startsWith('modelValue'))||'v_model' }
</script>

<style>
.slide-enter-active,.slide-leave-active{transition: transform 0.3s ease;}
.slide-enter-from,.slide-leave-to{transform: translateX(100%);}
</style>
