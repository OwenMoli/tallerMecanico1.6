// /composables/useProductForm.ts

import { reactive, ref, watch, computed, type Ref, type ComputedRef } from 'vue';
import { createBaseState, allTabs, almacenes, bins, vehicleData, type ProductState, type NewBin, type NewCompatibilidadEntry, type Tab, type Bin, type Modelo, type Compatibilidad } from './productFormState';
import { useProductFormActions } from './productFormActions';

export default function useProductForm(initialData: ProductState | null = null) {

    // --- Estado Reactivo ---
    const BASE_STATE = initialData ? JSON.parse(JSON.stringify(initialData)) : createBaseState();
    if (initialData && !BASE_STATE.id) {
        BASE_STATE.id = initialData.id || `temp-${Math.random().toString(36).substring(2, 9)}`;
    }
    const state = reactive<ProductState>(BASE_STATE);
    const errors = reactive<Record<string, string>>({});

    // --- Estado Local del Composable ---
    const selectedTabIndex = ref(0);
    const binsState = ref<Bin[]>(JSON.parse(JSON.stringify(bins))); // Clonar para evitar mutaciones globales
    const lastBinId = ref(301);
    const showBinForm = ref(false);
    const newBin = reactive<NewBin>({ codigo: '', descripcion: '' });
    const lastCompatibilidadId = ref(state.compatibilidades.length > 0 ? Math.max(...state.compatibilidades.map((c: Compatibilidad) => c.id || 0)) : 0);
    const newCompatibilidadEntry = reactive<NewCompatibilidadEntry>({ marcaId: null, modeloId: null, anio: '', descripcion: '' });

    // --- Acciones y Lógica de Negocio (Importadas) ---
    const { calculateAllPrices, calculatePrices, ...actions } = useProductFormActions(
        state, errors, selectedTabIndex, binsState, lastBinId, showBinForm, newBin, lastCompatibilidadId, newCompatibilidadEntry, initialData
    );

    // --- Función de Reseteo ---
    const resetState = (): void => {
        const newState = createBaseState();
        Object.assign(state, newState);
        selectedTabIndex.value = 0;
        Object.keys(errors).forEach(key => delete errors[key]);
        Object.assign(newCompatibilidadEntry, { marcaId: null, modeloId: null, anio: '', descripcion: '' });
        state.generalidades.codigo = `COD-${Math.floor(Math.random() * 90000) + 10000}`;
    };

    // --- Propiedades Computadas ---
    const filteredTabs: ComputedRef<Tab[]> = computed(() => state.esServicio ? allTabs.filter((tab: Tab) => tab.isService) : allTabs.filter((tab: Tab) => tab.isProduct));
    const filteredBins: ComputedRef<Bin[]> = computed(() => binsState.value.filter((bin: Bin) => bin.almacenId === state.inventario.almacenId));
    const filteredModelos: ComputedRef<Modelo[]> = computed(() => !newCompatibilidadEntry.marcaId ? [] : vehicleData.modelos.filter((m: Modelo) => m.marcaId === newCompatibilidadEntry.marcaId));
    const calculateUtilidad = (precioNeto: number | string, costo: number | string): string => {
        const p = parseFloat(String(precioNeto)) || 0;
        const c = parseFloat(String(costo)) || 0;
        return (p - c).toFixed(2);
    };
    const calculatedUtilidad1 = computed(() => calculateUtilidad(state.precios.precio1, state.precios.costo1));
    const calculatedUtilidad2 = computed(() => calculateUtilidad(state.precios.precio2, state.precios.costo1));
    const calculatedUtilidad3 = computed(() => calculateUtilidad(state.precios.precio3, state.precios.costo1));
    const calculatedUtilidad4 = computed(() => calculateUtilidad(state.precios.precio4, state.precios.costo1));

    // --- Watchers (Observadores de Cambios) ---
    watch(() => state.esServicio, (newVal) => {
        const currentTabOriginalIndex = allTabs.findIndex((tab: Tab) => tab.label === filteredTabs.value[selectedTabIndex.value]?.label);
        if (currentTabOriginalIndex === -1 || !filteredTabs.value.some((tab: Tab) => tab.originalIndex === currentTabOriginalIndex)) {
            selectedTabIndex.value = 0;
        }
        if (newVal) {
            state.tipoInventario = 'Servicio';
            state.condicion = 'Nuevo';
            state.duracionServicio = state.duracionServicio || 1.0;
        } else {
            state.tipoInventario = 'Producto';
            state.duracionServicio = null;
        }
        if (!newVal) {
            if (state.condicion === 'Usado') {
                state.precios.aplicaImpuesto = false;
                state.precios.editarPrecio = true;
            } else {
                state.precios.aplicaImpuesto = true;
                state.precios.editarPrecio = true;
            }
        } else {
            state.precios.aplicaImpuesto = true;
            state.precios.editarPrecio = true;
        }
        calculateAllPrices();
    });

    watch(() => state.tipoInventario, (newVal) => {
        if (newVal === 'Servicio') state.esServicio = true;
        if (newVal !== 'Servicio' && state.esServicio) state.esServicio = false;
    });

    watch(() => state.condicion, (newCondicion) => {
        if (newCondicion === 'Usado' && !state.esServicio) {
            state.precios.aplicaImpuesto = false;
            state.precios.editarPrecio = true;
        } else if (!state.esServicio) {
            state.precios.aplicaImpuesto = true;
            state.precios.editarPrecio = true;
        }
        calculateAllPrices();
    });

    watch(() => state.precios.aplicaImpuesto, () => {
        calculatePrices(1, 'precio');
        if (!state.precios.aplicaImpuesto) {
            state.precios.precio1 = parseFloat(String(state.precios.precioConImpuesto1));
            calculatePrices(1, 'precio');
        }
    });

    watch(() => state.inventario.almacenId, () => {
        state.inventario.binId = '';
        showBinForm.value = false;
    });

    watch(() => newCompatibilidadEntry.marcaId, (newId, oldId) => {
        if (newId !== oldId) newCompatibilidadEntry.modeloId = null;
    });

    // Watchers para limpiar errores
    watch(() => state.generalidades.descripcion, () => { if (errors.descripcion) delete errors.descripcion; });
    watch(() => state.precios.costo1, () => { if (errors.costo1) delete errors.costo1; });
    watch(() => state.precios.porcentajeUtilidad1, () => { if (errors.porcentajeUtilidad1) delete errors.porcentajeUtilidad1; });
    watch(() => state.duracionServicio, () => { if (errors.duracionServicio) delete errors.duracionServicio; });
    watch(() => state.stock.existenciasIniciales, () => { if (errors.existenciasIniciales) delete errors.existenciasIniciales; });
    watch(() => state.inventario.almacenId, () => { if (errors.almacenId) delete errors.almacenId; });

    // ✅ **INICIO DE LA CORRECCIÓN**
    // Este watcher es crucial. Observa la prop 'initialData' que viene del componente padre.
    watch(() => initialData, (newData) => {
        // Si llegan nuevos datos (es decir, el usuario hizo clic en 'Editar')
        if (newData) {
            console.log("Watcher: Se detectaron nuevos datos iniciales. Actualizando el estado del formulario.", newData);
            // Hacemos una copia profunda para evitar que los cambios en el formulario
            // afecten directamente a la tabla antes de guardar.
            const newState = JSON.parse(JSON.stringify(newData));
            // Reemplazamos el estado interno del formulario con los nuevos datos.
            Object.assign(state, newState);
            // Recalculamos todos los precios con los datos cargados.
            calculateAllPrices();
        } else {
            // Si no llegan datos (ej. al abrir el formulario para crear uno nuevo),
            // se resetea a su estado inicial vacío.
            console.log("Watcher: No se recibieron datos iniciales. Reseteando el formulario.");
            resetState();
        }
    }, {
        // 'deep: true' es importante para que el watcher detecte cambios
        // dentro del objeto 'initialData', no solo si el objeto en sí es reemplazado.
        deep: true
    });
    // ✅ **FIN DE LA CORRECCIÓN**

    // --- Inicialización ---
    calculateAllPrices();

    // --- Retorno del Composable ---
    return {
        state,
        errors,
        selectedTabIndex,
        showBinForm,
        newBin,
        newCompatibilidadEntry,
        almacenes,
        bins: binsState,
        vehicleData,
        filteredModelos,
        filteredTabs,
        filteredBins,
        calculatedUtilidad1,
        calculatedUtilidad2,
        calculatedUtilidad3,
        calculatedUtilidad4,
        resetState,
        calculatePrices,
        calculateAllPrices,
        ...actions
    };
}
