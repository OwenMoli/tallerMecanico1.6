<template>
  <div class="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Orden #{{ order.id }}</h2>
      <UButton variant="ghost" icon="i-heroicons-x-mark" @click="$emit('close')" />
    </div>

    <p><strong>Cliente:</strong> {{ order.cliente }}</p>
    <p><strong>Placa:</strong> {{ order.placa }}</p>
    <p><strong>Vehículo:</strong> {{ order.marca }} {{ order.modelo }} ({{ order.anio }})</p>
    <p><strong>Fecha/Hora:</strong> {{ order.fechaHora }}</p>

    <h3 class="mt-4 font-semibold">Checklist</h3>
    <ul class="list-disc ml-5 text-sm text-gray-700">
      <li v-for="(item, index) in order.checklist" :key="index">{{ item }}</li>
    </ul>

    <div v-if="order.comentarioMecanico" class="mt-2">
      <h3 class="font-semibold text-sm">Comentario del Mecánico:</h3>
      <div class="text-sm text-gray-700 bg-gray-100 rounded-md p-2 border border-gray-200">
        <p>{{ order.comentarioMecanico }}</p>
        <span v-if="!isBoss && isSaved" class="text-green-600 text-lg"></span>
      </div>
    </div>
    <div v-if="order.comentarioJefe" class="mt-2">
      <h3 class="font-semibold text-sm">Comentario del Jefe:</h3>
      <div class="text-sm text-gray-700 bg-blue-100 rounded-md p-2 border border-blue-200">
        <p>{{ order.comentarioJefe }}</p>
        <span v-if="isBoss && isSaved" class="text-green-600 text-lg"></span>
      </div>
    </div>
    <h3 class="mt-4 font-semibold">
      Comentario para {{ isBoss ? 'el Jefe' : 'el Mecánico' }}
    </h3>
    <textarea
      v-model="localNotes"
      class="w-full border rounded-lg p-2 mt-2 text-sm"
      rows="4"
      :placeholder="isBoss ? 'Escribe aquí las notas de la cotización o aprobación' : 'Escribe aquí las notas del diagnóstico'"
      @input="onEdit"
    />

    <div class="flex justify-end mt-2">
      <UButton
        class="transition-colors cursor-pointer"
        :class="hasChanges
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'border border-gray-400 text-gray-600 bg-transparent hover:bg-gray-100'"
        @click="save"
      >
        Guardar
      </UButton>

      

    </div>
    <div v-if="order.denegada" class="mt-4 bg-red-100 border border-red-400 p-3 rounded-md">
      <p class="text-red-700 font-semibold">🚫 Orden denegada</p>
      <p class="text-sm text-red-600 mt-1">❌ Orden denegada por el jefe mecánico.</p>
      <p class="text-sm mt-1">{{ order.motivoDenegada }}</p>
      <UButton
        size="sm"
        color="gray"
        class="mt-2 cursor-pointer hover:bg-red-200"
        @click="$emit('remove-denial', order)"
      >
        Quitar Denegación
      </UButton>
    </div>

    <h3 class="mt-4 font-semibold">Adjuntar Archivos</h3>
    <div class="flex items-center gap-2 mt-2">
      <label class="cursor-pointer flex items-center gap-1 text-blue-600 text-sm">
        📎 Subir archivos
        <input type="file" multiple class="hidden" @change="onFileChange" />
      </label>
    </div>

    <div v-if="order.archivos && order.archivos.length > 0" class="flex flex-wrap gap-2 mt-2">
      <div
        v-for="(item, idx) in order.archivos"
        :key="idx"
        class="flex items-center gap-2 p-2 rounded-lg bg-gray-100 border border-gray-200 text-sm"
      >
        <span v-if="item.isPdf" class="text-red-500">📄</span>
        <span v-else-if="item.file.type.startsWith('image/')" class="text-blue-500">🖼️</span>
        <span v-else class="text-gray-500">📎</span>

        <span>{{ item.file.name }}</span>

        <button v-if="item.isPdf" @click="$emit('open-pdf', item.file)" class="text-blue-600 hover:text-blue-800">
          Abrir
        </button>
        <button v-if="item.file.type.startsWith('image/') && item.preview" @click="$emit('open-image', item.preview)" class="text-green-600 hover:text-green-800">
          Ver
        </button>
        <button @click="$emit('remove-file', idx)" class="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex justify-end mt-6 gap-2 items-center">

      <UButton class="cursor-pointer hover:bg-gray-200" color="gray" @click="$emit('close')">
        Cancelar
      </UButton>

      <template v-if="isBoss">
        <UButton color="red" class="bg-red-600 hover:bg-red-700 text-white cursor-pointer" @click="$emit('deny', order)">
          Denegar
        </UButton>
        <UButton color="primary" class="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          @click="$emit('send-to-boss', order)">
          Cotizar
        </UButton>
        
      </template>

      <template v-else>
        <UButton color="primary" class="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          @click="$emit('approve', order)">
          Completar
        </UButton>
      </template>

      
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  order: Object,
  isSaved: Boolean,
  // Nueva prop para saber si el usuario actual es el Jefe
  isBoss: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'close',
  'save',
  'deny',
  'approve', // Nuevo emit para la acción del jefe
  'remove-denial',
  'send-to-boss',
  'open-pdf',
  'open-image',
  'remove-file',
  'file-change',
  'editing'
])

// 1. Inicializa localNotes basándose en el rol
const initialNotes = computed(() => {
  return props.isBoss
    ? props.order?.comentarioJefe || ''
    : props.order?.comentarioMecanico || ''
})

const localNotes = ref(initialNotes.value)

// 2. hasChanges compara con el comentario correcto según el rol
const hasChanges = computed(() => {
  const savedComment = props.isBoss
    ? props.order?.comentarioJefe || ''
    : props.order?.comentarioMecanico || ''
  return localNotes.value !== savedComment
})

// 3. Watcher para sincronizar cuando cambia la orden (y actualizar localNotes con el comentario correcto)
watch(initialNotes, (newNotes) => {
  localNotes.value = newNotes
}, { immediate: true })

const save = () => {
  // El emit 'save' se encargará de guardar localNotes.value en el campo correcto
  // (comentarioMecanico o comentarioJefe) en el componente padre.
  emits('save', localNotes.value)
}

const onEdit = () => {
  emits('editing')
}

const onFileChange = (e) => {
  emits('file-change', e)
}
</script>