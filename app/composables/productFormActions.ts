// /composables/product-form-actions.ts

import { type Ref } from 'vue';
import { type ProductState, type NewCompatibilidadEntry, type NewBin, type Bin, vehicleData, type Compatibilidad } from './productFormState';

export function useProductFormActions(
    state: ProductState,
    errors: Record<string, string>,
    selectedTabIndex: Ref<number>,
    binsState: Ref<Bin[]>,
    lastBinId: Ref<number>,
    showBinForm: Ref<boolean>,
    newBin: NewBin,
    lastCompatibilidadId: Ref<number>,
    newCompatibilidadEntry: NewCompatibilidadEntry,
    initialData: ProductState | null
) {

    // --- Métodos de Precios ---
    const getImpuestoRate = (): number => {
        return state.precios.impuesto === 'ISV 15%' ? 0.15 : 0.18;
    };

    const calculatePriceWithTax = (priceNumber: number = 1): void => {
        if (priceNumber !== 1) return;
        const precioNeto = parseFloat(String(state.precios.precio1)) || 0;
        if (state.precios.aplicaImpuesto) {
            const impuestoRate = getImpuestoRate();
            state.precios.precioConImpuesto1 = precioNeto * (1 + impuestoRate);
        } else {
            state.precios.precioConImpuesto1 = precioNeto;
        }
        state.precios.precioConImpuesto1 = Number(parseFloat(String(state.precios.precioConImpuesto1)).toFixed(2));
        state.precios.precioVentaConImpuesto = state.precios.precioConImpuesto1;
    };

    const calculatePorcentajeUtilidad = (precioNeto: number | string, costo: number | string): string => {
        const p = parseFloat(String(precioNeto)) || 0;
        const c = parseFloat(String(costo)) || 0;
        if (c > 0) return ((p - c) / c * 100).toFixed(2);
        return (p > 0 && c === 0) ? '100.00' : '0.00';
    };

    const calculatePrices = (priceNumber: number, type: 'precio' | 'porcentaje' | 'costo' = 'precio'): void => {
        let costo = parseFloat(String(state.precios[`costo${priceNumber as 1|2|3|4}`])) || 0;
        if (priceNumber > 1) {
            costo = parseFloat(String(state.precios.costo1)) || 0;
            state.precios[`costo${priceNumber as 2|3|4}`] = costo;
        }
        let precio = parseFloat(String(state.precios[`precio${priceNumber as 1|2|3|4}`])) || 0;
        let porcentaje = parseFloat(String(state.precios[`porcentajeUtilidad${priceNumber as 1|2|3|4}`])) || 0;

        if (type === 'precio') {
            const newPorcentaje = calculatePorcentajeUtilidad(precio, costo);
            state.precios[`porcentajeUtilidad${priceNumber as 1|2|3|4}`] = parseFloat(newPorcentaje);
        } else if (type === 'porcentaje') {
            precio = costo * (1 + (porcentaje / 100));
            state.precios[`precio${priceNumber as 1|2|3|4}`] = Number(parseFloat(String(precio)).toFixed(2));
        } else if (type === 'costo') {
            if (priceNumber === 1) {
                precio = costo * (1 + (porcentaje / 100));
                state.precios[`precio${priceNumber as 1}`] = Number(parseFloat(String(precio)).toFixed(2));
                const newPorcentaje = calculatePorcentajeUtilidad(state.precios.precio1, costo);
                state.precios[`porcentajeUtilidad${priceNumber as 1}`] = parseFloat(newPorcentaje);
            }
        }

        if (priceNumber === 1) {
            calculatePriceWithTax();
            state.precios.precioVentaNeto = state.precios.precio1;
            state.precios.precioVentaConImpuesto = state.precios.precioConImpuesto1;
            if (type === 'costo') {
                for (let i = 2; i <= 4; i++) {
                    calculatePrices(i, 'porcentaje');
                }
            }
        }
    };

    const calculateAllPrices = (): void => {
        calculatePrices(1, 'costo');
        for (let i = 2; i <= 4; i++) {
            calculatePrices(i, 'porcentaje');
        }
    };

    const handlePrice1Input = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        const inputPrice = parseFloat(target.value) || 0;
        if (state.precios.aplicaImpuesto) {
            const impuestoRate = getImpuestoRate();
            const precioNeto = inputPrice / (1 + impuestoRate);
            state.precios.precio1 = Number(parseFloat(String(precioNeto)).toFixed(2));
            state.precios.precioConImpuesto1 = Number(parseFloat(String(inputPrice)).toFixed(2));
        } else {
            state.precios.precio1 = Number(parseFloat(String(inputPrice)).toFixed(2));
            state.precios.precioConImpuesto1 = Number(parseFloat(String(inputPrice)).toFixed(2));
        }
        state.precios.precioVentaConImpuesto = state.precios.precioConImpuesto1;
        state.precios.precioVentaNeto = state.precios.precio1;
        calculatePrices(1, 'precio');
    }

    // --- Métodos de Utilidad/CRUD ---
    const toggleBinForm = (): void => {
        showBinForm.value = !showBinForm.value;
        newBin.codigo = '';
        newBin.descripcion = '';
    };

    const createBin = (): void => {
        if (!newBin.codigo || !newBin.descripcion || !state.inventario.almacenId) {
            alert('Por favor, complete todos los campos de la nueva estantería y seleccione un almacén.');
            return;
        }
        const newId = ++lastBinId.value;
        binsState.value.push({
            id: newId,
            ...newBin,
            almacenId: state.inventario.almacenId as number
        });
        state.inventario.binId = newId;
        newBin.codigo = '';
        newBin.descripcion = '';
        showBinForm.value = false;
    };

    const parseYearsToIndividualEntries = (anioString: string): number[] => {
        if (!anioString) return [];
        const parts = anioString.replace(/\s/g, '').split(',');
        const years = new Set<number>();
        parts.forEach(part => {
            if (!part) return;
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-').map((s: string) => s.trim());
                const startYear = parseInt(startStr || '');
                const endYear = parseInt(endStr || '');
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

    const addCompatibilidad = (): void => {
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
        const newEntries: Compatibilidad[] = individualYears.map((year: number) => {
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
        newCompatibilidadEntry.marcaId = null;
        newCompatibilidadEntry.modeloId = null;
        newCompatibilidadEntry.anio = '';
        newCompatibilidadEntry.descripcion = '';
    };

    const removeCompatibilidad = (data: { id: number }): void => {
        const idToRemove = data.id;
        const index = state.compatibilidades.findIndex(c => c.id === idToRemove);
        if (index !== -1) state.compatibilidades.splice(index, 1);
        else console.error('No se encontró la compatibilidad con ID:', idToRemove);
    };

    const updateNotes = (event: Event): void => {
        const target = event.target as HTMLElement;
        state.notas = target.innerHTML;
    };

    const handleImageUpload = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                state.imagen = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
        target.value = '';
    };

    const removeImage = (): void => {
        state.imagen = null;
    };

    const validateForm = (): boolean => {
        Object.keys(errors).forEach(key => delete errors[key]);
        let isValid = true;

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

        const costo = parseFloat(String(state.precios.costo1));
        if (isNaN(costo) || costo < 0) {
            errors.costo1 = 'El costo es obligatorio y debe ser un número ≥ 0.';
            isValid = false;
        }
        const utilidad = parseFloat(String(state.precios.porcentajeUtilidad1));
        if (isNaN(utilidad)) {
            errors.porcentajeUtilidad1 = 'La utilidad es obligatoria y debe ser un número.';
            isValid = false;
        }

        if (!state.esServicio) {
            if (!state.inventario.almacenId) {
                errors.almacenId = 'Debe seleccionar un almacén para el inventario.';
                isValid = false;
            }
            const existencias = parseFloat(String(state.stock.existenciasIniciales));
            if (isNaN(existencias) || existencias < 0) {
                errors.existenciasIniciales = 'Las existencias iniciales son obligatorias y deben ser un número ≥ 0.';
                isValid = false;
            }
        }

        if (!isValid) {
            alert('⚠️ Por favor, revise los campos marcados en rojo en el formulario.');
            if (errors.descripcion || errors.duracionServicio) selectedTabIndex.value = 0;
            else if (errors.costo1 || errors.porcentajeUtilidad1) selectedTabIndex.value = 2;
            else if (errors.almacenId || errors.existenciasIniciales) selectedTabIndex.value = 3;
        }

        return isValid;
    };

    const onSubmit = (): ProductState | null => {
        if (!validateForm()) {
            console.warn("Formulario: Validación fallida, deteniendo onSubmit.");
            return null;
        }
        const dataToSend = JSON.parse(JSON.stringify(state)) as ProductState;
        dataToSend.generalidades.nombre = dataToSend.generalidades.descripcion;
        dataToSend.generalidades.tipoProducto = dataToSend.esServicio ? 'Servicio' : (dataToSend.tipoInventario || 'Producto');

        if (dataToSend.esServicio) {
            delete (dataToSend as any).stock;
            delete (dataToSend as any).inventario;
            delete (dataToSend as any).compatibilidades;
            dataToSend.duracionServicio = Number(dataToSend.duracionServicio);
        } else {
            dataToSend.duracionServicio = null;
        }

        dataToSend.precios.precioVentaNeto = Number(dataToSend.precios.precio1);
        dataToSend.precios.precioConImpuesto1 = Number(dataToSend.precios.precioConImpuesto1);

        if (!dataToSend.id) {
            dataToSend.id = initialData ? initialData.id : Math.random().toString(36).substring(2, 9);
        }

        console.log("Datos listos para Pinia (incluyendo campos mapeados):", dataToSend);
        return dataToSend;
    };

    return {
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
    };
}
