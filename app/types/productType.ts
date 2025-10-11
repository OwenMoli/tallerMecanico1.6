// ~/types/productTypes.ts

// Tipo para un ítem de compatibilidad (simplificado)
export interface Compatibility {
    id: number;
    marca: string;
    modelo: string;
    anio: number;
    descripcion: string;
}

// Tipo base para el ítem de inventario
export interface BaseInventoryItem {
    id?: number; // Opcional para nuevos registros
    tipoInventario: 'Producto' | 'Insumo' | 'Servicio';
    esServicio: boolean;
    condicion: 'Nuevo' | 'Usado' | 'Remanufacturado';

    // Propiedad obligatoria en la base, pero puede ser null si es Producto/Insumo
    duracionServicio: number | null;

    generalidades: {
        codigo: string;
        codigoBarra: string;
        descripcion: string;
        referencia: string;
    };
    precios: {
        aplicaImpuesto: boolean;
        editarPrecio: boolean;
        impuesto: string;
        costo1: number; precio1: number; porcentajeUtilidad1: number; precioConImpuesto1: number;
        costo2: number; precio2: number; porcentajeUtilidad2: number;
        costo3: number; precio3: number; porcentajeUtilidad3: number;
        costo4: number; precio4: number; porcentajeUtilidad4: number;
    };
    stock?: {
        existenciasIniciales: number;
    };
    inventario?: {
        almacenId: number | string;
        binId: number | string;
    };
    compatibilidades?: Compatibility[];
    notas: string;
    imagen: string | null;
}

// Interfaz para Productos e Insumos
export interface Product extends BaseInventoryItem {
    esServicio: false;
    tipoInventario: 'Producto' | 'Insumo';
    compatibilidades: Compatibility[];
    stock: { existenciasIniciales: number; };
    inventario: { almacenId: number | string; binId: number | string; };
    duracionServicio: null; // Si es producto, debe ser null
}

// Interfaz para Servicios
export interface Service extends BaseInventoryItem {
    esServicio: true;
    tipoInventario: 'Servicio';
    duracionServicio: number; // Si es servicio, debe ser un número
    stock: never; // No aplica
    inventario: never; // No aplica
    compatibilidades: never; // No aplica
}

// Tipo de unión para el objeto que maneja el formulario
export type InventoryItem = Product | Service;

// 1. Define los tipos (debes tener estos en un archivo de tipos)
interface Generalidades {
    codigo: string | null;
    codigoBarra: string | null;
    descripcion: string;
    referencia: string | null;
}

interface Precios {
    aplicaImpuesto: boolean;
    editarPrecio: boolean;
    impuesto: 'ISV 15%' | 'ISV 18%';
    costo1: number;
    porcentajeUtilidad1: number;
    precio1: number;
    precioConImpuesto1: number; // Asegúrate de que este campo exista
    // ... más precios
}

interface Stock {
    almacenId: number | null | ''; // Permitir '' para el select
    binId: number | null | ''; // Permitir '' para el select
    existenciasIniciales: number;
}

interface ItemState {
    esServicio: boolean;
    condicion: 'Nuevo' | 'Usado';
    tipoInventario: 'Producto' | 'Insumo';
    duracionServicio: number | null;
    generalidades: Generalidades;
    compatibilidades: any[]; // Usar un tipo real
    precios: Precios;
    stock: Stock;
    notas: string;
    imagen: string | null;
}

// 2. Inicializa el estado con el tipo correcto (Nota: esta parte del código es la inicialización del estado en un composable o componente, NO del archivo de tipos)
/*
const state: ItemState = reactive({
    esServicio: false,
    condicion: 'Nuevo',
    tipoInventario: 'Producto',
    duracionServicio: null,
    generalidades: {
        codigo: null,
        codigoBarra: null,
        descripcion: '',
        referencia: null,
    },
    compatibilidades: [],
    precios: {
        aplicaImpuesto: true,
        editarPrecio: false,
        impuesto: 'ISV 15%',
        costo1: 0,
        porcentajeUtilidad1: 0,
        precio1: 0,
        precioConImpuesto1: 0, // ¡Importante!
        // ... inicializar otros precios
    },
    stock: {
        almacenId: '',
        binId: '',
        existenciasIniciales: 0,
    },
    notas: '',
    imagen: null,
});
*/
