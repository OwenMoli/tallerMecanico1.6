import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { WorkOrder, WorkOrderStatus, WorkOrderPdfPayload } from '~/types/workorder';
import type { Quote } from '~/types/quotation';

export const useWorkOrderStore = defineStore('workOrder', () => {
    // --- ESTADO ---
    const workOrders = ref<WorkOrder[]>([]);
    const selectedWorkOrder = ref<WorkOrder | null>(null);
    const workOrderPdfUrl = ref<string | null>(null);

    // --- ACCIONES ---

    /**
     * Convierte una cotización aprobada en una nueva Orden de Trabajo, la añade
     * al estado y la selecciona.
     * @param quote La cotización que ha sido aprobada.
     * @returns La nueva orden de trabajo creada.
     */
    const createWorkOrderFromQuote = (quote: Quote): WorkOrder | null => {
        if (!quote) {
            console.error("Se intentó crear una OT desde una cotización nula.");
            return null;
        }

        const newWorkOrder: WorkOrder = {
            id: `OT-${Date.now()}`, // Genera un ID único para la OT
            quotationId: quote.id,
            status: 'Pendiente',
            client: quote.client,
            vehicle: quote.vehicle,
            plate: quote.plate,
            items: JSON.parse(JSON.stringify(quote.items)), // Copia profunda de los items
            total: quote.total,
            creationDate: new Date().toISOString(),
            notes: quote.comments, // Las notas de la cotización pasan a ser notas para el mecánico
            assignedMechanic: 'No asignado',
        };

        // Añade la nueva OT al principio de la lista
        workOrders.value.unshift(newWorkOrder);

        // Selecciona la OT recién creada
        selectedWorkOrder.value = newWorkOrder;

        console.log(`✅ Orden de Trabajo ${newWorkOrder.id} creada desde la cotización ${quote.id}.`);

        // Retorna la nueva OT para que la UI pueda reaccionar
        return newWorkOrder;
    };

    /**
     * Selecciona una orden de trabajo para visualizarla en detalle.
     * @param workOrder La orden de trabajo a seleccionar.
     */
    const selectWorkOrder = (workOrder: WorkOrder) => {
        selectedWorkOrder.value = workOrder;
    };

    /**
     * Genera el PDF de la Orden de Trabajo actualmente seleccionada llamando a la API.
     */
    const generateWorkOrderPdf = async () => {
        if (!selectedWorkOrder.value) {
            alert('No hay una orden de trabajo seleccionada para generar el PDF.');
            return;
        }

        clearWorkOrderPdfUrl(); // Limpia cualquier PDF anterior

        const payload: WorkOrderPdfPayload = {
            workOrder: selectedWorkOrder.value,
        };

        try {
            console.log(`⏳ Generando PDF para la OT: ${selectedWorkOrder.value.id}`);
            const response = await fetch('/api/generate-workorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${errorText}`);
            }

            const pdfBlob = await response.blob();
            const url = window.URL.createObjectURL(pdfBlob);
            workOrderPdfUrl.value = url;
            console.log(`✅ PDF de OT generado y disponible en: ${url}`);

        } catch (error) {
            console.error('Fallo en la generación del PDF de la OT:', error);
            alert(`Error al generar el PDF de la Orden de Trabajo: ${error}`);
        }
    };

    /**
     * Limpia la URL del PDF de la OT para liberar memoria del navegador.
     */
    const clearWorkOrderPdfUrl = () => {
        if (workOrderPdfUrl.value) {
            window.URL.revokeObjectURL(workOrderPdfUrl.value);
            workOrderPdfUrl.value = null;
        }
    };

    return {
        // Estado
        workOrders,
        selectedWorkOrder,
        workOrderPdfUrl,

        // Acciones
        createWorkOrderFromQuote,
        selectWorkOrder,
        generateWorkOrderPdf,
        clearWorkOrderPdfUrl,
    };
});
