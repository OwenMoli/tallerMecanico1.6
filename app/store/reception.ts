// ~/store/reception.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type {
    Client,
    ReceptionCar,
    ChecklistItem,
    ChecklistStatus,
    ReceptionJob,
    Vehicle,
    NaturalClient,
    JuridicalClient
} from '~/types/reception';

// ✅ IMPORTACIONES CLAVE DESDE EL ARCHIVO DE TIPOS EXTERNO
import type {
    Quote,
    ConsolidatedItem,
    ManualOrderDetails,
    QuotationDataStore,
    QuotationTotals
} from '~/types/quotation';

// 2. Tipo para la DATA COMPLETA DEL FORMULARIO DE COTIZACIÓN (Se mantiene, es local)
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


// Definición del slice de estado (Solo para referencia, el tipo de quotationData ya es el correcto)
interface ReceptionStateSlice {
    client: Client | null;
    car: ReceptionCar | null;
    checklist: ChecklistItem[];
    commonChecks: string[];
    isFetchingChecks: boolean;
    serviceAdvisorNotes: string;
    customerNotes: string;
    serviceNotes: string;
    additionalNotes: string;
    carImages: string[];
    lastCompletedReception: {
        clientName: string;
        carPlate: string;
        carBrand: string;
        receptionDate: string;
        receptionId: number;
        assignedMechanic: string | null;
        pdfBase64: string;
        coneId?: string | null;
    } | null;
    isFleet: boolean;
    fleetContactName: string;
    fleetLegalRep: string;
    coneId: string | null;
    vin: string | null;
    vinImageUrl: string | null;
    // ✅ Referencia al tipo correcto: QuotationDataStore
    quotationData: QuotationDataStore | null;
    quotationForm: QuotationFormData | null;
}


