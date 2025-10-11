// store/historyStore.js
import { defineStore } from 'pinia';
// Nota: Asegúrate que la ruta sea correcta, si el archivo se llama `initialHistory.js` en la carpeta `data`
import { initialHistory } from '~/data/loadInitialHistory'; 

/**
 * @typedef {object} HistoryItem
 * @property {number} id - ID único del movimiento.
 * @property {string} usuario - Nombre del usuario que realiza la acción.
 * @property {string} rol - Rol del usuario (ej. 'Mecanico - A', 'Jefe Mecanico').
 * @property {string} evento - Tipo de evento (ej. 'Orden Pausada').
 * @property {string} comentario - Detalle del evento.
 * @property {string} orden - ID de la orden de trabajo (ej. '#R001').
 * @property {string} estado - Nuevo estado de la orden.
 * @property {boolean} pausado - Indica si la orden está pausada.
 * @property {string} fecha - Marca de tiempo ISO simplificada.
 */

export const useHistoryStore = defineStore('history', {
    state: () => ({
        /** @type {Object.<string, HistoryItem[]>} */
        historiesByOrder: {}, 
        nextId: 100,
    }),

    getters: {
        /**
         * Devuelve el historial de movimientos para una orden específica.
         * 💡 CLAVE: Devolvemos una COPIA del array para forzar la inmutabilidad
         * y asegurar que Vue detecte el cambio completo en el componente.
         * @param {string} orderId - El ID de la orden (ej. '#R001').
         * @returns {HistoryItem[]}
         */
        getHistoryByOrderId: (state) => (orderId) => {
            // Devolvemos el array reactivo como una COPIA o uno vacío.
            return state.historiesByOrder[orderId] 
                ? [...state.historiesByOrder[orderId]] 
                : [];
        },
    },

    actions: {
        loadInitialHistory() {
            if (Object.keys(this.historiesByOrder).length > 0) return;
            
            const newHistories = {};
            initialHistory.forEach(item => {
                const orderId = item.orden;
                if (!newHistories[orderId]) {
                    newHistories[orderId] = [];
                }
                newHistories[orderId].push(item);
            });
            
            this.historiesByOrder = newHistories;

            const maxId = Math.max(...initialHistory.map(n => n.id));
            if (maxId && maxId >= this.nextId) {
                this.nextId = maxId + 1;
            }
        },

        /**
         * Agrega un nuevo movimiento al historial de una orden específica.
         * @param {object} newMovementData - Los datos del movimiento.
         */
        addMovement(newMovementData) {
            const orderId = newMovementData.orden;
            
            if (!orderId) {
                console.error("Error: Se requiere 'orden' para añadir un movimiento al historial.");
                return;
            }
            
            // 1. Formateamos la fecha a un formato 'YYYY-MM-DD HH:MM' para consistencia.
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const newMovement = {
                id: this.nextId++, 
                fecha: `${year}-${month}-${day} ${hours}:${minutes}`, 
                ...newMovementData, 
            };

            // 2. Usamos $patch para asegurar la reactividad al añadir nuevas propiedades (órdenes)
            this.$patch(state => {
                if (!state.historiesByOrder[orderId]) {
                    state.historiesByOrder[orderId] = [];
                }
                
                // 3. Agregar el nuevo movimiento
                state.historiesByOrder[orderId].push(newMovement);
            });
        },
    },
});