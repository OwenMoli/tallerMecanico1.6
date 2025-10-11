import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export type StatusVisibility = 'visible' | 'hidden'

export interface ProductCategory {
  uuid: string
  id: string
  description: string
  order: number
  status: StatusVisibility
}



export interface FormState<T> {
  state: {
    data: T
  }
}

// types/stores.d.ts

interface NaturalClient {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
}

interface JuridicalClient {
  id: number;
  empresaNombre: string;
  contactoTelefono: string;
}

interface Car {
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
  imageUrl: string;
}

// Exporta los tipos para que puedan ser usados en el store
export type Client = NaturalClient | JuridicalClient;
export type ReceptionCar = Car;
