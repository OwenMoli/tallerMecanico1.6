<template>
    <div>
        <ProductForm
            ref="productFormRef"
            :initial-data="props.initialData"
            :is-editing="props.isEditing"
            @save="handleFormSubmit"
            @cancel="handleCancel"
        />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useProductStore } from '~/store/product';
import ProductForm from '~/components/forms/ProductForm.vue'; 

const props = defineProps({
    initialData: {
        type: Object,
        default: null
    },
    isEditing: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['save-success', 'cancel']);

const store = useProductStore();
const productFormRef = ref(null);

const handleFormSubmit = async (productData) => {
    console.log("Contenedor: Recibidos datos del formulario. Guardando en la store...");

    try {
        const savedProduct = await store.saveOrUpdateProduct(productData, props.isEditing);

        if (savedProduct) {
            console.log("Contenedor: Guardado exitoso. Notificando al componente abuelo.");
            emit('save-success', savedProduct);

            if (!props.isEditing && productFormRef.value) {
                productFormRef.value.resetState();
                console.log("Contenedor: Estado del formulario reseteado para nuevo ingreso.");
            }
        }
    } catch (error) {
        console.error("Error al guardar el producto/servicio:", error);
        alert("Ocurrió un error al intentar guardar. Revise la consola.");
    }
};

const handleCancel = () => {
    emit('cancel');
};
</script>
