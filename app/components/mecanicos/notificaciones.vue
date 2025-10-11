<template>
  <div class="relative" ref="menuContainerRef">
    <!-- Botón de notificaciones -->
    <button 
      @click="toggleMenu" 
      class="relative p-2 rounded-full hover:bg-gray-100"
    >
      <UIcon 
        name="i-heroicons-bell" 
        class="w-6 h-6 text-gray-700 cursor-pointer" 
      />
      <span 
        v-if="unreadCount > 0" 
        class="absolute top-0 right-0 inline-flex items-center justify-center 
               px-2 py-1 text-xs font-bold leading-none text-red-100 
               bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Dropdown de notificaciones -->
    <div 
      v-if="isMenuOpen" 
      class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 
             rounded-lg shadow-lg z-50"
    >
      <!-- Encabezado -->
      <div class="p-4 border-b border-gray-200 flex justify-between items-center relative">
        <h3 class="text-lg font-semibold text-gray-800">
          Notificaciones ({{ unreadCount }})
        </h3>
        <button 
          @click="closeMenu" 
          class="absolute top-2 right-2 p-2 rounded-full text-gray-500 
                 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Cerrar notificaciones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5" 
               viewBox="0 0 20 20" 
               fill="currentColor"
          >
            <path 
              fill-rule="evenodd" 
              clip-rule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293
                 a1 1 0 111.414 1.414L11.414 10l4.293 4.293
                 a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293
                 a1 1 0 01-1.414-1.414L8.586 10 4.293 
                 5.707a1 1 0 010-1.414z" 
            />
          </svg>
        </button>
      </div>

      <!-- Lista de notificaciones -->
      <div class="max-h-80 overflow-y-auto">
        <div v-if="allNotifications.length === 0" 
             class="p-4 text-center text-gray-500">
          No tienes notificaciones.
        </div>

        <div v-else>
          <div 
            v-for="notification in allNotifications" 
            :key="notification.id" 
            :class="[
              'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer', 
              { 'bg-blue-50/50 font-semibold': !notification.read }
            ]"
            @click="handleNotificationClick(notification)"
          >
            <h4 class="font-medium text-gray-900">
              {{ notification.Type || notification.title }}
            </h4>

            <p class="text-sm text-gray-600 mt-1">
              <span class="font-semibold">Orden:</span> {{ notification.orderId }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-semibold">Mecánico:</span> {{ notification.mechanicName }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-semibold">Tipo:</span> {{ notification.Type }}
            </p>
            <p class="text-sm text-gray-600 mt-1 italic">
              {{ notification.comment }}
            </p>

            <div class="flex justify-between items-center mt-2">
              <p class="text-xs text-gray-400">
                {{ formatTimestamp(notification.timestamp) }}
              </p>
              <span 
                v-if="!notification.read" 
                class="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" 
                title="Sin leer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Pie con acción -->
      <div class="p-2 text-center border-t border-gray-200">
        <button 
          @click="markAll" 
          :disabled="unreadCount === 0"
          :class="[
            'text-sm', 
            unreadCount === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:underline'
          ]"
        >
          Marcar todas como leídas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useNotificationsStore } from '~/store/notificationsStore'

// --- STORE ---
const notificationsStore = useNotificationsStore()

// --- STATE ---
const isMenuOpen = ref(false)
const menuContainerRef = ref(null)


const props = defineProps({
    userRol: { type: String, required: true },
    userNombre: { type: String, required: true },
});


// --- GETTERS ---
const unreadCount = computed(() => notificationsStore.unreadCount)
const allNotifications = computed(() => notificationsStore.notifications)

// --- EMITS ---
const emit = defineEmits(['selectAndHighlightOrder'])

// --- MÉTODOS ---
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleClickOutside = (event) => {
  if (isMenuOpen.value && menuContainerRef.value && !menuContainerRef.value.contains(event.target)) {
    closeMenu()
  }
}

const handleNotificationClick = (notification) => {
  notificationsStore.markAsRead(notification.id)
  closeMenu()

  if (notification.orderId) {
    emit('selectAndHighlightOrder', notification.orderId)
  }
}

const markAll = () => {
  notificationsStore.markAllAsRead()
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Sin fecha'
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit', 
    day: 'numeric', 
    month: 'short' 
  })
}

// --- LIFECYCLE ---
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
