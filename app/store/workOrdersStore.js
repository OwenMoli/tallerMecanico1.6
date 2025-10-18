import { defineStore } from 'pinia';
import { initialOrders } from '~/data/ordersData';

// Constantes de las claves de las fases de tiempo y los estados pausados/finales
const TIME_PHASE_KEYS = { 
    'En Cola': 0, 'Diagnóstico': 0, 'Taller': 0, 'Pruebas': 0, 
    'Pausado': 0, 'Rechazado': 0, 'Denegado': 0, 'Completado': 0, 'Cotizando': 0
};
const PAUSED_STAGES = ['Denegado', 'Rechazado', 'Pausado', 'Completado'];

// ➡️ Función de utilidad: Inicializa o procesa una orden
const initializeOrder = (order) => {
    const now = Date.now();
    const statusKey = order.status;
    let startTime = null;
    
    // Determina el inicio del cronómetro de fase actual
    const isPausedStage = PAUSED_STAGES.includes(statusKey);
    
    if (!isPausedStage) {
        startTime = order.mecanicoAsignadoFecha 
            ? new Date(order.mecanicoAsignadoFecha).getTime() 
            : new Date(order.fecha).getTime() || now;
    }
    
    // La clave de la fase (currentStageKey) es 'En Cola' si está 'Pendiente' y sin mecánico asignado.
    const initialKey = (order.status === 'Pendiente' && !order.mecanico) ? 'En Cola' : statusKey;

    return {
        ...order,
        fecha: new Date(order.fecha), 
        
        // Asegura que los campos de cronometraje global existan
        inicio: order.inicio ?? null,
        contador: order.contador ?? 0,
        acumulado: order.acumulado ?? 0,
        
        // Asegura la estructura completa de tiemposPorFase
        tiemposPorFase: { 
            ...TIME_PHASE_KEYS, 
            ...order.tiemposPorFase 
        },
        
        currentStageStartTime: startTime,
        currentStageKey: initialKey,
    };
};

// Función de utilidad: Aplica initializeOrder al array inicial
const processInitialOrders = (orders) => orders.map(initializeOrder);


// ➡️ Store: 'workOrders'
export const useWorkOrdersStore = defineStore('workOrders', {
    
    // STATE
    state: () => ({
        activeOrders: processInitialOrders(initialOrders),
    }),

    // ACTIONS
    actions: {
        /**
         * Agrega una nueva orden de trabajo, inicializando sus campos de cronometraje.
         */
        addOrder(newOrder) {
            try {
                const processedOrder = initializeOrder(newOrder);
                this.activeOrders.unshift(processedOrder);
                console.log(`✅ Nueva orden ${processedOrder.id} agregada.`);
            } catch (error) {
                console.error("❌ Error al agregar la orden:", error);
            }
        },

        /**
         * Actualiza una orden existente por ID.
         */
        updateOrder(updatedOrder) {
            if (!(updatedOrder.fecha instanceof Date)) {
                updatedOrder.fecha = new Date(updatedOrder.fecha);
            }
            const index = this.activeOrders.findIndex(o => o.id === updatedOrder.id);
            
            if (index !== -1) {
                this.activeOrders[index] = { ...updatedOrder }; 
                console.log(`✅ Orden ${updatedOrder.id} actualizada.`);
            }
        },
    },
});