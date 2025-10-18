

export interface NaturalClient {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  direccion?: string;
  rtn?: string;
}

export interface JuridicalClient {
  id: number;
  empresaNombre: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoCorreo: string;
  direccion?: string;
  rtn?: string; 
}
export type Client = NaturalClient | JuridicalClient;


export interface Vehicle {
  id_cliente: number;
  placa: string;
  modelo: string;
  marca: string;
  year: number;
  estilo: string;
  transmision: string;
  traccion: string;
  combustible: string;
  colorPrimario: string;
  colorSecundario: string;
  colorPrimarioNombre: string;
  colorSecundarioNombre: string;
  kilometraje: number;
  porcentajeGasolina: number;
  porcentajeTemperatura: number;
  porcentajeAceite: number;
  numeroChasis: string;
  numeroMotor: string;
  tipoAceite: string;
  marcaFiltroAceite: string;
  activoFlotilla: string;
  aseguradora: {
    nombre: string;
    contacto: string;
    poliza: string;
    nombreAsegurado: string;
    numeroAviso: string;
  };
  paintDiagram?: ImageBase64 | null;
  imageUrl: string;
  vin?: string | null;
}

export type ImageBase64 = string;

export interface ReceptionCar extends Vehicle {}

export type ChecklistStatus = 'ok' | 'problem' | 'missing' | 'exclamation' | null;

export interface ChecklistItem {
  id: number;
  nombre: string;
  estado: ChecklistStatus;
}

export interface ReceptionPart {
  name: string;
  quantity: number;
  price: number;
  customerProvided: boolean;
  partNumber?: string;
  supplier?: string;
  cost?: number;
}

export interface ReceptionJob {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  duration?: string;
  serviceCost: number;
  parts: ReceptionPart[];
  notes?: string;
  mechanic?: string | null;
  isCustomJob: boolean;
}
