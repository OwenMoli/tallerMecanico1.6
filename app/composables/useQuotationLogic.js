import { onUnmounted } from 'vue';
import { useQuotationState } from './useQuotationState';
import { useQuotationActions } from './useQuotationActions';


export { priceTypes } from './useQuotationActions';

export function useQuotationLogic(props, router, manualClientRef = null, manualCarRef = null, manualOrderDetailsRef = null) {


    const state = useQuotationState(props, manualClientRef, manualCarRef, manualOrderDetailsRef);

    const actions = useQuotationActions(state, router);

    onUnmounted(() => {
        state.quotationStore.resetSelectedQuotation();
    });

    return {
        ...state,
        ...actions
    };
}
