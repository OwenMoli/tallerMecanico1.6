// composables/useProductForm.js

import { reactive, ref, watch, computed } from 'vue';

// --- Datos Estáticos (fuera de la función para que no se re-creen) ---
const vehicleData = {
    marcas: [
        { id: 1, nombre: 'Toyota' },
        { id: 2, nombre: 'Honda' },
        { id: 3, nombre: 'Ford' },
        { id: 4, nombre: 'Chevrolet' },
        { id: 5, nombre: 'BMW' },
    ],
    modelos: [
        { id: 101, marcaId: 1, nombre: 'Corolla' }, { id: 102, marcaId: 1, nombre: 'Hilux' }, { id: 103, marcaId: 1, nombre: 'RAV4' },
        { id: 201, marcaId: 2, nombre: 'Civic' }, { id: 202, marcaId: 2, nombre: 'CR-V' }, { id: 203, marcaId: 2, nombre: 'Pilot' },
        { id: 301, marcaId: 3, nombre: 'F-150' }, { id: 302, marcaId: 3, nombre: 'Ranger' }, { id: 303, marcaId: 3, nombre: 'Explorer' },
        { id: 401, marcaId: 4, nombre: 'Silverado' }, { id: 402, marcaId: 4, nombre: 'Spark' },
        { id: 501, marcaId: 5, nombre: 'Serie 3' }, { id: 502, marcaId: 5, nombre: 'X5' },
    ],
};

const allTabs = [
    { label: 'Generalidades del Producto', originalIndex: 0, isProduct: true, isService: true },
    { label: 'Compatibilidad de Vehículos', originalIndex: 1, isProduct: true, isService: false },
    { label: 'Configuración de Precios', originalIndex: 2, isProduct: true, isService: true },
    { label: 'Inventario', originalIndex: 3, isProduct: true, isService: false },
    { label: 'Notas', originalIndex: 4, isProduct: true, isService: true },
    { label: 'Imagen', originalIndex: 5, isProduct: true, isService: true }
];

const almacenes = [
    { id: 1, nombre: 'Almacén Principal' },
    { id: 2, nombre: 'Almacén Secundario' },
    { id: 3, nombre: 'Almacén de Repuestos' },
];

const bins = [
    { id: 101, codigo: 'A01', descripcion: 'Estantería 1, Pasillo A', almacenId: 1 },
    { id: 102, codigo: 'A02', descripcion: 'Estantería 2, Pasillo A', almacenId: 1 },
    { id: 201, codigo: 'B01', descripcion: 'Estantería 1, Pasillo B', almacenId: 2 },
    { id: 301, codigo: 'C01', descripcion: 'Estantería 1, Pasillo C', almacenId: 3 },
];

// Helper para crear el estado base
const createBaseState = () => ({
    tipoInventario: 'Producto',
    esServicio: false,
    condicion: 'Nuevo',
    duracionServicio: null,
    generalidades: {
        codigo: `COD-${Math.floor(Math.random() * 90000) + 10000}`,
        codigoBarra: '',
        descripcion: '',
        referencia: '',
    },
    compatibilidades: [],
    precios: {
        aplicaImpuesto: true,
        editarPrecio: true,
        impuesto: 'ISV 15%',
        // Estos campos se guardan automáticamente por el deep clone, pero son la fuente de datos:
        costo1: 0.00, precio1: 0.00, porcentajeUtilidad1: 0, precioConImpuesto1: 0.00,
        costo2: 0.00, precio2: 0.00, porcentajeUtilidad2: 0,
        costo3: 0.00, precio3: 0.00, porcentajeUtilidad3: 0,
        costo4: 0.00, precio4: 0.00, porcentajeUtilidad4: 0,
    },
    stock: { existenciasIniciales: 0 },
    inventario: { almacenId: '', binId: '' },
    notas: '',
    imagen: null,
});

