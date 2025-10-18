// src/services/apiService.ts

import { ref, watch } from 'vue';
import type { Ref } from 'vue';


const createCrudService = <T extends { ID: number }>(storageKey: string, initialData: T[]) => {


    const data: Ref<T[]> = ref([]);


    const load = () => {
        try {
            const stored = localStorage.getItem(storageKey);
            data.value = stored ? JSON.parse(stored) : initialData;
        } catch (e) {
            console.error(`Error al cargar ${storageKey}`, e);
            data.value = initialData;
        }
    };

    watch(data, (newData) => {
        localStorage.setItem(storageKey, JSON.stringify(newData));
    }, { deep: true });

    load();

    const getAll = async (): Promise<T[]> => {

        await new Promise(res => setTimeout(res, 100));
        return data.value;
    };

    const create = async (newItem: Omit<T, 'ID'>): Promise<T> => {
        await new Promise(res => setTimeout(res, 100));
        const nextId = data.value.length > 0 ? Math.max(...data.value.map(d => d.ID)) + 1 : 1;
        const finalItem = { ...newItem, ID: nextId } as T;
        data.value.push(finalItem);
        return finalItem;
    };

    const update = async (updatedItem: T): Promise<T> => {
        await new Promise(res => setTimeout(res, 100));
        const index = data.value.findIndex(item => item.ID === updatedItem.ID);
        if (index !== -1) {
            data.value[index] = updatedItem;
            return updatedItem;
        }
        throw new Error("Item no encontrado");
    };

    return {
        getAll,
        create,
        update,
    };
};



export interface Marca {
    ID: number;
    Nombre: string;
    EsActivo: boolean;
}
const initialMarcas: Marca[] = [
    { ID: 1, Nombre: 'Toyota', EsActivo: true },
    { ID: 2, Nombre: 'Honda', EsActivo: false },
];

export interface Estilo {
    ID: number;
    Nombre: string;
    EsActivo: boolean;
}
const initialEstilos: Estilo[] = [
    { ID: 1, Nombre: 'Sedán', EsActivo: true },
    { ID: 2, Nombre: 'SUV', EsActivo: true },
];

export interface Modelo {
    ID: number;
    Nombre: string;
    Año: number;
    MarcaID: number;
    EstiloID: number;
    EsActivo: boolean;
}

const initialModelos: Modelo[] = [
    { ID: 1, Nombre: 'Corolla', Año: 2023, MarcaID: 1, EstiloID: 1, EsActivo: true },
    { ID: 2, Nombre: 'Hilux', Año: 2024, MarcaID: 1, EstiloID: 2, EsActivo: true }, // Asumiendo EstiloID 2 es Pickup
    { ID: 3, Nombre: 'Civic', Año: 2022, MarcaID: 2, EstiloID: 1, EsActivo: true },
    { ID: 4, Nombre: 'CR-V', Año: 2023, MarcaID: 2, EstiloID: 2, EsActivo: false },
];

export interface Proveedor {
    ID: number; // Estandarizamos el campo a 'ID' para consistencia
    NombreProveedor: string;
    NombreContacto: string;
    Telefono: string;
    CorreoElectronico: string;
    Direccion: string;
    Ciudad: string;
    Pais: string;
    RTN: string;
    TipoProveedor: string;
    EsActivo: boolean;
}



const initialProveedores: Proveedor[] = [
    { ID: 1, NombreProveedor: 'AutoPartes S.A.', NombreContacto: 'Ana Garcia', Telefono: '9988-7766', CorreoElectronico: 'ana@autopartes.com', Direccion: 'Calle 10', Ciudad: 'Tegucigalpa', Pais: 'Honduras', RTN: '08011985123456', TipoProveedor: 'Repuestos', EsActivo: true },
    { ID: 2, NombreProveedor: 'Lubricantes del Atlantico', NombreContacto: 'Juan Perez', Telefono: '8877-6655', CorreoElectronico: 'juan@lubricantes.com', Direccion: 'Ave. Los Pinos', Ciudad: 'San Pedro Sula', Pais: 'Honduras', RTN: '08011990987654', TipoProveedor: 'Lubricantes', EsActivo: true },
    { ID: 3, NombreProveedor: 'Servicios de Taller Express', NombreContacto: 'Carlos Lopez', Telefono: '9988-5544', CorreoElectronico: 'carlos@tallerxpress.com', Direccion: 'Calle Principal', Ciudad: 'San Pedro Sula', Pais: 'Honduras', RTN: '08011995040506', TipoProveedor: 'Servicios externos', EsActivo: false },
];


export interface TipoMotor {
    ID: number;
    Nombre: string;
    EsActivo: boolean;
}