export const useReceptionStore = defineStore('reception', () => {
    // --- ESTADO (Refs) ---
    const client = ref<Client | null>(null);
    const car = ref<ReceptionCar | null>(null);
    const checklist = ref<ChecklistItem[]>([]);
    const commonChecks = ref<string[]>([
        "Motor", "Frenos", "Aceite", "Suspensión", "Llantas", "Luces",
        "AC", "Carrocería", "Interior", "Tacómetro", "Parabrisas", "Radio"
    ]);
    const isFetchingChecks = ref(false);
    const serviceAdvisorNotes = ref('');
    const customerNotes = ref('');
    const serviceNotes = ref('');
    const additionalNotes = ref('');
    const carImages = ref<string[]>([]);
    const lastCompletedReception = ref<ReceptionStateSlice['lastCompletedReception']>(null);
    const isFleet = ref(false);
    const fleetContactName = ref('');
    const fleetLegalRep = ref('');
    const coneId = ref<string | null>(null);
    const vin = ref<string | null>(null);
    const vinImageUrl = ref<string | null>(null);

    // ✅ REF CORREGIDO: Usamos el tipo QuotationDataStore
    const quotationData = ref<QuotationDataStore | null>(null);
    const quotationForm = ref<QuotationFormData | null>(null);

    // ESTADOS DE PDF Y COTIZACIÓN SELECCIONADA
    const pdfUrl = ref<string | null>(null);
    const selectedQuotation = ref<Quote | null>(null);

    // --- GETTERS (Computed) ---
    const clientName = computed(() => {
        if (!client.value) return null;
        return 'nombre' in client.value ? client.value.nombre : client.value.empresaNombre;
    });
    const clientPhone = computed(() => {
        if (!client.value) return null;
        return 'telefono' in client.value ? client.value.telefono : client.value.contactoTelefono;
    });
    const clientEmail = computed(() => {
        if (!client.value) return null;
        return 'correo' in client.value
            ? (client.value as NaturalClient).correo || null
            : (client.value as JuridicalClient).contactoCorreo || null;
    });
    const clientAddress = computed(() => {
        if (!client.value) return null;
        return ('direccion' in client.value)
            ? (client.value as any).direccion || null
            : null;
    });

    // --- ACCIONES ---

    const fetchCommonChecks = async () => {
        console.log('Using local common checks. No network request made.');
    };
    const setClient = (newClient: Client) => {
        client.value = newClient;
    };
    const setCar = (newCar: ReceptionCar) => {
        car.value = newCar;
        initializeChecklist();
    };
    const resetReception = () => {
        client.value = null;
        car.value = null;
        checklist.value = [];
        serviceAdvisorNotes.value = '';
        customerNotes.value = '';
        serviceNotes.value = '';
        additionalNotes.value = '';
        carImages.value = [];
        lastCompletedReception.value = null;
        isFleet.value = false;
        fleetContactName.value = '';
        fleetLegalRep.value = '';
        coneId.value = null;
        vin.value = null;
        vinImageUrl.value = null;
        quotationData.value = null;
        quotationForm.value = null;
        pdfUrl.value = null;
        selectedQuotation.value = null;
    };
    const initializeChecklist = () => {
        if (commonChecks.value.length > 0) {
            checklist.value = commonChecks.value.map((name, index) => ({
                id: index + 1,
                nombre: name,
                estado: null,
            }));
        }
    };
    const updateChecklistStatus = (nombre: string, estado: ChecklistStatus) => {
        const item = checklist.value.find(c => c.nombre === nombre);
        if (item) {
            item.estado = estado;
        }
    };
    const addChecklistCategory = (name: string) => {
        const exists = checklist.value.some((c) => c.nombre.toLowerCase() === name.toLowerCase());
        if (!exists) {
            const newId = checklist.value.length ? Math.max(...checklist.value.map((c) => c.id)) + 1 : 1;
            checklist.value.push({ id: newId, nombre: name, estado: null });
        }
    };
    const removeChecklistCategory = (nombre: string) => {
        checklist.value = checklist.value.filter(c => c.nombre !== nombre);
    };
    const setServiceAdvisorNotes = (notes: string) => {
        serviceAdvisorNotes.value = notes;
    };
    const setCustomerNotes = (notes: string) => {
        customerNotes.value = notes;
    };
    const addCarImage = (imageDataUrl: string) => {
        carImages.value.push(imageDataUrl);
    };
    const clearCarImages = () => {
        carImages.value = [];
    };
    const setLastCompletedReception = (data: ReceptionStateSlice['lastCompletedReception']) => {
        lastCompletedReception.value = data;
        localStorage.setItem('lastCompletedReception', JSON.stringify(data));
    };
    const loadLastCompletedReception = () => {
        const storedData = localStorage.getItem('lastCompletedReception');
        if (storedData) {
            lastCompletedReception.value = JSON.parse(storedData);
        }
    };
    const setIsFleet = (isFleetValue: boolean) => {
        isFleet.value = isFleetValue;
    };
    const setCone = (coneIdValue: string) => {
        coneId.value = coneIdValue;
    };
    const setVin = (vinValue: string, imageUrl: string) => {
        vin.value = vinValue;
        vinImageUrl.value = imageUrl;
    };

    // ✅ ACCIÓN CORREGIDA: Ahora espera el tipo QuotationDataStore
    const setQuotationData = (data: QuotationDataStore) => {
        quotationData.value = data;
    };

    const clearQuotationData = () => {
        quotationData.value = null;
    }


    // ** ACCIONES DE COTIZACIÓN **

    const updateQuotationFormData = (data: QuotationFormData) => {
        quotationForm.value = data;
    };

    /**
     * Sincroniza los datos de la Cotización (Quote) en los estados internos del store.
     */
    const syncSelectedQuotation = (quote: Quote) => {
        selectedQuotation.value = quote;

        // La fecha se extrae de lastUpdate del quote
        const quoteDate = quote.lastUpdate.split(' ')[0] || new Date().toISOString().split('T')[0];

        // 1. Mapeo a quotationForm.value (Necesario para generateQuotationPdf)
        quotationForm.value = {
            quotationId: quote.id,
            nombre: quote.client.name, // Nombre de QuoteClient (Simplificado)
            celular: quote.client.phone,
            vehiculo: `${quote.vehicle.brand} ${quote.vehicle.model}`,
            placa: quote.plate,
            vin: quote.vehicle.vin || 'N/A',
            odometro: Number(quote.vehicle.kilometraje) || 0,
            tecnico: quote.details.recepcionista || 'N/A', // Usar details.recepcionista
            fecha: quoteDate,
            comments: quote.comments,
            items: quote.items,

            // 🚨 Mantenemos inicializados en 0 para evitar errores de tipo en el formulario
            totalManoDeObra: 0,
            totalRepuestos: 0,
            subtotalGeneral: 0,
            impuesto: 0,
            totalFinal: quote.total || 0,
        } as QuotationFormData;
        // 🛑 FIN Mapeo quotationForm

        // Mapeo a quotationData (Contexto - QuotationDataStore)
        const clientName = quote.client.name;
        const mappedClient: Partial<Client> = {
            id: Number(quote.client.id) || 0,
            // ✅ FIX CLAVE: Mapeamos el nombre unificado a AMBOS campos para que la API lo encuentre.
            nombre: clientName,
            empresaNombre: clientName,

            telefono: quote.client.phone,
            correo: quote.client.email,
            direccion: quote.client.direccion || 'N/A',
            rtn: quote.client.rtn || 'N/A',
        };

        // Mapeo de Vehicle (Ajustado para cumplir con Vehicle de reception)
        const mappedVehicle: Partial<Vehicle> = {
            marca: quote.vehicle.brand,
            modelo: quote.vehicle.model,
            year: quote.vehicle.year,
            id_cliente: mappedClient.id as number,
            estilo: 'N/A',
            transmision: 'N/A',
            traccion: 'N/A',
            combustible: 'N/A',
            colorPrimario: 'N/A',
            colorSecundario: 'N/A',
            numeroChasis: quote.vehicle.vin || 'N/A',
            numeroMotor: 'N/A',
            tipoAceite: 'N/A',
            marcaFiltroAceite: 'N/A',
            activoFlotilla: 'N/A',
            porcentajeGasolina: 0,
            porcentajeTemperatura: 0,
            porcentajeAceite: 0,
            aseguradora: {
                nombre: 'N/A', contacto: 'N/A', poliza: 'N/A', nombreAsegurado: 'N/A', numeroAviso: 'N/A'
            },
            imageUrl: 'N/A',

            placa: quote.plate,
            kilometraje: Number(quote.vehicle.kilometraje) || 0,
            vin: quote.vehicle.vin || null,
        } as Partial<Vehicle>;

        // Cálculo de totales (para totals: QuotationTotals)
        const total = quote.total || 0;
        const taxRateDisplay = 15.0; // Tasa de impuesto fija del 15%

        const subtotal = total / (1 + taxRateDisplay / 100);
        const tax = total - subtotal;

        const totalsData: QuotationTotals = {
            subtotal: subtotal,
            tax: tax,
            total: total,
            taxRateDisplay: taxRateDisplay
        };

        const quoteDateString = quote.lastUpdate.split(' ')[0] || new Date().toISOString().split('T')[0];

        // Mapeo a QuotationDataStore
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
                // ✅ FIX: Se añade la fecha de creación/actualización al objeto orden
                fechaCreacion: quoteDateString,
            } as ManualOrderDetails,
        };
        // 🛑 FIN AJUSTE DE TIPADO Y ESTRUCTURA 🛑
    };

    /**
     * Genera el PDF de la cotización, guarda el Blob URL en el store (pdfUrl).
     */
    const generateQuotationPdf = async () => {
        const formData = quotationForm.value;
        const storeData = quotationData.value; // Ya tipado como QuotationDataStore | null

        // Verifica que quotationData.value y orden existan
        if (!formData || !formData.nombre || !formData.items.length || !storeData || !storeData.orden) {
            console.error('Fallo al generar PDF: Faltan datos críticos (cliente, items o detalles de orden).');
            alert('No se puede generar el PDF. Faltan datos del cliente, ítems o detalles de la cotización.');
            return;
        }

        clearPdfUrl();

        const storeClient = storeData.client as any;
        const storeVehicle = storeData.vehicle as any;

        // 🛑 USAMOS storeData.orden para fecha, vigencia y asesor
        const quoteOrderDetails = {
            quoteCreationDate: storeData.orden.fechaCreacion || new Date().toLocaleDateString('es-HN'),
            quoteValidity: `${storeData.orden.vigenciaDias} días`,
            quoteAsesor: storeData.orden.asesor || 'N/A',
        };

        const carDetails = {
            marca: storeVehicle?.marca || 'N/A',
            modelo: storeVehicle?.modelo || 'N/A',
            year: storeVehicle?.year || 'N/A',
            placa: formData.placa,
            vin: storeVehicle?.vin || 'N/A',
            odometro: storeVehicle?.kilometraje || 0,
        };

        const payload = {
            quoteData: {
                id: formData.quotationId,
                items: formData.items,
                comments: formData.comments,
                totalFinal: formData.totalFinal
            },
            client: {
                // ✅ ENVIAMOS AMBOS CAMPOS para que la API pueda elegir
                nombre: storeClient?.nombre,
                empresaNombre: storeClient?.empresaNombre,
                telefono: storeClient?.telefono,
                direccion: storeClient?.direccion || 'N/A',
                email: storeClient?.correo || 'N/A',
                rtn: storeClient?.rtn || 'N/A',
            },
            car: carDetails,
            quoteOrderDetails: quoteOrderDetails,
        };

        try {
            const apiUrl = '/api/generate-quotation';
            console.log(`⏳ Llamando a la API para generar PDF: ${formData.quotationId} en ${apiUrl}`);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status} del servidor: ${errorText}`);
            }

            const pdfBlob = await response.blob();
            const url = window.URL.createObjectURL(pdfBlob);

            pdfUrl.value = url;
            console.log(`✅ PDF URL generada y guardada: ${url}`);

        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : 'Error desconocido al generar la cotización.';
            console.error('Fallo en la generación o descarga del PDF:', error);
            alert(`Error al generar la cotización: ${errorMessage}`);
        }
    };

    /**
     * 🆕 ACCIÓN AGREGADA: Guarda o actualiza la cotización.
     * La lógica específica de la API debe implementarse aquí,
     * pero la definición inicial resuelve el TypeError.
     */
    const saveOrUpdateQuotation = async () => {
        // TODO: Implementar la lógica para llamar a la API que guarda/actualiza la cotización
        console.log('⏳ Llamando a la API para guardar/actualizar la cotización...');

        // Simulación:
        if (quotationData.value) {
            console.log('Datos de cotización listos para enviar:', quotationData.value);
            // try {
            //     const response = await fetch('/api/save-quotation', { ... });
            //     // ... lógica de manejo de respuesta
            // } catch (e) {
            //     console.error('Error al guardar la cotización', e);
            // }
        } else {
            console.warn('No hay datos de cotización (quotationData) para guardar.');
        }

        // Retornar un valor (o Promise<void>) si es necesario
        return;
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
            // ... (Tus datos de ejemplo) ...
            { id: 'job-1', description: 'Revisión de frenos', status: 'pending', duration: '2 horas', serviceCost: 350, parts: [ { name: 'Pastillas de freno', quantity: 2, price: 750, customerProvided: false, partNumber: 'PN-001', supplier: 'Supplier A', cost: 500, }, ], notes: 'El cliente reporta chirrido al frenar.', isCustomJob: false, mechanic: null, },
            { id: 'job-2', description: 'Cambio de aceite', status: 'pending', duration: '1 hora', serviceCost: 250, parts: [ { name: 'Filtro de aceite', quantity: 1, price: 150, customerProvided: true, partNumber: 'PN-002', supplier: 'Supplier B', cost: 100, }, { name: 'Aceite de motor', quantity: 4, price: 180, customerProvided: false, partNumber: 'PN-003', supplier: 'Supplier C', cost: 150, }, ], notes: 'Se recomienda usar aceite sintético.', isCustomJob: false, mechanic: null, },
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

        // 🛑 CAMBIO CLAVE: Usamos ManualOrderDetails y campo 'asesor'
        const exampleOrderDetails: ManualOrderDetails = {
            vigenciaDias: 7,
            asesor: 'Recepción Rápida',
            // ✅ FIX: Agregar fecha de creación
            fechaCreacion: new Date().toISOString().split('T')[0],
        };

        // Creamos un objeto QuotationTotals de ejemplo (asumimos cálculos rápidos)
        const total = 2500; // Total de ejemplo
        const taxRateDisplay = 15.0;
        const subtotal = total / (1 + taxRateDisplay / 100);
        const tax = total - subtotal;

        // ✅ Tipado al QuotationDataStore
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
            // 🛑 CAMBIO CLAVE: Usamos el campo 'orden'
            orden: exampleOrderDetails,
        };
    };


    // Retornamos el estado y las acciones
    return {
        // Estado
        client, car, checklist, commonChecks, isFetchingChecks, serviceAdvisorNotes, customerNotes, serviceNotes,
        additionalNotes, carImages, lastCompletedReception, isFleet, fleetContactName, fleetLegalRep, coneId, vin,
        vinImageUrl, quotationData, quotationForm,

        // Estado clave para la funcionalidad de PDF
        pdfUrl,
        selectedQuotation,

        // Getters
        clientName, clientPhone, clientEmail, clientAddress,

        // Acciones
        fetchCommonChecks, setClient, setCar, resetReception, initializeChecklist, updateChecklistStatus,
        addChecklistCategory, removeChecklistCategory, setServiceAdvisorNotes, setCustomerNotes, addCarImage,
        clearCarImages, setLastCompletedReception, loadLastCompletedReception, setIsFleet, setCone, setVin,
        setQuotationData, updateQuotationFormData, syncSelectedQuotation, clearQuotationData,

        // Acciones clave para la funcionalidad de PDF
        generateQuotationPdf,
        clearPdfUrl,

        // 🆕 ACCIÓN EXPUESTA
        saveOrUpdateQuotation,

        createQuickQuotation,
    };
});
