export const priceTypes = [
    { key: 'precio1', label: 'Precio 1 (Base)', priceKey: 'precio1' },
    { key: 'precio2', label: 'Precio 2 (Mayoreo)', priceKey: 'precio2' },
    { key: 'precio3', label: 'Precio 3 (Especial)', priceKey: 'precio3' },
    { key: 'precio4', label: 'Precio 4 (Fidelidad)', priceKey: 'precio4' },
];

export function useQuotationActions(state, router) {

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
            state.selectedJobsDetails.value.push(jobToAdd);
        }
    }

    function removeJob(index) {
        state.selectedJobsDetails.value.splice(index, 1);
    }

    function updateJobServiceCost(index, newCost) {
        const cost = parseFloat(newCost);
        if (!isNaN(cost) && cost >= 0) {
            const item = state.selectedJobsDetails.value[index];
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
            const item = state.selectedJobsDetails.value[index];
            if (item && item.quantity === quantity) {
                return;
            }
            if (item) {
                item.quantity = quantity;
            }
        }
    }

    function finalizeQuotation() {
        if (state.selectedJobsDetails.value.length === 0) {
            state.isErrorModalOpen.value = true;
            return;
        }
        state.isFinalizeModalOpen.value = true;
    }

    function openProductFormModal() {
        state.currentProductRecord.value = null;
        state.isEditingProduct.value = false;
        state.isProductFormModalOpen.value = true;
    }

    function onConfirmQuotation() {
        const consolidatedItems = [];
        const taxRate = state.quotationPreviewData.value.taxRateDisplay;
        state.selectedJobsDetails.value.forEach((job, index) => {
            const totalLinePrice = state.getJobSubtotal(job);
            const quantity = job.quantity || 1;
            const unitPrice = job.serviceCost || 0;
            const baseItem = { cantidad: quantity, priceCharged: totalLinePrice, unitPrice: unitPrice, costo: job.costo || 0, priceKey: job.priceKey, codigo: job.codigo || `PROD-${job.id}-${index}` };
            if (job.isService) {
                consolidatedItems.push({ ...baseItem, descripcion: `${job.name} (Servicio)`, manoDeObra: unitPrice, valorRepuesto: 0, codigo: job.codigo || `MO-PROD-${job.id}-${index}`, marca: 'Consolidado', condicion: 'Servicio' });
            } else {
                consolidatedItems.push({ ...baseItem, descripcion: job.name, manoDeObra: 0, valorRepuesto: unitPrice, marca: job.marca || 'N/A', condicion: 'Nuevo' });
            }
        });

        const client = state.clientData.value;
        let clientForStore = {};
        const defaultId = client?.id || 'N/A';

        if (state.existingQuote && client === state.existingQuote.client) {
            clientForStore = { id: client.id || defaultId, nombre: client.nombre || client.name || 'N/A', empresaNombre: client.empresaNombre || client.name || 'N/A', apellido: client.apellido || '', telefono: client.telefono || client.phone || 'N/A', correo: client.correo || client.email || 'N/A', rtn: client.rtn || 'N/A', direccion: client.direccion || client.address || 'N/A' };
        } else if (state.manualClientRef && client === state.manualClientRef.value) {
            const displayName = client.nombre || client.name || 'N/A';
            clientForStore = { id: defaultId, nombre: displayName, empresaNombre: client.empresaNombre || displayName, apellido: client.apellido || '', telefono: client.telefono || 'N/A', correo: client.correo || 'N/A', rtn: client.rtn || 'N/A', direccion: client.direccion || 'N/A' };
        } else if (client) {
            if ('apellido' in client) {
                const clientNameDisplay = `${client.nombre} ${client.apellido || ''}`.trim();
                clientForStore = { id: client.id || defaultId, nombre: client.nombre, empresaNombre: clientNameDisplay, apellido: client.apellido || '', telefono: client.telefono, correo: client.correo || 'N/A', rtn: client.rtn || client.dni || client.identidad || 'N/A', direccion: client.direccion || 'N/A' };
            } else if ('empresaNombre' in client) {
                const companyName = client.empresaNombre;
                clientForStore = { id: client.id || defaultId, nombre: companyName, empresaNombre: companyName, apellido: 'Empresa', telefono: client.contactoTelefono, correo: client.contactoCorreo || 'N/A', rtn: client.empresaRtn || 'N/A', direccion: client.empresaDireccion || client.direccion || 'N/A' };
            } else {
                const displayName = client.nombre || client.name || 'N/A';
                clientForStore = { id: client.id || defaultId, nombre: displayName, empresaNombre: displayName, apellido: client.apellido || '', telefono: client.telefono || client.phone || 'N/A', correo: client.correo || client.email || 'N/A', rtn: client.rtn || client.dni || client.identification || 'N/A', direccion: client.direccion || client.address || 'N/A' };
            }
        }

        const quotationData = {
            id: state.isEditing.value ? state.existingQuote.id : undefined,
            client: clientForStore,
            vehicle: { id: state.carData.value?.id || 'N/A', placa: state.carData.value?.placa || 'N/A', marca: state.carData.value?.marca || state.carData.value?.brand || 'N/A', modelo: state.carData.value?.modelo || state.carData.value?.model || 'N/A', year: state.carData.value?.year || state.carData.value?.anio || 'N/A', color: state.carData.value?.color || 'N/A', kilometraje: state.carData.value?.kilometraje || 0, vin: state.carData.value?.vin || 'N/A' },
            jobs: state.selectedJobsDetails.value,
            items: consolidatedItems,
            comments: state.comments.value,
            taxRate: taxRate,
            totals: state.quotationPreviewData.value,
            orden: state.orderData.value,
        };

        state.quotationStore.setQuotationData(quotationData);
        router.push('/operations/cotizacion/cotizacionMain');
    }

    return {
        getPriceLabel,
        addJob,
        removeJob,
        updateJobServiceCost,
        updateJobQuantity,
        finalizeQuotation,
        openProductFormModal,
        onConfirmQuotation
    };
}
