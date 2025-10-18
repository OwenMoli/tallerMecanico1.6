
import { onMounted } from 'vue';
import { useQuotationState } from './useQuotationState';
import { useQuotationActions } from './useQuotationActions';

export { priceTypes } from './useQuotationActions';

export function useQuotationLogic(props, router, manualClientRef = null, manualCarRef = null, manualOrderDetailsRef = null) {

    const state = useQuotationState(props, manualClientRef, manualCarRef, manualOrderDetailsRef);
    const actions = useQuotationActions(state, router);

    onMounted(() => {
        const quoteToEdit = state.quotationStore.selectedQuotation;

        if (quoteToEdit && quoteToEdit.id && quoteToEdit.id !== 'default') {
            console.log('📝 MODO EDICIÓN: Cargando datos locales del formulario para la cotización ID:', quoteToEdit.id);

            state.isEditing.value = true;

            if (manualClientRef) {
                manualClientRef.value = {
                    id: quoteToEdit.client.id,
                    nombre: quoteToEdit.client.name,
                    apellido: '',
                    telefono: quoteToEdit.client.phone,
                    correo: quoteToEdit.client.email,
                    direccion: quoteToEdit.client.direccion,
                    rtn: quoteToEdit.client.rtn,
                };
            }


            if (manualCarRef) {
                manualCarRef.value = {
                    id: quoteToEdit.vehicle.id || null,
                    id_cliente: quoteToEdit.client.id || null,
                    marca: quoteToEdit.vehicle.brand,
                    modelo: quoteToEdit.vehicle.model,
                    year: quoteToEdit.vehicle.year,
                    placa: quoteToEdit.plate,
                    kilometraje: quoteToEdit.vehicle.kilometraje,
                    vin: quoteToEdit.vehicle.vin,
                };
            }

            if (manualOrderDetailsRef) {
                manualOrderDetailsRef.value = {
                    asesor: quoteToEdit.receptionist,
                    vigenciaDias: quoteToEdit.details?.vigenciaDias || 7,
                    fechaCreacion: quoteToEdit.lastUpdate ? new Date(quoteToEdit.lastUpdate.split(' ')[0]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                };
            }


            state.selectedJobsDetails.value = JSON.parse(JSON.stringify(quoteToEdit.jobs || []));
            state.comments.value = quoteToEdit.comments || '';

        } else {
             console.log('✨ MODO CREACIÓN: El formulario está listo para una nueva cotización.');
             state.isEditing.value = false;
             state.quotationStore.setEditingQuoteId(null);
             if (manualClientRef) manualClientRef.value = { nombre: '', telefono: '', correo: '', rtn: '', direccion: '' };
             if (manualCarRef) manualCarRef.value = { marca: '', modelo: '', placa: '', kilometraje: 0, vin: '' };
             if (manualOrderDetailsRef) manualOrderDetailsRef.value = { vigenciaDias: 30, asesor: '', fechaCreacion: new Date().toISOString().split('T')[0] };
             state.selectedJobsDetails.value = [];
             state.comments.value = '';
        }
    });


    const cancelAndGoBack = () => {

        console.log("Acción de cancelar ejecutada. Limpiando estado...");
        state.quotationStore.clearQuotationData();
        state.quotationStore.resetSelectedQuotation();
        router.back();
    };

    return {
        ...state,
        ...actions,
        cancelAndGoBack
    };
}
