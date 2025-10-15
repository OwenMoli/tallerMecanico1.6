

import type { QuoteClient, QuoteVehicle, ConsolidatedItem } from '~/types/quotation';


export type WorkOrderStatus = 'Pendiente' | 'En Progreso' | 'Pausada' | 'Finalizada' | 'Facturada';


export interface WorkOrder {
    id: string;                 
    quotationId: string;       
    status: WorkOrderStatus;  
    client: QuoteClient;    
    vehicle: QuoteVehicle;   
    plate: string;            
    items: ConsolidatedItem[];
    creationDate: string;     
    assignedMechanic?: string;
    total: number;            
    notes?: string;         
}


export interface WorkOrderPdfPayload {
    workOrder: WorkOrder;
  
}
