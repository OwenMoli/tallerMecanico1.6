
export interface Marca { id: number; nombre: string; }
export interface Modelo { id: number; marcaId: number; nombre: string; }
export interface VehicleData { marcas: Marca[]; modelos: Modelo[]; }
export interface Tab { label: string; originalIndex: number; isProduct: boolean; isService: boolean; }
export interface Almacen { id: number; nombre: string; }
export interface Bin { id: number; codigo: string; descripcion: string; almacenId: number;  }
export interface Compatibilidad { id: number; marca: string; modelo: string; anio: number; descripcion: string; esActivo?: boolean; }
export interface GeneralidadesState { codigo: string; codigoBarra: string; nombre: string; descripcion: string; referencia: string; tipoProducto: 'Producto' | 'Insumo' | 'Servicio'; }
export interface PreciosState { aplicaImpuesto: boolean; editarPrecio: boolean; impuesto: 'ISV 15%' | 'ISV 18%'; costo1: number; precio1: number; porcentajeUtilidad1: number; precioConImpuesto1: number; costo2: number; precio2: number; porcentajeUtilidad2: number; costo3: number; precio3: number; porcentajeUtilidad3: number; costo4: number; precio4: number; porcentajeUtilidad4: number; precioVentaNeto: number; precioVentaConImpuesto: number; }
export interface ProductState { id: number | string | null; esServicio: boolean; condicion: 'Nuevo' | 'Usado'; duracionServicio: number | null; tipoInventario?: 'Producto' | 'Insumo' | 'Servicio'; generalidades: GeneralidadesState; compatibilidades: Compatibilidad[]; precios: PreciosState; stock: { existenciasIniciales: number }; inventario: { almacenId: number | ''; binId: number | '' }; notas: string; imagen: string | null; }
export interface NewCompatibilidadEntry { marcaId: number | null; modeloId: number | null; anio: string; descripcion: string; }
export interface NewBin { codigo: string; descripcion: string; }


// --- Datos Estáticos ---
export const vehicleData: VehicleData = {
    marcas: [ { id: 1, nombre: 'Toyota' }, { id: 2, nombre: 'Honda' }, { id: 3, nombre: 'Ford' }, { id: 4, nombre: 'Chevrolet' }, { id: 5, nombre: 'BMW' } ],
    modelos: [ { id: 101, marcaId: 1, nombre: 'Corolla' }, { id: 102, marcaId: 1, nombre: 'Hilux' }, { id: 103, marcaId: 1, nombre: 'RAV4' }, { id: 201, marcaId: 2, nombre: 'Civic' }, { id: 202, marcaId: 2, nombre: 'CR-V' }, { id: 203, marcaId: 2, nombre: 'Pilot' }, { id: 301, marcaId: 3, nombre: 'F-150' }, { id: 302, marcaId: 3, nombre: 'Ranger' }, { id: 303, marcaId: 3, nombre: 'Explorer' }, { id: 401, marcaId: 4, nombre: 'Silverado' }, { id: 402, marcaId: 4, nombre: 'Spark' }, { id: 501, marcaId: 5, nombre: 'Serie 3' }, { id: 502, marcaId: 5, nombre: 'X5' } ],
};
export const allTabs: Tab[] = [ { label: 'Generalidades del Producto', originalIndex: 0, isProduct: true, isService: true }, { label: 'Compatibilidad de Vehículos', originalIndex: 1, isProduct: true, isService: false }, { label: 'Configuración de Precios', originalIndex: 2, isProduct: true, isService: true }, { label: 'Inventario', originalIndex: 3, isProduct: true, isService: false }, { label: 'Notas', originalIndex: 4, isProduct: true, isService: true }, { label: 'Imagen', originalIndex: 5, isProduct: true, isService: true } ];
export const almacenes: Almacen[] = [ { id: 1, nombre: 'Almacén Principal' }, { id: 2, nombre: 'Almacén Secundario' }, { id: 3, nombre: 'Almacén de Repuestos' } ];
export const bins: Bin[] = [ { id: 101, codigo: 'A01', descripcion: 'Estantería 1, Pasillo A', almacenId: 1 }, { id: 102, codigo: 'A02', descripcion: 'Estantería 2, Pasillo A', almacenId: 1 }, { id: 201, codigo: 'B01', descripcion: 'Estantería 1, Pasillo B', almacenId: 2 }, { id: 301, codigo: 'C01', descripcion: 'Estantería 1, Pasillo C', almacenId: 3 } ];


export const createBaseState = (): ProductState => ({
    id: null,
    esServicio: false,
    condicion: 'Nuevo',
    duracionServicio: null,
    generalidades: { codigo: `COD-${Math.floor(Math.random() * 90000) + 10000}`, codigoBarra: '', nombre: '', descripcion: '', referencia: '', tipoProducto: 'Producto' },
    compatibilidades: [],
    precios: { aplicaImpuesto: true, editarPrecio: true, impuesto: 'ISV 15%', costo1: 0.00, precio1: 0.00, porcentajeUtilidad1: 0, precioConImpuesto1: 0.00, costo2: 0.00, precio2: 0.00, porcentajeUtilidad2: 0, costo3: 0.00, precio3: 0.00, porcentajeUtilidad3: 0, costo4: 0.00, precio4: 0.00, porcentajeUtilidad4: 0, precioVentaNeto: 0.00, precioVentaConImpuesto: 0.00, },
    stock: { existenciasIniciales: 0 },
    inventario: { almacenId: '', binId: '' },
    notas: '',
    imagen: null,
});
