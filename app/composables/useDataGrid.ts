// src/composables/useDataGrid.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export interface GridItem {
  EsActivo: boolean;
  [key: string]: any;
}

export function useDataGrid<T extends GridItem>(initialData: T[], keyField: keyof T) {
  // Simplificamos la declaración de la Ref
  const data = ref(initialData) as Ref<T[]>;
  const showAll = ref(false);

  const currentDataSource = computed<T[]>(() => {
    return showAll.value ? data.value : data.value.filter(item => item.EsActivo);
  });

  const refreshData = (newData: T[]) => {
    data.value = [...newData];
  };

  const addItem = (item: T) => {
    const nextId = data.value.length > 0
      ? Math.max(...data.value.map(d => (d as any)[keyField] as number || 0)) + 1
      : 1;
    const newItem = { ...item, [keyField]: nextId, EsActivo: true } as T;
    data.value.push(newItem);
    refreshData(data.value);
  };

  const updateItem = (updatedItem: T) => {
    data.value = data.value.map(item =>
      (item as any)[keyField] === (updatedItem as any)[keyField] ? updatedItem : item
    );
  };

  const softDeleteItem = (itemData: T) => {
    data.value = data.value.map(item => {
      if ((item as any)[keyField] === (itemData as any)[keyField]) {
        return { ...item, EsActivo: false };
      }
      return item;
    });
  };

  const activateItem = (itemData: T) => {
    data.value = data.value.map(item => {
      if ((item as any)[keyField] === (itemData as any)[keyField]) {
        return { ...item, EsActivo: true };
      }
      return item;
    });
  };

  return {
    data,
    showAll,
    currentDataSource,
    refreshData,
    addItem,
    updateItem,
    softDeleteItem,
    activateItem,
  };
}