const initialTiposMotor: TipoMotor[] = [
    { ID: 1, Nombre: 'Gasolina', EsActivo: true },
    { ID: 2, Nombre: 'Diésel', EsActivo: true },
    { ID: 3, Nombre: 'Eléctrico', EsActivo: true },
    { ID: 4, Nombre: 'Híbrido', EsActivo: false },
];

export interface TipoCombustible {
    ID: number;
    Nombre: string;
    EsActivo: boolean;
}

const initialTiposCombustible: TipoCombustible[] = [
    { ID: 1, Nombre: 'Gasolina Regular', EsActivo: true },
    { ID: 2, Nombre: 'Gasolina Superior', EsActivo: true },
    { ID: 3, Nombre: 'Diésel', EsActivo: true },
    { ID: 4, Nombre: 'GLP', EsActivo: false },
];

export interface Mecanico {
    ID: number;
    Nombres: string;
    Apellidos: string;
    Especialidad: string;
    NumeroIdentidad: string;
    Telefono: string;
    CorreoElectronico: string;
    FechaContratacion: Date;
    EsActivo: boolean;
}

const initialMecanicos: Mecanico[] = [
    { ID: 1, Nombres: 'Carlos Alberto', Apellidos: 'Rivera', Especialidad: 'Frenos', NumeroIdentidad: '0801199012345', Telefono: '9876-5432', CorreoElectronico: 'carlos.rivera@taller.com', FechaContratacion: new Date('2022-01-15'), EsActivo: true },
    { ID: 2, Nombres: 'Lucía Fernanda', Apellidos: 'Mendoza', Especialidad: 'Motor', NumeroIdentidad: '0502199500432', Telefono: '3322-1100', CorreoElectronico: 'lucia.mendoza@taller.com', FechaContratacion: new Date('2021-07-20'), EsActivo: true },
    { ID: 3, Nombres: 'Jorge Luis', Apellidos: 'Pineda', Especialidad: 'Transmisión', NumeroIdentidad: '0801198801122', Telefono: '8877-6655', CorreoElectronico: 'jorge.pineda@taller.com', FechaContratacion: new Date('2023-03-10'), EsActivo: false },
];

export interface ClienteNatural {
    ID: number;
    nombre: string;
    apellido: string;
    tipoDocumento: string;
    numeroIdentificacion: string;
    rtn: string;
    telefono: string;
    correo: string;
    direccion: string;
    sexo: string;
    EsActivo: boolean;
}


export interface ClienteJuridico {
    ID: number;
    empresaNombre: string;
    empresaRubro: string;
    empresaRtn: string;
    empresaDireccion: string;
    contactoNombre: string;
    contactoApellido: string;
    contactoCargo: string;
    contactoTelefono: string;
    contactoCorreo: string;
    contactoDireccion: string;
    EsActivo: boolean;
}


const initialNaturales: ClienteNatural[] = [
    { ID: 1, nombre: "Juan", apellido: "Perez", tipoDocumento: "Cédula", numeroIdentificacion: "0801-1990-12345", rtn: "08011990123456", telefono: "9988-7766", correo: "juan.perez@email.com", direccion: "Col. Universitaria", sexo: "M", EsActivo: true },
    { ID: 2, nombre: "Maria", apellido: "Lopez", tipoDocumento: "Cédula", numeroIdentificacion: "0501-1985-00123", rtn: "05011985001234", telefono: "8877-6655", correo: "maria.lopez@email.com", direccion: "Bo. El Centro", sexo: "F", EsActivo: false },
];

const initialJuridicos: ClienteJuridico[] = [
    { ID: 1, empresaNombre: "Comercial Moli", empresaRubro: "Retail", empresaRtn: "08019012345678", empresaDireccion: "Blvd. Morazán", contactoNombre: "Owen", contactoApellido: "Molina", contactoCargo: "Gerente", contactoTelefono: "2233-4455", contactoCorreo: "owen@comercialmoli.com", contactoDireccion: "Res. Las Hadas", EsActivo: true },
];


export const clienteNaturalService = createCrudService<ClienteNatural>('clientes_naturales_data', initialNaturales);
export const clienteJuridicoService = createCrudService<ClienteJuridico>('clientes_juridicos_data', initialJuridicos);
export const mecanicoService = createCrudService<Mecanico>('mecanicos_data', initialMecanicos);
export const tipoCombustibleService = createCrudService<TipoCombustible>('tipos_combustible_data', initialTiposCombustible);
export const tipoMotorService = createCrudService<TipoMotor>('tipos_motor_data', initialTiposMotor);
export const proveedorService = createCrudService<Proveedor>('proveedores_data', initialProveedores);
export const marcaService = createCrudService<Marca>('marcas_data', initialMarcas);
export const estiloService = createCrudService<Estilo>('estilos_data', initialEstilos);
export const modeloService = createCrudService<Modelo>('modelos_data', initialModelos);

