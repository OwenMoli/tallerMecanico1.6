<template>
    <div class="p-4 job-parts-selector">
        <h3 class="font-bold text-lg mb-4 border-b pb-2">Vincular Productos/Repuestos</h3>

        <div class="input-group-parts mb-4">
            <label for="product-search">Buscar Producto:</label>
            <div class="flex gap-2">
                <div class="searchable-dropdown-container flex-grow">
                    <input
                        type="text"
                        v-model="partSearchTerm"
                        @focus="showPartDropdown = true"
                        @blur="hidePartDropdown"
                        placeholder="Buscar repuesto (solo productos, no servicios)..."
                        class="searchable-input w-full"
                    />
                    <div v-if="showPartDropdown && filteredProducts.length > 0" class="searchable-dropdown-options">
                        <div
                            v-for="product in filteredProducts"
                            :key="product.id"
                            class="searchable-dropdown-option"
                            @mousedown.prevent="selectPart(product)"
                        >
                            <div class="part-name">{{ product.name }}</div>
                            <div class="part-price">Precio Base: L. {{ product.precios.precio1.toFixed(2) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedPart" class="selected-part-config p-3 border rounded-lg bg-yellow-50 mb-4">
            <p class="font-semibold text-gray-700 mb-2">Producto Seleccionado: {{ selectedPart.name }}</p>
            <div class="grid grid-cols-3 gap-4 items-center">

                <div>
                    <label for="quantity-input" class="text-sm">Cantidad:</label>
                    <input
                        id="quantity-input"
                        type="number"
                        v-model.number="partQuantity"
                        min="1"
                        class="input-field-reception w-full"
                    />
                </div>

                <div>
                    <label class="text-sm">Precio Unitario (L.):</label>
                    <span class="block font-bold text-lg text-blue-600">
                        {{ selectedPart.precios.precio1.toFixed(2) }}
                    </span>
                </div>

                <div class="flex items-center mt-4">
                    <input id="customer-provided" type="checkbox" v-model="customerProvided" class="h-4 w-4 text-red-600 border-gray-300 rounded" />
                    <label for="customer-provided" class="ml-2 text-sm font-medium text-red-600">
                        Cliente Provee la Parte
                    </label>
                </div>
            </div>

            <div class="text-right mt-3">
                <button @click="addPartToService" class="add-job-button bg-green-500 hover:bg-green-600 px-4 py-2 text-base w-auto h-auto">
                    Añadir al Servicio
                </button>
            </div>
        </div>


        <h4 class="font-semibold mt-6 mb-3">Repuestos Requeridos:</h4>
        <div v-if="currentParts.length === 0" class="text-gray-500 text-sm italic p-2 border rounded">
            Este servicio no tiene repuestos asociados aún.
        </div>
        <ul v-else class="space-y-2 max-h-40 overflow-y-auto">
            <li v-for="(part, index) in currentParts" :key="part.id" class="flex justify-between items-center p-2 bg-gray-50 rounded border">
                <div>
                    <span class="font-medium">{{ part.name }} (x{{ part.quantity }})</span>
                    <span v-if="part.customerProvided" class="text-red-600 font-bold ml-2">(CLIENTE PROVEE - L. 0.00)</span>
                    <span v-else class="text-green-600 ml-2">(L. {{ (part.price * part.quantity).toFixed(2) }})</span>
                </div>
                <button @click="removePart(index)" class="text-red-500 hover:text-red-700 ml-4 text-xl">
                    <i class="dx-icon-close"></i>
                </button>
            </li>
        </ul>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button @click="$emit('close')" class="hide-car-button bg-gray-400 hover:bg-gray-500">
                Cancelar
            </button>
            <button @click="saveParts" class="process-button-reception">
                Guardar Repuestos
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    // Partes actualmente asociadas al servicio (lo que venga de selectedJobsDetails)
    initialParts: {
        type: Array,
        default: () => [],
    },
    // Lista de productos disponibles (filtrados de la ProductStore)
    productsForParts: {
        type: Array,
        required: true,
    }
});

const emit = defineEmits(['parts-updated', 'close']);

const currentParts = ref(JSON.parse(JSON.stringify(props.initialParts)));
const partSearchTerm = ref('');
const showPartDropdown = ref(false);
const selectedPart = ref(null);
const partQuantity = ref(1);
const customerProvided = ref(false);

// Reinicia la selección cada vez que cambia el producto de búsqueda
watch(partSearchTerm, (newTerm) => {
    if (selectedPart.value && selectedPart.value.name === newTerm) {
        return;
    }
    selectedPart.value = null;
    partQuantity.value = 1;
    customerProvided.value = false;
});

// Calcula los productos disponibles para la búsqueda
const filteredProducts = computed(() => {
    const searchLower = partSearchTerm.value.toLowerCase();
    // Usa props.productsForParts que el padre ahora envía correctamente
    return props.productsForParts.filter(product =>
        product.name.toLowerCase().includes(searchLower)
    );
});

function hidePartDropdown() {
    // Retraso para permitir que el @mousedown.prevent de selectPart se ejecute primero
    setTimeout(() => {
        showPartDropdown.value = false;
    }, 200);
}


function selectPart(product) {
    selectedPart.value = product;
    partSearchTerm.value = product.name;
    showPartDropdown.value = false;
    partQuantity.value = 1;
    customerProvided.value = false;
}

function addPartToService() {
    if (!selectedPart.value || partQuantity.value <= 0) {
        alert("Por favor, seleccione un producto y una cantidad válida.");
        return;
    }

    // 1. Crea el objeto del repuesto
    const newPart = {
        id: selectedPart.value.id,
        name: selectedPart.value.name,
        quantity: partQuantity.value,
        price: selectedPart.value.precios.precio1,
        customerProvided: customerProvided.value,
        codigo: selectedPart.value.codigo,
    };

    // 2. Busca si ya existe
    const existingIndex = currentParts.value.findIndex(p => p.id === newPart.id);

    if (existingIndex !== -1) {
        // Actualiza la cantidad y el estado si ya existe
        currentParts.value[existingIndex].quantity += newPart.quantity;
        currentParts.value[existingIndex].customerProvided = newPart.customerProvided;
    } else {
        // Añade el nuevo repuesto
        currentParts.value.push(newPart);
    }

    // 3. Limpia la UI
    selectedPart.value = null;
    partSearchTerm.value = '';
}

function removePart(index) {
    currentParts.value.splice(index, 1);
}

function saveParts() {
    // Emite la lista final de repuestos al componente padre
    emit('parts-updated', currentParts.value);
}
</script>

<style scoped>
.searchable-dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 20;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 4px;
}
.searchable-dropdown-container {
    position: relative;
}
.searchable-dropdown-option {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}
.searchable-dropdown-option:hover {
    background-color: #f0f0f0;
}
.part-name {
    font-weight: 600;
}
.part-price {
    font-size: 0.8rem;
    color: #7f8c8d;
}
.add-job-button {
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}
</style>
