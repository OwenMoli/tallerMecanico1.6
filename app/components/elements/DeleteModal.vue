<template>
    <DxPopup title="Confirmar Desactivacion" :visible.sync="open" :show-close-button="true" :width="400" :height="200"
        @hiding="cancel">
        <template #content>
            <p>¿Esta seguro de que desea desactivar al registro {{ itemName }}?</p>
            <div class="dx-form-buttons">
                <DxButton text="Cancelar" type="normal" @click="cancel" />
                <DxButton text="Confirmar" type="danger" @click="confirmDelete" />
            </div>
        </template>
    </DxPopup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import DxButton from 'devextreme-vue/button';

interface Props {
    open: boolean;
    itemName: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'confirmed']);

const confirmDelete = () => {
    emit('confirmed');
    emit('update:open', false);
};

const cancel = () => {
    emit('update:open', false);
};
</script>

<style scoped>
.dx-form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}
</style>