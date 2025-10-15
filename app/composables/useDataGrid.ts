// src/composables/useDataGrid.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import notify from 'devextreme/ui/notify';

// Interfaz para que el servicio sea genérico
interface CrudService<T> {
    getAll: () => Promise<T[]>;
    create: (item: any) => Promise<T>;
    update: (item: T) => Promise<T>;
}

export interface GridItem {
    ID: number;
    EsActivo: boolean;
    [key: string]: any;
}

export function useDataGrid<T extends GridItem>(service: CrudService<T>) {

    const data: Ref<T[]> = ref([]);
    const showAll = ref(false);

    const currentDataSource = computed(() => {
        return showAll.value ? data.value : data.value.filter(item => item.EsActivo);
    });


    const fetchData = async () => {
        try {
            data.value = await service.getAll();
        } catch (e) {
            notify("Error al cargar los datos", "error", 2000);
        }
    };

    const addItem = async (item: Omit<T, 'ID' | 'EsActivo'>) => {
        const newItem = { ...item, EsActivo: true };
        await service.create(newItem);
        await fetchData(); 
    };

    const updateItem = async (item: T) => {
        await service.update(item);
        await fetchData();
    };

    const softDeleteItem = async (item: T) => {
        const deactivatedItem = { ...item, EsActivo: false };
        await service.update(deactivatedItem);
        await fetchData();
    };

    const activateItem = async (item: T) => {
        const activatedItem = { ...item, EsActivo: true };
        await service.update(activatedItem);
        await fetchData();
    };

    return {
        currentDataSource,
        showAll,
        fetchData,
        addItem,
        updateItem,
        softDeleteItem,
        activateItem,
    };
}
