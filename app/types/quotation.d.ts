// types/quotation.d.ts

import type { Client, Vehicle } from '~/types/reception';

// 1. Definición para el ítem consolidado (Servicio o Repuesto)
export interface ConsolidatedItem {
    descripcion: string;
    cantidad: number;
    manoDeObra: number;
    valorRepuesto: number;
    codigo: string;
    marca: string;
    condicion: 'Servicio' | 'Nuevo' | 'Usado' | 'Reconstruido';
    priceKey?: string;
}

// 2. Definición para el cliente de la cotización (formato simplificado para display)
export interface QuoteClient {
    id: string;
    name: string;
    email: string;
    phone: string;
    rtn: string;
    direccion: string;
}

// 3. Definición para el vehículo de la cotización (formato simplificado para display)
export interface QuoteVehicle {
    brand: string;
    model: string;
    year: number | string;
    kilometraje: number | string;
    vin: string;
}

// 4. Detalles adicionales de la Orden (la fuente de datos manual)
export interface ManualOrderDetails {
    asesor?: string;
    fechaCreacion?: string;
    vigenciaDias: number;
}

// 5. Interfaz para los totales de la cotización
export interface QuotationTotals {
    subtotal: number;
    tax: number;
    total: number;
    taxRateDisplay: number;
}

// 6. Define el tipo principal de la cotización (el objeto final en la lista)
export interface Quote {
    id: string;
    plate: string;
    status: 'pending' | 'quoted' | 'approved' | 'rejected' | 'expired';
    vehicle: QuoteVehicle;
    client: QuoteClient;
    receptionist: string;
    lastUpdate: string;
    jobs: any[];
    comments: string;
    total: number;
    items: ConsolidatedItem[];
    details: {
        vigenciaDias: number;
        recepcionista: string;
    };
}

// 7. ¡DEFINICIÓN CLAVE PARA EL STORE!
// Refleja la estructura exacta del objeto 'quotationData' guardado en useReceptionStore.
export interface QuotationDataStore {
    id?: string; // <-- AÑADIR ESTA LÍNEA
    client: Client;
    vehicle: Vehicle;
    jobs: any[];
    items: ConsolidatedItem[];
    comments: string;
    taxRate: number;
    totals: QuotationTotals;
    orden: ManualOrderDetails;
}
