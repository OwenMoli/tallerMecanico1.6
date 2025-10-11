// useQuotationLogic.js

import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useReceptionStore } from '~/store/reception';
import { useProductStore } from '~/store/product';

export const priceTypes = [
    { key: 'precio1', label: 'Precio 1 (Base)', priceKey: 'precio1' },
    { key: 'precio2', label: 'Precio 2 (Mayoreo)', priceKey: 'precio2' },
    { key: 'precio3', label: 'Precio 3 (Especial)', priceKey: 'precio3' },
    { key: 'precio4', label: 'Precio 4 (Fidelidad)', priceKey: 'precio4' },
];

export function useQuotationLogic(props, router, manualClientRef = null, manualCarRef = null, manualOrderDetailsRef = null) {
    const receptionStore = useReceptionStore();
    const productStore = useProductStore();
    const { allProducts } = storeToRefs(productStore);
    const { selectedQuotation } = storeToRefs(receptionStore);

    const existingQuote = selectedQuotation.value;
    const isEditing = computed(() => !!existingQuote);

    if (existingQuote) {
        if (manualClientRef) {
            const client = existingQuote.client || {};
            manualClientRef.value = {
                ...client,
                nombre: client.nombre || client.name || client.empresaNombre || '',
                telefono: client.telefono || client.phone || client.contactoTelefono || '',
                correo: client.correo || client.email || client.contactoCorreo || '',
                rtn: client.rtn || client.dni || client.identification || '',
                direccion: client.direccion || client.address || client.empresaDireccion || '',
            };
        }
        if (manualCarRef) {
            const vehicle = existingQuote.vehicle || {};
            manualCarRef.value = {
                ...vehicle,
                marca: vehicle.marca || vehicle.brand || '',
                modelo: vehicle.modelo || vehicle.model || '',
                placa: existingQuote.plate || '',
                kilometraje: vehicle.kilometraje || 0,
                vin: vehicle.vin || '',
            };
        }
        if (manualOrderDetailsRef) {
            const details = existingQuote.details || {};
            const dateStr = existingQuote.lastUpdate ? existingQuote.lastUpdate.split(' ')[0] : '';
            manualOrderDetailsRef.value = {
                asesor: details.recepcionista || existingQuote.receptionist || '',
                vigenciaDias: details.vigenciaDias || 0,
                fechaCreacion: dateStr,
            };
        }
    }

    const initialJobs = existingQuote?.jobs ? JSON.parse(JSON.stringify(existingQuote.jobs)) : [];
    const initialComments = existingQuote?.comments || '';

    const selectedJobsDetails = ref(initialJobs);
    const comments = ref(initialComments);
    const isProductFormModalOpen = ref(false);
    const isEditingProduct = ref(false);
    const currentProductRecord = ref(null);
    const isFinalizeModalOpen = ref(false);
    const isErrorModalOpen = ref(false);

    const clientData = computed(() => {
        const manualClientValue = manualClientRef?.value;
        if (manualClientValue && manualClientValue.nombre) {
            return manualClientValue;
        }
        if (existingQuote && existingQuote.client) {
            return existingQuote.client;
        }
        return props.client;
    });

    const carData = computed(() => {
        const manualCarValue = manualCarRef?.value;
        if (manualCarValue && manualCarValue.placa) {
            return manualCarValue;
        }
        if (existingQuote && existingQuote.vehicle) {
            return existingQuote.vehicle;
        }
        return props.selectedCar;
    });

    const orderData = computed(() => {
        if (existingQuote && existingQuote.orden) return existingQuote.orden;
        const manualOrderValue = manualOrderDetailsRef?.value;
        if (manualOrderValue && manualOrderValue.asesor) {
             return manualOrderValue;
        }
        return {};
    });

    const availableJobsData = computed(() => {
        return allProducts.value.map(product => ({
            id: product.id,
            name: product.generalidades.nombre,
            isService: !!product.esServicio,
            costo: product.precios.costo1,
            precios: {
                precio1: product.precios.precio1,
                precio2: product.precios.precio2,
                precio3: product.precios.precio3,
                precio4: product.precios.precio4,
                editarPrecio: product.precios.editarPrecio || false,
            },
            duration: product.esServicio ? product.duracionServicio + ' horas' : null,
            parts: [],
            codigo: product.generalidades.codigo,
            compatibilidades: product.compatibilidades || [],
        }));
    });

    const clientName = computed(() => {
        const client = clientData.value;
        if (!client) return 'N/A';
        if ('name' in client && client.name) return client.name;
        if ('nombre' in client && client.nombre) return `${client.nombre} ${client.apellido || ''}`.trim();
        return client.empresaNombre || 'N/A';
    });

    const clientPhone = computed(() => {
        const client = clientData.value;
        if (!client) return 'N/A';
        if ('phone' in client) return client.phone;
        return client.telefono || client.contactoTelefono || 'N/A';
    });

    const clientEmail = computed(() => {
        const client = clientData.value;
        if (!client) return 'N/A';
        if ('email' in client) return client.email;
        return client.correo || client.contactoCorreo || 'N/A';
    });

    const clientAddress = computed(() => {
        const client = clientData.value;
        if (!client) return 'N/A';
        return client.direccion || client.empresaDireccion || 'N/A';
    });

    function getJobSubtotal(job) {
        const quantity = job.quantity || 1;
        return (job.serviceCost || 0) * quantity;
    }

    const quotationPreviewData = computed(() => {
        const subtotal = selectedJobsDetails.value.reduce((sum, job) => sum + getJobSubtotal(job), 0);
        const fixedTaxRate = 15.0;
        const taxRate = fixedTaxRate / 100;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        return {
            subtotal,
            tax,
            total,
            taxRateDisplay: fixedTaxRate
        };
    });

    function getPriceLabel(key) {
        const type = priceTypes.find(p => p.key === key);
        return type ? type.label : key;
    }

    function addJob(jobDetails) {
        if (jobDetails.selectedJob && jobDetails.quantityToAdd > 0) {
            const jobToAdd = JSON.parse(JSON.stringify(jobDetails.selectedJob));
            const priceKey = priceTypes.find(p => p.key === jobDetails.selectedPriceType)?.priceKey || 'precio1';
            const selectedPrice = jobToAdd.precios ? jobToAdd.precios[priceKey] : 0;
            jobToAdd.serviceCost = selectedPrice;
            jobToAdd.priceKey = jobDetails.selectedPriceType;
            jobToAdd.quantity = jobDetails.quantityToAdd;
            if (!jobToAdd.parts) {
                jobToAdd.parts = [];
            }
            selectedJobsDetails.value.push(jobToAdd);
        }
    }

    function removeJob(index) {
        selectedJobsDetails.value.splice(index, 1);
    }

    function updateJobServiceCost(index, newCost) {
        const cost = parseFloat(newCost);
        if (!isNaN(cost) && cost >= 0) {
            const item = selectedJobsDetails.value[index];
            if (item && cost.toFixed(2) === item.serviceCost.toFixed(2)) {
                return;
            }
            if (item) {
                item.serviceCost = cost;
            }
        }
    }

    function updateJobQuantity(index, newQuantity) {
        const quantity = parseInt(newQuantity, 10);
        if (!isNaN(quantity) && quantity > 0) {
            const item = selectedJobsDetails.value[index];
            if (item && item.quantity === quantity) {
                return;
            }
            if (item) {
                item.quantity = quantity;
            }
        }
    }

    function finalizeQuotation() {
        if (selectedJobsDetails.value.length === 0) {
            isErrorModalOpen.value = true;
            return;
        }
        isFinalizeModalOpen.value = true;
    }

    function openProductFormModal() {
        currentProductRecord.value = null;
        isEditingProduct.value = false;
        isProductFormModalOpen.value = true;
    }

    function onConfirmQuotation() {
        const consolidatedItems = [];
        const taxRate = quotationPreviewData.value.taxRateDisplay;
        selectedJobsDetails.value.forEach((job, index) => {
            const totalLinePrice = getJobSubtotal(job);
            const quantity = job.quantity || 1;
            const unitPrice = job.serviceCost || 0;
            const baseItem = {
                cantidad: quantity,
                priceCharged: totalLinePrice,
                unitPrice: unitPrice,
                costo: job.costo || 0,
                priceKey: job.priceKey,
                codigo: job.codigo || `PROD-${job.id}-${index}`,
            };
            if (job.isService) {
                consolidatedItems.push({
                    ...baseItem,
                    descripcion: `${job.name} (Servicio)`,
                    manoDeObra: unitPrice,
                    valorRepuesto: 0,
                    codigo: job.codigo || `MO-PROD-${job.id}-${index}`,
                    marca: 'Consolidado',
                    condicion: 'Servicio',
                });
            } else {
                consolidatedItems.push({
                    ...baseItem,
                    descripcion: job.name,
                    manoDeObra: 0,
                    valorRepuesto: unitPrice,
                    marca: job.marca || 'N/A',
                    condicion: 'Nuevo',
                });
            }
        });

        const client = clientData.value;
        let clientForStore = {};
        const defaultId = client?.id || 'N/A';

        if (existingQuote && client === existingQuote.client) {
            clientForStore = {
                id: client.id || defaultId,
                nombre: client.nombre || client.name || 'N/A',
                empresaNombre: client.empresaNombre || client.name || 'N/A',
                apellido: client.apellido || '',
                telefono: client.telefono || client.phone || 'N/A',
                correo: client.correo || client.email || 'N/A',
                rtn: client.rtn || 'N/A',
                direccion: client.direccion || client.address || 'N/A',
            };
        } else if (manualClientRef && client === manualClientRef.value) {
            const displayName = client.nombre || client.name || 'N/A';
            clientForStore = {
                id: defaultId,
                nombre: displayName,
                empresaNombre: client.empresaNombre || displayName,
                apellido: client.apellido || '',
                telefono: client.telefono || 'N/A',
                correo: client.correo || 'N/A',
                rtn: client.rtn || 'N/A',
                direccion: client.direccion || 'N/A',
            };
        } else if (client) {
            if ('apellido' in client) {
                const clientNameDisplay = `${client.nombre} ${client.apellido || ''}`.trim();
                clientForStore = {
                    id: client.id || defaultId,
                    nombre: client.nombre,
                    empresaNombre: clientNameDisplay,
                    apellido: client.apellido || '',
                    telefono: client.telefono,
                    correo: client.correo || 'N/A',
                    rtn: client.rtn || client.dni || client.identidad || 'N/A',
                    direccion: client.direccion || 'N/A',
                };
            } else if ('empresaNombre' in client) {
                const companyName = client.empresaNombre;
                clientForStore = {
                    id: client.id || defaultId,
                    nombre: companyName,
                    empresaNombre: companyName,
                    apellido: 'Empresa',
                    telefono: client.contactoTelefono,
                    correo: client.contactoCorreo || 'N/A',
                    rtn: client.empresaRtn || 'N/A',
                    direccion: client.empresaDireccion || client.direccion || 'N/A',
                };
            } else {
                const displayName = client.nombre || client.name || 'N/A';
                clientForStore = {
                    id: client.id || defaultId,
                    nombre: displayName,
                    empresaNombre: displayName,
                    apellido: client.apellido || '',
                    telefono: client.telefono || client.phone || 'N/A',
                    correo: client.correo || client.email || 'N/A',
                    rtn: client.rtn || client.dni || client.identification || 'N/A',
                    direccion: client.direccion || client.address || 'N/A',
                };
            }
        }

        const quotationData = {
            client: clientForStore,
            vehicle: {
                id: carData.value?.id || 'N/A',
                placa: carData.value?.placa || 'N/A',
                marca: carData.value?.marca || carData.value?.brand || 'N/A',
                modelo: carData.value?.modelo || carData.value?.model || 'N/A',
                anio: carData.value?.year || carData.value?.anio || 'N/A',
                color: carData.value?.color || 'N/A',
                kilometraje: carData.value?.kilometraje || 0,
                vin: carData.value?.vin || 'N/A',
            },
            jobs: selectedJobsDetails.value,
            items: consolidatedItems,
            comments: comments.value,
            taxRate: taxRate,
            totals: quotationPreviewData.value,
            orden: orderData.value,
        };

        receptionStore.setQuotationData(quotationData);
        router.push('/operations/cotizacion/cotizacionMain');
    }

    return {
        selectedJobsDetails,
        comments,
        isProductFormModalOpen,
        isEditingProduct,
        currentProductRecord,
        isFinalizeModalOpen,
        isErrorModalOpen,
        availableJobsData,
        clientName,
        clientPhone,
        clientEmail,
        clientAddress,
        quotationPreviewData,
        productStore,
        getJobSubtotal,
        getPriceLabel,
        addJob,
        removeJob,
        finalizeQuotation,
        onConfirmQuotation,
        updateJobServiceCost,
        updateJobQuantity,
        openProductFormModal,
        isEditing,
        existingQuote
    };
}
