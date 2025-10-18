// ✅ 1. Importamos 'onMounted' para ejecutar código cuando el componente se cree
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from '~/store/product';
import { useQuotationStore } from '~/store/quotation';

export function useQuotationState(props, manualClientRef, manualCarRef, manualOrderDetailsRef) {

    const quotationStore = useQuotationStore();
    const productStore = useProductStore();
    const { allProducts } = storeToRefs(productStore);
    const { selectedQuotation } = storeToRefs(quotationStore);

    // ✅ 2. Nos aseguramos de que los productos se carguen al usar este composable
    onMounted(() => {
        // Solo llamamos a la API si la lista de productos está vacía
        if (productStore.products.length === 0) {
            console.log("useQuotationState: La lista de productos está vacía. Cargando datos...");
            productStore.fetchAllProducts();
        }
    });

    const existingQuote = selectedQuotation.value;
    const isEditing = computed(() => !!existingQuote);

    // --- El resto de tu lógica no necesita cambios ---

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
            return { ...existingQuote.vehicle, placa: existingQuote.plate };
        }
        return props.selectedCar;
    });

    const orderData = computed(() => {
        if (existingQuote && existingQuote.details) {
            return {
                asesor: existingQuote.details.recepcionista,
                vigenciaDias: existingQuote.details.vigenciaDias,
                fechaCreacion: existingQuote.lastUpdate?.split(' ')[0] || ''
            };
        }
        const manualOrderValue = manualOrderDetailsRef?.value;
        if (manualOrderValue && manualOrderValue.asesor) {
            return manualOrderValue;
        }
        return {};
    });

    const availableJobsData = computed(() => {
        // Esta computada ahora funcionará de forma segura porque los datos ya estarán cargados
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
        return { subtotal, tax, total, taxRateDisplay: fixedTaxRate };
    });

    return {
        selectedJobsDetails,
        comments,
        isProductFormModalOpen,
        isEditingProduct,
        currentProductRecord,
        isFinalizeModalOpen,
        isErrorModalOpen,
        isEditing,
        existingQuote,
        clientData,
        carData,
        orderData,
        availableJobsData,
        clientName,
        clientPhone,
        clientEmail,
        clientAddress,
        quotationPreviewData,
        productStore,
        quotationStore,
        getJobSubtotal,
        manualClientRef,
        manualCarRef,
        manualOrderDetailsRef
    };
}
