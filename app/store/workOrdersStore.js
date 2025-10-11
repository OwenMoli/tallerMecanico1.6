import { defineStore } from 'pinia';
import { initialOrders } from '~/data/ordersData'; // ⚠️ Solo importamos initialOrders

// Función de utilidad: Convierte strings de fecha a objetos Date
const processInitialOrders = (orders) => {
  return orders.map(order => ({
    ...order,
    fecha: new Date(order.fecha), 
  }));
};

// ➡️ Nombre de la Store: 'workOrders'
export const useWorkOrdersStore = defineStore('workOrders', {
  
  // 🔹 STATE: El array central y reactivo de órdenes activas
  state: () => ({
    activeOrders: processInitialOrders(initialOrders),
    // ⚠️ Se eliminó dashboardItems de aquí.
  }),

  // 🔹 ACTIONS: Las funciones para modificar el estado
  actions: {
    updateOrder(updatedOrder) {
      if (!(updatedOrder.fecha instanceof Date)) {
          updatedOrder.fecha = new Date(updatedOrder.fecha)
      }
      const index = this.activeOrders.findIndex(o => o.id === updatedOrder.id);
      
      if (index !== -1) {
        this.activeOrders[index] = { ...updatedOrder }; 
        console.log(`✅ Orden ${updatedOrder.id} actualizada en WorkOrders Store.`);
      }
    },
  },
});