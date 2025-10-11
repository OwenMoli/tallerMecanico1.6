// stores/ordenes.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 1. Definir la interfaz para el objeto de la orden
export interface Orden {
    numero: string;
    cliente: string;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    fechaHora: string;
    contador: number;
    diagnosticoMecanico: string;
    archivos: any[]; // Considerar una interfaz más específica para archivos
    estado?: 'terminada' | 'aprobada' | 'devuelta';
    motivoDenegada?: string;
}

export const useOrdenesStore = defineStore('ordenes', () => {
    // 2. Tipar las variables reactivas con la interfaz
    const terminadas = ref<Orden[]>([
        { numero: 'R006', cliente: 'Roberto Pérez', placa: 'MNB-887', marca: 'Kia', modelo: 'Sportage', anio: 2020, fechaHora: '2025-09-11 14:00', contador: 5400, diagnosticoMecanico: 'Falla en el sistema de inyección de combustible.', archivos: [] },
        { numero: 'R007', cliente: 'Sofía Castro', placa: 'OPQ-123', marca: 'Chevrolet', modelo: 'Spark', anio: 2019, fechaHora: '2025-09-11 15:30', contador: 3600, diagnosticoMecanico: 'Necesita cambio de aceite y filtro.', archivos: [] },
        { numero: 'R008', cliente: 'Andrea Milla', placa: 'RST-789', marca: 'Hyundai', modelo: 'Tucson', anio: 2022, fechaHora: '2025-09-11 16:00', contador: 7200, diagnosticoMecanico: 'Problemas en el sistema de frenos. Se recomienda reemplazo de pastillas.', archivos: [] }
    ]);
    const aprobadas = ref<Orden[]>([]);
    const devueltas = ref<Orden[]>([]);

    // 3. Tipar los argumentos de las funciones (acciones)
    function aprobarOrden(orden: Orden) {
        const index = terminadas.value.findIndex(o => o.numero === orden.numero);
        if (index !== -1) {
            terminadas.value.splice(index, 1);
            aprobadas.value.push({ ...orden, estado: 'aprobada' });
        }
    }

    function devolverOrden(orden: Orden, motivo: string) {
        const index = terminadas.value.findIndex(o => o.numero === orden.numero);
        if (index !== -1) {
            terminadas.value.splice(index, 1);
            devueltas.value.push({ ...orden, estado: 'devuelta', motivoDenegada: motivo });
        }
    }

    return { terminadas, aprobadas, devueltas, aprobarOrden, devolverOrden };
});
