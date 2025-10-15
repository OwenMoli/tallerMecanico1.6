

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
    { ID: 2, Nombre: 'Hilux', Año: 2024, MarcaID: 1, EstiloID: 2, EsActivo: true }, 
    { ID: 3, Nombre: 'Civic', Año: 2022, MarcaID: 2, EstiloID: 1, EsActivo: true },
    { ID: 4, Nombre: 'CR-V', Año: 2023, MarcaID: 2, EstiloID: 2, EsActivo: false },
];



export const marcaService = createCrudService<Marca>('marcas_data', initialMarcas);
export const estiloService = createCrudService<Estilo>('estilos_data', initialEstilos);
export const modeloService = createCrudService<Modelo>('modelos_data', initialModelos);

