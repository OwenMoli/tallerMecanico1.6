import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue'; // <--- IMPORTANTE: 'watch' es necesario para la persistencia
import type {
    Client,
    ReceptionCar,
    ChecklistItem,
    ChecklistStatus,
    NaturalClient,
    JuridicalClient,
    ImageBase64
} from '~/types/reception'; // Asegúrate de que esta ruta sea correcta

// ====================================================================
// CONFIGURACIÓN DE PERSISTENCIA
// ====================================================================

// Clave única para guardar/cargar el estado de la recepción en progreso en localStorage
const LOCAL_STORAGE_KEY = 'reception_in_progress';

// Interfaz para tipar los datos que se van a guardar y cargar del localStorage
interface PersistedReceptionData {
    client: Client | null;
    car: ReceptionCar | null;
    checklist: ChecklistItem[];
    serviceAdvisorNotes: string;
    customerNotes: string;
    serviceNotes: string;
    additionalNotes: string;
    carImages: string[];
    isFleet: boolean;
    fleetContactName: string;
    fleetLegalRep: string;
    coneId: string | null;
    vin: string | null;
    vinImageUrl: string | null;
    // NOTA: 'lastCompletedReception' NO se persiste aquí, ya que tiene su propia lógica.
}


// Función para cargar los datos desde localStorage
const loadStateFromLocalStorage = (): PersistedReceptionData | null => {
    if (typeof localStorage === 'undefined') return null; // Prevenir errores en SSR
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData) as PersistedReceptionData;
        }
    } catch (error) {
        console.error('Error al cargar la recepción del localStorage. Limpiando datos corruptos.', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return null;
};

const initialData = loadStateFromLocalStorage();


// La interfaz original que define el tipo de la propiedad lastCompletedReception
// La mantengo fuera del estado persistido ya que tiene su propia lógica de carga/guardado
interface ReceptionState {
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
}
// ====================================================================


export const useReceptionStore = defineStore('reception', () => {

    // ----------------------------------------------------
    // ESTADO (Refs) - Inicializado con datos persistidos
    // ----------------------------------------------------

    const client = ref<Client | null>(initialData?.client || null);
    const car = ref<ReceptionCar | null>(initialData?.car || null);


    const checklist = ref<ChecklistItem[]>(initialData?.checklist || []);
    const commonChecks = ref<string[]>([
        "Motor", "Frenos", "Aceite", "Suspensión", "Llantas", "Luces",
        "AC", "Carrocería", "Interior", "Tacómetro", "Parabrisas", "Radio"
    ]);
    const isFetchingChecks = ref(false); // No necesita persistencia


    const serviceAdvisorNotes = ref(initialData?.serviceAdvisorNotes || '');
    const customerNotes = ref(initialData?.customerNotes || '');
    const serviceNotes = ref(initialData?.serviceNotes || '');
    const additionalNotes = ref(initialData?.additionalNotes || '');


    const carImages = ref<string[]>(initialData?.carImages || []);
    const vin = ref<string | null>(initialData?.vin || null);
    const vinImageUrl = ref<string | null>(initialData?.vinImageUrl || null);
    const coneId = ref<string | null>(initialData?.coneId || null);


    const isFleet = ref(initialData?.isFleet || false);
    const fleetContactName = ref(initialData?.fleetContactName || '');
    const fleetLegalRep = ref(initialData?.fleetLegalRep || '');


    // Esta propiedad mantiene su lógica de carga/guardado independiente (como ya estaba)
    const lastCompletedReception = ref<ReceptionState['lastCompletedReception']>(null); 


    // ----------------------------------------------------
    // GETTERS (Computed)
    // ----------------------------------------------------

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
     * NOTA: Este getter asume que solo muestra la dirección si está disponible en NaturalClient,
     * pero la lógica es extensible para ambos tipos si se desea.
     */
    const clientAddress = computed(() => {
        if (!client.value) return null;
        if ('direccion' in client.value) {
            return client.value.direccion || null;
        }
        return null;
    });

    // ----------------------------------------------------
    // ACCIONES (Funciones)
    // ----------------------------------------------------

    const setPaintDiagram = (imageBase64: ImageBase64 | null) => {
        if (car.value) {
            car.value.paintDiagram = imageBase64;
        }
    };


    const setClient = (newClient: Client) => {
        client.value = newClient;
    };

    const setCar = (newCar: ReceptionCar) => {
        car.value = newCar;
        // Solo inicializamos la checklist si está vacía (si se cargó de persistencia, ya tendrá datos)
        if (checklist.value.length === 0) {
             initializeChecklist();
        }
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
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('lastCompletedReception', JSON.stringify(data));
        }
    };

    const loadLastCompletedReception = () => {
        if (typeof localStorage === 'undefined') return;
        const storedData = localStorage.getItem('lastCompletedReception');
        if (storedData) {
            lastCompletedReception.value = JSON.parse(storedData);
        }
    };

    /**
     * Resetea toda la información de la recepción en progreso y limpia el localStorage.
     */
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
        
        // ** LIMPIAR EL ESTADO PERSISTIDO **
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };


    // ----------------------------------------------------
    // PERSISTENCIA (Watcher)
    // ----------------------------------------------------

    /**
     * Objeto computed que combina todos los 'ref' que queremos persistir.
     */
    const stateToPersist = computed<PersistedReceptionData>(() => ({
        client: client.value,
        car: car.value,
        checklist: checklist.value,
        serviceAdvisorNotes: serviceAdvisorNotes.value,
        customerNotes: customerNotes.value,
        serviceNotes: serviceNotes.value,
        additionalNotes: additionalNotes.value,
        carImages: carImages.value,
        isFleet: isFleet.value,
        fleetContactName: fleetContactName.value,
        fleetLegalRep: fleetLegalRep.value,
        coneId: coneId.value,
        vin: vin.value,
        vinImageUrl: vinImageUrl.value,
    }));


    // Observa el objeto combinado y guarda en localStorage en cada cambio.
    if (typeof watch !== 'undefined') {
         watch(stateToPersist, (newState) => {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
                }
            } catch (error) {
                console.error('Error al guardar la recepción en localStorage:', error);
            }
        }, {
            deep: true, // Crucial para detectar cambios dentro de objetos como 'car' o 'checklist'
            // immediate: true // Opcional: Se puede habilitar si se quiere un guardado inmediato al montar la store
        });
    }

    // ----------------------------------------------------
    // EXPORTACIÓN DEL STORE
    // ----------------------------------------------------

    return {
        // Estado
        client, car, coneId, vin, vinImageUrl,
        checklist, commonChecks, isFetchingChecks,
        serviceAdvisorNotes, customerNotes, serviceNotes, additionalNotes,
        carImages,
        isFleet, fleetContactName, fleetLegalRep,
        lastCompletedReception,

        // Getters
        clientName, clientPhone, clientEmail, clientAddress,

        // Acciones/Mutadores
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