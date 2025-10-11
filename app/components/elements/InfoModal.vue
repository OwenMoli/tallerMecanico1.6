<script setup>
import { ref, watch } from 'vue'
import { DxPopup } from 'devextreme-vue/popup'
import DxButton from 'devextreme-vue/button'

const props = defineProps({
    open: Boolean,
    title: { type: String, default: 'Aviso' },
    message: String,
    showConfirm: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    showInput: { type: Boolean, default: false },
    modelValue: String
})

const emit = defineEmits(['update:open', 'confirmed', 'closed', 'update:modelValue',
  'canceled'])

const inputValue = ref(props.modelValue || '')

watch(() => props.modelValue, val => {
    inputValue.value = val || ''
}, { immediate: true })


const showButtons = props.showConfirm || props.showCancel

const handleConfirm = () => {
    emit('confirmed', inputValue.value)
    emit('update:open', false) // cerrar modal
}

const handleClose = () => {
  emit('update:open', false) // cerrar modal
  emit('canceled', inputValue.value) // <-- se comporta igual que "Cancelar"
  emit('closed') // evento genérico si lo quieres usar
}


const handleCancel = () => {
    emit('update:open', false)
    emit('canceled', inputValue.value) // emitimos evento de cancelación
}



const onInput = (e) => {
    inputValue.value = e.target.value
    emit('update:modelValue', inputValue.value)
}
</script>

<template>
    <DxPopup :title="title" :visible.sync="open" :show-close-button="true" :width="400" :height="250"
        @hiding="handleClose">
        <template #content>
            <p>{{ message }}</p>
            <input v-if="showInput" :value="inputValue" @input="onInput" type="text" placeholder="Ingrese aquí..."
                class="w-full border rounded p-2 mt-2" />


            <div class="dx-form-buttons" v-if="showButtons">
                <DxButton v-if="showCancel" text="Cancelar" type="normal" @click="handleCancel" />
                <DxButton v-if="showConfirm" text="Confirmar" type="danger" @click="handleConfirm" />
            </div>
        </template>
    </DxPopup>
</template>

<style scoped>
.dx-form-buttons {
    display: flex;
    justify-content: center;
    /* Cambiado de flex-end a center */
    gap: 10px;
    margin-top: 20px;
}
</style>
