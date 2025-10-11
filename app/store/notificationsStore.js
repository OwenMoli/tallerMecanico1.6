import { defineStore } from 'pinia';
import { initialNotifications } from '~/data/notificationsData'; 

// Función auxiliar para calcular el nextId
const calculateNextId = () => {
    if (initialNotifications.length === 0) return 100;
    return Math.max(...initialNotifications.map(n => n.id)) + 1;
};

export const useNotificationsStore = defineStore('notifications', {
    /**
     * State: Ahora inicializa directamente con los datos.
     */
    state: () => ({
        // 🚨 CAMBIO CLAVE: Inicializamos el estado directamente con los datos estáticos.
        notifications: [...initialNotifications], 
        // Calculamos el próximo ID una sola vez.
        nextId: calculateNextId(), 
    }),

    getters: {
        unreadCount: (state) => {
            return state.notifications.filter(n => !n.read).length;
        },
    },

    /**
     * Actions: Eliminamos loadInitialNotifications
     */
    actions: {
        // 🚨 ACCIÓN ELIMINADA: Ya no se necesita, la inicialización ocurre en state()
        // loadInitialNotifications() { /* ... */ }, 

        addNotification(newNotificationData) {
            const newNotification = {
                id: this.nextId++, 
                timestamp: new Date().toISOString(), 
                read: false, 
                ...newNotificationData, 
            };
            this.notifications.unshift(newNotification);
        },
        
        // ... (markAsRead, markAllAsRead, deleteNotification siguen igual)
        markAsRead(notificationId) {
             const notification = this.notifications.find(n => n.id === notificationId);
             if (notification) {
                 notification.read = true;
             }
        },
        markAllAsRead() {
             this.notifications.forEach(notification => {
                 notification.read = true;
             });
        },
    },
});