// Función principal del Composable
export default function useProductForm(initialData = null) {

    // 🔑 CONSTANTE PARA EL ESTADO BASE
    const BASE_STATE = initialData ? JSON.parse(JSON.stringify(initialData)) : createBaseState();

    // 🔑 Inicialización del Estado
    const state = reactive(BASE_STATE);

    // ESTADO DE ERRORES (SIMULANDO vee-validate)
    const errors = reactive({});


    // Estado Local
    const selectedTabIndex = ref(0);
    // Para bins, necesitamos un ref para poder modificarlo (al agregar uno nuevo)
    const binsState = ref(bins);
    const lastBinId = ref(301);
    const showBinForm = ref(false);
    const newBin = reactive({ codigo: '', descripcion: '' });
    const lastCompatibilidadId = ref(state.compatibilidades.length > 0 ? Math.max(...state.compatibilidades.map(c => c.id)) : 0);
    const newCompatibilidadEntry = reactive({ marcaId: null, modeloId: null, anio: '', descripcion: '' });

    // 🔑 FUNCIÓN DE RESETEO AÑADIDA
    const resetState = () => {
        // Reiniciar el estado a su valor base, manteniendo la reactividad
        Object.assign(state, createBaseState());
        // Reiniciar estados locales
        selectedTabIndex.value = 0;
        Object.keys(errors).forEach(key => delete errors[key]);
        Object.assign(newCompatibilidadEntry, { marcaId: null, modeloId: null, anio: '', descripcion: '' });
    };

    // --- Propiedades Computadas ---

    const filteredTabs = computed(() => {
        return state.esServicio
            ? allTabs.filter(tab => tab.isService)
            : allTabs.filter(tab => tab.isProduct);
    });

    const filteredBins = computed(() => {
        return binsState.value.filter(bin => bin.almacenId === state.inventario.almacenId);
    });

    const filteredModelos = computed(() => {
        if (!newCompatibilidadEntry.marcaId) return [];
        return vehicleData.modelos.filter(m => m.marcaId === newCompatibilidadEntry.marcaId);
    });

    const calculateUtilidad = (precioNeto, costo) => {
        const p = parseFloat(precioNeto) || 0;
        const c = parseFloat(costo) || 0;
        return (p - c).toFixed(2);
    };

    const calculatedUtilidad1 = computed(() => calculateUtilidad(state.precios.precio1, state.precios.costo1));
    const calculatedUtilidad2 = computed(() => calculateUtilidad(state.precios.precio2, state.precios.costo1));
    const calculatedUtilidad3 = computed(() => calculateUtilidad(state.precios.precio3, state.precios.costo1));
    const calculatedUtilidad4 = computed(() => calculateUtilidad(state.precios.precio4, state.precios.costo1));


    // --- Métodos de Precios ---

    const getImpuestoRate = () => {
        return state.precios.impuesto === 'ISV 15%' ? 0.15 : 0.18;
    };

    // Calcula el Precio CON Impuesto
    const calculatePriceWithTax = (priceNumber = 1) => {
        if (priceNumber !== 1) return;

        const precioNeto = parseFloat(state.precios.precio1) || 0;

        if (state.precios.aplicaImpuesto) {
            const impuestoRate = getImpuestoRate();
            state.precios.precioConImpuesto1 = precioNeto * (1 + impuestoRate);
        } else {
            state.precios.precioConImpuesto1 = precioNeto;
        }
        // Fix: Asegurarse de que el valor final sea un Number
        state.precios.precioConImpuesto1 = Number(parseFloat(state.precios.precioConImpuesto1).toFixed(2)); // <-- CONVERTIDO A NUMBER
    };

    // Maneja la entrada directa en el campo Precio CON Impuesto
    const handlePrice1Input = (event) => {
        const inputPrice = parseFloat(event.target.value) || 0;

        if (state.precios.aplicaImpuesto) {
            const impuestoRate = getImpuestoRate();
            const precioNeto = inputPrice / (1 + impuestoRate);
            state.precios.precio1 = Number(parseFloat(precioNeto).toFixed(2)); // <-- CONVERTIDO A NUMBER
            state.precios.precioConImpuesto1 = Number(parseFloat(inputPrice).toFixed(2)); // <-- CONVERTIDO A NUMBER
        } else {
            state.precios.precio1 = Number(parseFloat(inputPrice).toFixed(2)); // <-- CONVERTIDO A NUMBER
            state.precios.precioConImpuesto1 = Number(parseFloat(inputPrice).toFixed(2)); // <-- CONVERTIDO A NUMBER
        }

        calculatePrices(1, 'precio');
    }

    const calculatePorcentajeUtilidad = (precioNeto, costo) => {
        const p = parseFloat(precioNeto) || 0;
        const c = parseFloat(costo) || 0;
        if (c > 0) return ((p - c) / c * 100).toFixed(2);
        return (p > 0 && c === 0) ? '100.00' : '0.00';
    };

    // Función principal de cálculo de precios (Neto, Utilidad %, Utilidad)
    const calculatePrices = (priceNumber, type = 'precio') => {
        let costo = parseFloat(state.precios[`costo${priceNumber}`]) || 0;

        // Precios 2, 3, 4 usan el costo del Precio 1
        if (priceNumber > 1) {
            costo = parseFloat(state.precios.costo1) || 0;
            state.precios[`costo${priceNumber}`] = costo; // Sincroniza el costo en los demás
        }

        let precio = parseFloat(state.precios[`precio${priceNumber}`]) || 0;
        let porcentaje = parseFloat(state.precios[`porcentajeUtilidad${priceNumber}`]) || 0;

        if (type === 'precio') {
            const newPorcentaje = calculatePorcentajeUtilidad(precio, costo);
            // Fix: Asegurar que el porcentaje sea un Number
            state.precios[`porcentajeUtilidad${priceNumber}`] = parseFloat(newPorcentaje); // <-- CONVERTIDO A NUMBER
        }
        else if (type === 'porcentaje') {
            precio = costo * (1 + (porcentaje / 100));
            // Fix: Asegurar que el precio sea un Number
            state.precios[`precio${priceNumber}`] = Number(parseFloat(precio).toFixed(2)); // <-- CONVERTIDO A NUMBER
        }
        else if (type === 'costo') {
            // El costo solo afecta los cálculos para el Precio 1 directamente
            if (priceNumber === 1) {
                precio = costo * (1 + (porcentaje / 100));
                // Fix: Asegurar que el precio sea un Number
                state.precios[`precio${priceNumber}`] = Number(parseFloat(precio).toFixed(2)); // <-- CONVERTIDO A NUMBER
                const newPorcentaje = calculatePorcentajeUtilidad(state.precios.precio1, costo);
                // Fix: Asegurar que el porcentaje sea un Number
                state.precios[`porcentajeUtilidad${priceNumber}`] = parseFloat(newPorcentaje); // <-- CONVERTIDO A NUMBER
            }
        }

        if (priceNumber === 1) {
            calculatePriceWithTax(); // Recalcula el precio CON impuesto
            // Propaga cambios de costo a los demás precios
            if (type === 'costo') {
                for(let i = 2; i <= 4; i++) {
                    calculatePrices(i, 'porcentaje');
                }
            }
        }
    };

    const calculateAllPrices = () => {
        calculatePrices(1, 'costo');
        for(let i = 2; i <= 4; i++) {
            calculatePrices(i, 'porcentaje');
        }
    };


    // --- Watchers ---

    watch(() => state.esServicio, (newVal) => {
        // Lógica de cambio de tab
        const currentTabOriginalIndex = allTabs.findIndex(tab => tab.label === filteredTabs.value[selectedTabIndex.value]?.label);
        if (currentTabOriginalIndex === -1 || !filteredTabs.value.some(tab => tab.originalIndex === currentTabOriginalIndex)) {
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

        // LÓGICA MODIFICADA AQUÍ:
        if (!newVal) {
             if (state.condicion === 'Usado') {
                 // Dejamos aplicaImpuesto bloqueado para USADO
                 state.precios.aplicaImpuesto = false;
                 // REQUISITO CUMPLIDO: Permitir editar precio aunque sea usado
                 state.precios.editarPrecio = true;
             } else {
                 state.precios.aplicaImpuesto = true;
                 state.precios.editarPrecio = true;
             }
        } else {
             // Si es servicio, siempre se puede editar y aplica impuesto
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
        // LÓGICA MODIFICADA AQUÍ:
        if (newCondicion === 'Usado' && !state.esServicio) {
            // Dejamos aplicaImpuesto bloqueado para USADO
            state.precios.aplicaImpuesto = false;
            // Permitir editar precio (y por lo tanto costo) aunque sea usado
            state.precios.editarPrecio = true;
        } else if (!state.esServicio) {
            state.precios.aplicaImpuesto = true;
            state.precios.editarPrecio = true;
        }
        calculateAllPrices();
    });

    watch(() => state.precios.aplicaImpuesto, () => {
        calculatePriceWithTax();
        if (!state.precios.aplicaImpuesto) {
             // Al desactivar impuesto, el precio con impuesto se vuelve el precio neto
             state.precios.precio1 = parseFloat(state.precios.precioConImpuesto1);
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

    // Watchers para limpiar errores al interactuar
    watch(() => state.generalidades.descripcion, () => { if (errors.descripcion) delete errors.descripcion; });
    watch(() => state.precios.costo1, () => { if (errors.costo1) delete errors.costo1; });
    watch(() => state.precios.porcentajeUtilidad1, () => { if (errors.porcentajeUtilidad1) delete errors.porcentajeUtilidad1; });
    watch(() => state.duracionServicio, () => { if (errors.duracionServicio) delete errors.duracionServicio; });
    watch(() => state.stock.existenciasIniciales, () => { if (errors.existenciasIniciales) delete errors.existenciasIniciales; });
    watch(() => state.inventario.almacenId, () => { if (errors.almacenId) delete errors.almacenId; });


    // --- Métodos de Utilidad/CRUD ---

    // Lógica de Bin
    const toggleBinForm = () => {
        showBinForm.value = !showBinForm.value;
        newBin.codigo = '';
        newBin.descripcion = '';
    };

    const createBin = () => {
        if (!newBin.codigo || !newBin.descripcion || !state.inventario.almacenId) {
            alert('Por favor, complete todos los campos de la nueva estantería y seleccione un almacén.');
            return;
        }

        const newId = ++lastBinId.value;
        // Usamos .value para modificar la lista reactiva de bins
        binsState.value.push({
            id: newId,
            ...newBin,
            almacenId: state.inventario.almacenId
        });
        state.inventario.binId = newId;
        newBin.codigo = '';
        newBin.descripcion = '';
        showBinForm.value = false;
    };

    // Lógica de Compatibilidad
    const parseYearsToIndividualEntries = (anioString) => {
        if (!anioString) return [];
        const parts = anioString.replace(/\s/g, '').split(',');
        const years = new Set();
        parts.forEach(part => {
            if (!part) return;
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-').map(s => s.trim());
                const startYear = parseInt(startStr);
                const endYear = parseInt(endStr);
                if (!isNaN(startYear) && !isNaN(endYear) && startYear <= endYear) {
                    for (let y = startYear; y <= endYear; y++) years.add(y);
                }
            } else {
                const year = parseInt(part);
                if (!isNaN(year)) years.add(year);
            }
        });
        return Array.from(years).sort();
    };

    const addCompatibilidad = () => {
        const selectedMarca = vehicleData.marcas.find(m => m.id === newCompatibilidadEntry.marcaId);
        const selectedModelo = vehicleData.modelos.find(m => m.id === newCompatibilidadEntry.modeloId);

        if (!selectedMarca || !selectedModelo) {
            alert('⚠️ Por favor, seleccione la Marca y el Modelo del vehículo.');
            return;
        }

        const individualYears = parseYearsToIndividualEntries(newCompatibilidadEntry.anio);

        if (individualYears.length === 0) {
            alert('⚠️ Por favor, ingrese al menos un año válido o un rango de años (Ej: 2018, 2020-2022).');
            return;
        }

        const newEntries = individualYears.map(year => {
            lastCompatibilidadId.value++;
            return {
                id: lastCompatibilidadId.value,
                marca: selectedMarca.nombre,
                modelo: selectedModelo.nombre,
                anio: year,
                descripcion: newCompatibilidadEntry.descripcion,
            };
        });

        state.compatibilidades = [...state.compatibilidades, ...newEntries];

        // Resetear la entrada
        newCompatibilidadEntry.marcaId = null;
        newCompatibilidadEntry.modeloId = null;
        newCompatibilidadEntry.anio = '';
        newCompatibilidadEntry.descripcion = '';
    };

    const removeCompatibilidad = (data) => {
        const idToRemove = data.id;
        const index = state.compatibilidades.findIndex(c => c.id === idToRemove);
        if (index !== -1) state.compatibilidades.splice(index, 1);
        else console.error('No se encontró la compatibilidad con ID:', idToRemove);
    };

    // Lógica de Notas/Imagen
    const updateNotes = (event) => {
        // Fix: Usamos innerHTML para capturar cualquier formato HTML si el div es contenteditable
        state.notas = event.target.innerHTML; // <-- MODIFICADO
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                state.imagen = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        event.target.value = null;
    };

    const removeImage = () => {
        state.imagen = null;
    };


    // 🔑 FUNCIÓN DE VALIDACIÓN AGREGADA
    const validateForm = () => {
        // Limpiar errores previos
        Object.keys(errors).forEach(key => delete errors[key]);

        let isValid = true;

        // --- Pestaña 1: Generalidades ---
        if (!state.generalidades.descripcion || state.generalidades.descripcion.trim() === '') {
            errors.descripcion = 'La descripción es obligatoria.';
            isValid = false;
        }

        if (state.esServicio) {
            const duracion = state.duracionServicio;
            if (duracion === null || duracion === undefined || isNaN(duracion) || duracion < 0) {
                 errors.duracionServicio = 'La duración es obligatoria y debe ser un número positivo.';
                 isValid = false;
            }
        }

        // --- Pestaña 3: Precios ---
        const costo = parseFloat(state.precios.costo1);
        if (isNaN(costo) || costo < 0) {
            errors.costo1 = 'El costo es obligatorio y debe ser un número $\geq 0$.';
            isValid = false;
        }
        const utilidad = parseFloat(state.precios.porcentajeUtilidad1);
        if (isNaN(utilidad)) {
            errors.porcentajeUtilidad1 = 'La utilidad es obligatoria y debe ser un número.';
            isValid = false;
        }

        // --- Pestaña 4: Inventario (solo para productos/insumos) ---
        if (!state.esServicio) {
            if (!state.inventario.almacenId) {
                errors.almacenId = 'Debe seleccionar un almacén para el inventario.';
                isValid = false;
            }
            const existencias = parseFloat(state.stock.existenciasIniciales);
            if (isNaN(existencias) || existencias < 0) {
                errors.existenciasIniciales = 'Las existencias iniciales son obligatorias y deben ser un número $\geq 0$.';
                isValid = false;
            }
        }

        if (!isValid) {
            alert('⚠️ Por favor, revise los campos marcados en rojo en el formulario.');
            // Opcional: Cambiar de pestaña al primer error encontrado
            if(errors.descripcion || errors.duracionServicio) selectedTabIndex.value = 0;
            else if (errors.costo1 || errors.porcentajeUtilidad1) selectedTabIndex.value = 2;
            else if (errors.almacenId || errors.existenciasIniciales) selectedTabIndex.value = 3;
        }

        return isValid;
    };


    // --- Lógica de Envío (Obtener el estado) ---

    const onSubmit = () => {
        // 🔑 1. Validar el formulario ANTES de proceder
        if (!validateForm()) {
            console.warn("Formulario: Validación fallida, deteniendo onSubmit.");
            return null;
        }

        // 2. Clonar todo el estado para no mutar el objeto reactivo original
        const dataToSend = JSON.parse(JSON.stringify(state));

        // 3. AJUSTES Y MAPEO FINAL para la base de datos/API

        // Mapear la descripción como el 'nombre' principal (para la columna de la tabla)
        dataToSend.generalidades.nombre = dataToSend.generalidades.descripcion;

        // Mapear el tipo de elemento (Producto, Insumo o Servicio) en una sola propiedad para la tabla
        dataToSend.generalidades.tipoProducto = dataToSend.esServicio
            ? 'Servicio'
            : dataToSend.tipoInventario;

        // 🔑 AJUSTE SOLICITADO: Mapear el Precio de Venta Neto
        // Aseguramos que sea un número para evitar problemas en el backend
        dataToSend.precios.precioVentaNeto = Number(dataToSend.precios.precio1);

        // 🔑 AJUSTE SOLICITADO: Mapear el Precio de Venta CON Impuesto
        // Aseguramos que sea un número para evitar problemas en el backend
        dataToSend.precios.precioVentaConImpuesto = Number(dataToSend.precios.precioConImpuesto1);

        // 4. Retornamos el objeto completo, ahora enriquecido con las propiedades de mapeo
        console.log("Datos listos para Pinia (incluyendo campos mapeados):", dataToSend);
        return dataToSend;
    };

    // Aseguramos que los cálculos de precios se ejecuten al inicializar
    calculateAllPrices();


    // --- Retornar el Estado y las Funciones ---

    return {
        state,
        errors, // 🔑 Exportar el objeto de errores
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
        calculatePrices,
        calculateAllPrices,
        handlePrice1Input,
        toggleBinForm,
        createBin,
        addCompatibilidad,
        removeCompatibilidad,
        updateNotes,
        handleImageUpload,
        removeImage,
        onSubmit,
        resetState, // 🔑 Exportar la función de reseteo
    };
}
