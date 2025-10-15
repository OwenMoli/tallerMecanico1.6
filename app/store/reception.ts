

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
    Client,
    ReceptionCar,
    ChecklistItem,
    ChecklistStatus,
    NaturalClient,
    JuridicalClient,
    ImageBase64
} from '~/types/reception';


interface ReceptionState {
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
}



export const useReceptionStore = defineStore('reception', () => {


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
    const vin = ref<string | null>(null);
    const vinImageUrl = ref<string | null>(null);
    const coneId = ref<string | null>(null);


    const isFleet = ref(false);
    const fleetContactName = ref('');
    const fleetLegalRep = ref('');


    const lastCompletedReception = ref<ReceptionState['lastCompletedReception']>(null);


    /**
     * @returns El nombre del cliente (persona o empresa).
     */
    const clientName = computed(() => {
        if (!client.value) return null;

        return 'nombre' in client.value
            ? (client.value as NaturalClient).nombre
            : (client.value as JuridicalClient).empresaNombre;
    });

    /**
     * @returns El teléfono de contacto del cliente (persona o empresa).
     */
    const clientPhone = computed(() => {
        if (!client.value) return null;
        return 'telefono' in client.value
            ? (client.value as NaturalClient).telefono
            : (client.value as JuridicalClient).contactoTelefono;
    });

    /**
     * @returns El email de contacto del cliente (persona o empresa).
     */
    const clientEmail = computed(() => {
        if (!client.value) return null;
        return 'correo' in client.value
            ? (client.value as NaturalClient).correo || null
            : (client.value as JuridicalClient).contactoCorreo || null;
    });

    /**
     * @returns La dirección del cliente si está disponible.
     */
    const clientAddress = computed(() => {
        if (!client.value) return null;
        return ('direccion' in client.value)
            ? (client.value as NaturalClient).direccion || null
            : null;
    });

    const setPaintDiagram = (imageBase64: ImageBase64 | null) => {
        if (car.value) {
            // El tipo 'ReceptionCar' ahora debe incluir 'paintDiagram'
            car.value.paintDiagram = imageBase64;
        }
    };


    const setClient = (newClient: Client) => {
        client.value = newClient;
    };

    const setCar = (newCar: ReceptionCar) => {
        car.value = newCar;
        initializeChecklist();
    };

    const setCone = (coneIdValue: string) => {
        coneId.value = coneIdValue;
    };

    const setVin = (vinValue: string, imageUrl: string) => {
        vin.value = vinValue;
        vinImageUrl.value = imageUrl;
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


    const setServiceNotes = (notes: string) => {
        serviceNotes.value = notes;
    };

    const setAdditionalNotes = (notes: string) => {
        additionalNotes.value = notes;
    };



    const addCarImage = (imageDataUrl: string) => {
        carImages.value.push(imageDataUrl);
    };

    const clearCarImages = () => {
        carImages.value = [];
    };



    const setIsFleet = (isFleetValue: boolean) => {
        isFleet.value = isFleetValue;
    };


    const setLastCompletedReception = (data: ReceptionState['lastCompletedReception']) => {
        lastCompletedReception.value = data;
        localStorage.setItem('lastCompletedReception', JSON.stringify(data));
    };

    const loadLastCompletedReception = () => {
        const storedData = localStorage.getItem('lastCompletedReception');
        if (storedData) {
            lastCompletedReception.value = JSON.parse(storedData);
        }
    };

    const resetReception = () => {

        if (car.value) {
            car.value.paintDiagram = null; // Limpiar el diagrama de pintura
        }

        car.value = null;
        client.value = null;
        checklist.value = [];
        serviceAdvisorNotes.value = '';
        customerNotes.value = '';
        serviceNotes.value = '';
        additionalNotes.value = '';
        carImages.value = [];
        isFleet.value = false;
        fleetContactName.value = '';
        fleetLegalRep.value = '';
        coneId.value = null;
        vin.value = null;
        vinImageUrl.value = null;
    };



    return {

        client, car, coneId, vin, vinImageUrl,
        checklist, commonChecks, isFetchingChecks,
        serviceAdvisorNotes, customerNotes, serviceNotes, additionalNotes,
        carImages,
        isFleet, fleetContactName, fleetLegalRep,
        lastCompletedReception,


        clientName, clientPhone, clientEmail, clientAddress,


        setClient, setCar, setCone, setVin,
        initializeChecklist, updateChecklistStatus, addChecklistCategory, removeChecklistCategory,
        setServiceAdvisorNotes, setCustomerNotes, setServiceNotes, setAdditionalNotes,
        addCarImage, clearCarImages,
        setIsFleet,
        setLastCompletedReception, loadLastCompletedReception,
        setPaintDiagram,
        resetReception,
    };
});