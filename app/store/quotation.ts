// store/quotation.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';


import type { Client, Vehicle, ReceptionJob } from '~/types/reception';
import type {
    Quote,
    ConsolidatedItem,
    ManualOrderDetails,
    QuotationDataStore,
    QuotationTotals
} from '~/types/quotation';

interface QuotationFormData {
    quotationId: string;
    nombre: string;
    celular: string;
    vehiculo: string;
    placa: string;
    vin: string;
    odometro: number | null;
    tecnico: string;
    fecha: string;
    comments: string;
    items: ConsolidatedItem[];
    totalManoDeObra: number;
    totalRepuestos: number;
    subtotalGeneral: number;
    impuesto: number;
    totalFinal: number;
}

export const useQuotationStore = defineStore('quotation', () => {
    // --- ESTADO (Refs) ---
    const quotationData = ref<QuotationDataStore | null>(null);
    const quotationForm = ref<QuotationFormData | null>(null);
    const pdfUrl = ref<string | null>(null);
    const selectedQuotation = ref<Quote | null>(null);

    // ✨ ESTADO NUEVO: Guarda el ID de la cotización que se está editando
    const editingQuoteId = ref<string | null>(null);

    // Esta es la única fuente de verdad para tus cotizaciones.
    const quotes = ref<Quote[]>([
        {
            id: '27215',
            plate: 'XYZ-123',
            status: 'pending',
            total: 800,
            vehicle: { brand: 'TOYOTA', model: 'Corolla', year: 2022, kilometraje: 120000, vin: 'JT2BG12G' },
            client: { id: 'C1', name: 'Rodrigo Kruth', email: 'romarioMdz1997@gmail.com', phone: '+504 9310-5695', rtn: '0801199700010', direccion: 'Col. Moderna, 3ra calle' },
            receptionist: 'Rubén Herrera',
            lastUpdate: '2023-10-10 10:00:00',
            jobs: [],
            comments: 'Revisar frenos y aceite.',
            items: [
                { descripcion: 'Mano de Obra: Revisión', cantidad: 1, manoDeObra: 300, valorRepuesto: 0, codigo: 'MO-REV', marca: 'Taller', condicion: 'Servicio' },
                { descripcion: 'Filtro de Aire', cantidad: 1, manoDeObra: 0, valorRepuesto: 500, codigo: 'FA-123', marca: 'Wix', condicion: 'Nuevo' },
            ] as ConsolidatedItem[],
            details: { vigenciaDias: 7, recepcionista: 'Rubén Herrera' },
        },
        {
            id: '27214',
            plate: 'ABC-456',
            status: 'quoted',
            total: 14000,
            vehicle: { brand: 'HONDA', model: 'Civic', year: 2021, kilometraje: 80000, vin: 'ABG45GTD' },
            client: { id: 'C2', name: 'GR Tecnologia', email: 'info@gr.com', phone: '+504 1234-5678', rtn: '0800199000055', direccion: 'Barrio El Centro' },
            receptionist: 'Rubén Herrera',
            lastUpdate: '2023-10-09 15:30:00',
            jobs: [],
            comments: 'Cambio de clutch completo.',
            items: [
                { descripcion: 'Mano de Obra: Clutch', cantidad: 1, manoDeObra: 5000, valorRepuesto: 0, codigo: 'MO-CLT', marca: 'Taller', condicion: 'Servicio' },
                { descripcion: 'Kit de Clutch', cantidad: 1, manoDeObra: 0, valorRepuesto: 9000, codigo: 'KC-456', marca: 'Exedy', condicion: 'Nuevo' },
            ] as ConsolidatedItem[],
            details: { vigenciaDias: 15, recepcionista: 'Rubén Herrera' },
        },
    ]);

    // --- ACCIONES ---

    const setEditingQuoteId = (id: string | null) => {
        editingQuoteId.value = id;
    };

    // ✨ ACCIÓN NUEVA: Solo para preparar la edición de forma limpia.
    // Esta función únicamente establece la cotización seleccionada,
    // que el formulario usará para cargarse en modo de edición.
    // NO toca `quotationData`.
    const setSelectedQuotationForEdit = (quote: Quote) => {
        selectedQuotation.value = quote;
    };

    const setQuotationData = (data: QuotationDataStore) => {
        quotationData.value = data;
    };

    const resetSelectedQuotation = () => {
        selectedQuotation.value = null;
        editingQuoteId.value = null; 
        console.log('✅ Estado de edición reseteado.');
    };

    const clearQuotationData = () => {
        quotationData.value = null;
    }

    const resetQuotation = () => {
        quotationData.value = null;
        quotationForm.value = null;
        selectedQuotation.value = null;
        editingQuoteId.value = null; 
        clearPdfUrl();
    };

    const updateQuotationFormData = (data: QuotationFormData) => {
        quotationForm.value = data;
    };

    const syncSelectedQuotation = (quote: Quote) => {
        selectedQuotation.value = quote;

        const quoteDate = quote.lastUpdate.split(' ')[0] || new Date().toISOString().split('T')[0];

        quotationForm.value = {
            quotationId: quote.id,
            nombre: quote.client.name,
            celular: quote.client.phone,
            vehiculo: `${quote.vehicle.brand} ${quote.vehicle.model}`,
            placa: quote.plate,
            vin: quote.vehicle.vin || 'N/A',
            odometro: Number(quote.vehicle.kilometraje) || 0,
            tecnico: quote.details.recepcionista || 'N/A',
            fecha: quoteDate,
            comments: quote.comments,
            items: quote.items,
            totalManoDeObra: 0,
            totalRepuestos: 0,
            subtotalGeneral: 0,
            impuesto: 0,
            totalFinal: quote.total || 0,
        } as QuotationFormData;

        const clientName = quote.client.name;
        const mappedClient: Partial<Client> = {
            id: Number(quote.client.id) || 0,
            nombre: clientName,
            empresaNombre: clientName,
            telefono: quote.client.phone,
            correo: quote.client.email,
            direccion: quote.client.direccion || 'N/A',
            rtn: quote.client.rtn || 'N/A',
        };

        const mappedVehicle: Partial<Vehicle> = {
            marca: quote.vehicle.brand,
            modelo: quote.vehicle.model,
            year: quote.vehicle.year,
            id_cliente: mappedClient.id as number,
            placa: quote.plate,
            kilometraje: Number(quote.vehicle.kilometraje) || 0,
            vin: quote.vehicle.vin || null,
        } as Partial<Vehicle>;

        const total = quote.total || 0;
        const taxRateDisplay = 15.0;
        const subtotal = total / (1 + taxRateDisplay / 100);
        const tax = total - subtotal;
        const totalsData: QuotationTotals = {
            subtotal,
            tax,
            total,
            taxRateDisplay,
        };

        const quoteDateString = quote.lastUpdate.split(' ')[0] || new Date().toISOString().split('T')[0];

        quotationData.value = {
            client: mappedClient as Client,
            vehicle: mappedVehicle as Vehicle,
            items: quote.items,
            comments: quote.comments,
            jobs: quote.jobs,
            taxRate: taxRateDisplay,
            totals: totalsData,
            orden: {
                vigenciaDias: quote.details.vigenciaDias,
                asesor: quote.details.recepcionista,
                fechaCreacion: quoteDateString,
            } as ManualOrderDetails,
        };
    };

    const generateQuotationPdf = async () => {
        const formData = quotationForm.value;
        const storeData = quotationData.value;

        if (!formData || !formData.nombre || !formData.items.length || !storeData || !storeData.orden) {
            console.error('Fallo al generar PDF: Faltan datos críticos.');
            alert('No se puede generar el PDF. Faltan datos del cliente, ítems o detalles de la cotización.');
            return;
        }

        clearPdfUrl();

        const storeClient = storeData.client as any;
        const storeVehicle = storeData.vehicle as any;

        const payload = {
            quoteData: {
                id: formData.quotationId,
                items: formData.items,
                comments: formData.comments,
                totalFinal: formData.totalFinal
            },
            client: {
                nombre: storeClient?.nombre,
                empresaNombre: storeClient?.empresaNombre,
                telefono: storeClient?.telefono,
                direccion: storeClient?.direccion || 'N/A',
                email: storeClient?.correo || 'N/A',
                rtn: storeClient?.rtn || 'N/A',
            },
            car: {
                marca: storeVehicle?.marca || 'N/A',
                modelo: storeVehicle?.modelo || 'N/A',
                year: storeVehicle?.year || 'N/A',
                placa: formData.placa,
                vin: storeVehicle?.vin || 'N/A',
                odometro: storeVehicle?.kilometraje || 0,
            },
            quoteOrderDetails: {
                quoteCreationDate: storeData.orden.fechaCreacion || new Date().toLocaleDateString('es-HN'),
                quoteValidity: `${storeData.orden.vigenciaDias} días`,
                quoteAsesor: storeData.orden.asesor || 'N/A',
            },
        };

        try {
            const response = await fetch('/api/generate-quotation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error(`Error ${response.status} del servidor: ${await response.text()}`);

            const pdfBlob = await response.blob();
            pdfUrl.value = window.URL.createObjectURL(pdfBlob);
            console.log(`✅ PDF URL generada y guardada.`);
        } catch (error) {
            console.error('Fallo en la generación del PDF:', error);
            alert(`Error al generar la cotización: ${(error as Error).message}`);
        }
    };

    const saveOrUpdateQuotation = async () => {
        console.log('⏳ Llamando a la API para guardar/actualizar la cotización...');
        if (quotationData.value) {
            console.log('Datos de cotización listos para enviar:', quotationData.value);

        } else {
            console.warn('No hay datos de cotización (quotationData) para guardar.');
        }
    };

    const clearPdfUrl = () => {
        if (pdfUrl.value) {
            window.URL.revokeObjectURL(pdfUrl.value);
            pdfUrl.value = null;
            console.log('PDF URL limpiada.');
        }
    };

    const createQuickQuotation = (client: Client, vehicle: Vehicle) => {
        const jobs: ReceptionJob[] = [
            { id: 'job-1', description: 'Revisión de frenos', status: 'pending', duration: '2 horas', serviceCost: 350, parts: [{ name: 'Pastillas de freno', quantity: 2, price: 750, customerProvided: false, partNumber: 'PN-001', supplier: 'Supplier A', cost: 500, },], notes: 'El cliente reporta chirrido al frenar.', isCustomJob: false, mechanic: null, },
            { id: 'job-2', description: 'Cambio de aceite', status: 'pending', duration: '1 hora', serviceCost: 250, parts: [{ name: 'Filtro de aceite', quantity: 1, price: 150, customerProvided: true, partNumber: 'PN-002', supplier: 'Supplier B', cost: 100, }, { name: 'Aceite de motor', quantity: 4, price: 180, customerProvided: false, partNumber: 'PN-003', supplier: 'Supplier C', cost: 150, },], notes: 'Se recomienda usar aceite sintético.', isCustomJob: false, mechanic: null, },
        ];

        const exampleConsolidatedItems: ConsolidatedItem[] = jobs.flatMap(job => {
            const items: ConsolidatedItem[] = [];
            items.push({ descripcion: `Servicio: ${job.description}`, cantidad: 1, manoDeObra: job.serviceCost, valorRepuesto: 0, codigo: `MO-${job.id}`, marca: 'Taller', condicion: 'Servicio', priceKey: 'precio1' });
            job.parts.forEach(part => {
                if (!part.customerProvided) {
                    items.push({ descripcion: part.name, cantidad: 1, manoDeObra: 0, valorRepuesto: part.price, codigo: part.partNumber || 'N/A', marca: part.supplier || 'N/A', condicion: 'Nuevo', priceKey: 'precio1' });
                }
            });
            return items;
        });



        const exampleOrderDetails: ManualOrderDetails = {
            vigenciaDias: 7,
            asesor: 'Recepción Rápida',
            fechaCreacion: new Date().toISOString().split('T')[0],
        };

        const total = 2500; 
        const taxRateDisplay = 15.0;
        const subtotal = total / (1 + taxRateDisplay / 100);
        const tax = total - subtotal;

        quotationData.value = {
            client: client,
            vehicle: vehicle,
            jobs: jobs,
            items: exampleConsolidatedItems,
            comments: 'Esta es una cotización rápida de ejemplo.',
            taxRate: taxRateDisplay,
            totals: {
                subtotal: subtotal,
                tax: tax,
                total: total,
                taxRateDisplay: taxRateDisplay
            },
            orden: exampleOrderDetails,
        };
    };

    return {

        quotationData,
        quotationForm,
        pdfUrl,
        selectedQuotation,
        quotes,
        editingQuoteId,

    
        setQuotationData,
        clearQuotationData,
        resetQuotation,
        updateQuotationFormData,
        syncSelectedQuotation,
        resetSelectedQuotation,
        generateQuotationPdf,
        saveOrUpdateQuotation,
        clearPdfUrl,
        createQuickQuotation,
        setEditingQuoteId,
        setSelectedQuotationForEdit, 
    };
});
