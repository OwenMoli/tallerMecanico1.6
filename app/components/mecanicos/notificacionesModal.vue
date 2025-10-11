<template>
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/10">
        <div
            class="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-auto p-6 pointer-events-auto transform transition-all duration-300 scale-100 ease-out">

            <div class="flex flex-col items-center border-b pb-4 mb-4 relative">
                <div class="p-3 bg-orange-500 rounded-full inline-flex mb-3 shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L14 11.586V8a6 6 0 00-6-6zM16 17H4a1 1 0 000 2h12a1 1 0 000-2z" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Petición / Notificación</h3>
                <button @click="closeModal" class="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-sm font-medium text-gray-600">Orden #</label>
                    <p class="text-lg font-bold text-gray-900">{{ orderId }}</p>
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-600">Coche</label>
                    <p class="text-lg font-bold text-gray-900">{{ carModel }}</p>
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-600">Mecánico</label>
                    <p class="text-lg font-bold text-gray-900">{{ mechanicName }}</p>
                </div>

                <div>
                    <label for="motivo" class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select id="motivo" v-model="selectedReason"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option v-for="reason in filteredReasons" :key="reason.value" :value="reason.value">
                            {{ reason.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="comentario" class="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
                    <textarea id="comentario" v-model="comment" placeholder="Escribe aquí tu comentario o detalles"
                        rows="4"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>
            </div>

            <div class="flex justify-end space-x-3 pt-6">
                <button @click="closeModal"
                    class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition duration-150">
                    Cancelar
                </button>
                <button @click="submitNotification" :disabled="!isFormValid"
                    class="px-4 py-2 text-white bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition duration-150 disabled:bg-green-300">
                    Enviar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotificationsStore } from '~/store/notificationsStore';
import { useHistoryStore } from '~/store/historyStore';

const notificationsStore = useNotificationsStore();
const historyStore = useHistoryStore();

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    orderId: { type: [String, Number], required: true },
    carModel: { type: String, required: true },
    mechanicName: { type: String, required: true },
    orderStatus: { type: String, required: true },
    userNombre: { type: String, required: true },
    userRol: { type: String, required: true },
});

const emit = defineEmits(['close']);

const selectedReason = ref('Notificacion');
const comment = ref('');

// Todas las razones posibles
const reasons = [
    { value: 'Notificacion', label: 'Notificacion' },
    { value: 'Pausar Orden', label: 'Pausar Orden' },
    { value: 'Requerir Repuesto', label: 'Requerir Repuesto' },
    { value: 'Notificar Avance', label: 'Notificar Avance' },
];

// Filtramos según el rol
const filteredReasons = computed(() => {
    if (props.userRol === 'Jefe Mecanico') {
        return reasons.filter(r => r.value === 'Notificacion');
    }
    return reasons;
});

const isFormValid = computed(() => selectedReason.value !== '');

const closeModal = () => {
    emit('close');
    selectedReason.value = 'Notificacion';
    comment.value = '';
};

const submitNotification = () => {
    if (!isFormValid.value) return;

    const notificationData = {
        orderId: props.orderId,
        Type: selectedReason.value,
        comment: comment.value.trim(),
        mechanicName: props.mechanicName,
        carModel: props.carModel,
    };

    notificationsStore.addNotification(notificationData);

    historyStore.addMovement({
        usuario: props.userNombre,
        rol: props.userRol,
        evento: props.userRol === 'Jefe Mecanico'
            ? `Notificacion a ${props.mechanicName}`
            : selectedReason.value, 
        comentario: ` ${comment.value.trim() || 'Sin detalles'}.`,
        orden: props.orderId,
        estado: props.orderStatus,
        pausado: selectedReason.value === 'Pausar Orden',
    });

    closeModal();
};
</script>
