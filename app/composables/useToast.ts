// composables/useToast.ts

import { ref } from 'vue';

// Define la interfaz para los mensajes de toast para asegurar la consistencia de los datos.
export interface ToastMessage {
  id: string; // Identificador único para cada toast
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  timeout?: number; // Duración del toast en milisegundos
}

// Un ref para almacenar la cola de toasts. Este será el estado reactivo.
const toasts = ref<ToastMessage[]>([]);

// La función principal para agregar un nuevo toast a la cola.
function add(toast: Omit<ToastMessage, 'id'>) {
  const id = Date.now().toString(); // Genera un ID único basado en el tiempo.
  const newToast = { ...toast, id };
  toasts.value.push(newToast);

  // Remueve automáticamente el toast después de un tiempo definido.
  setTimeout(() => {
    remove(id);
  }, newToast.timeout || 5000); // Por defecto, se elimina después de 5 segundos.
}

// La función para remover un toast específico por su ID.
function remove(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

// El composable que se exporta.
export function useToast() {
  return {
    toasts, // El estado reactivo de la cola de toasts.
    add,    // La función para agregar un toast.
    remove, // La función para remover un toast.
  };
}
