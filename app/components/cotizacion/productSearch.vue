<template>
    <div class="p-6 bg-white rounded-lg shadow-lg mb-8">
        <div class="service-details-section-reception">
            <h3 class="section-subtitle-reception">Servicio a Realizar</h3>

            <div class="input-group-reception">
                <label for="job-select-reception">Buscar Producto/Servicio:</label>
                <div class="flex gap-2">
                    <div class="searchable-dropdown-container">
                        <input
                            type="text"
                            v-model="searchTerm"
                            @focus="showDropdown = true"
                            @blur="hideDropdown"
                            placeholder="Buscar o seleccionar un servicio..."
                            class="searchable-input"
                        />
                        <div v-if="showDropdown" class="searchable-dropdown-options">
                            <template v-if="filteredJobs.length > 0">
                                <div
                                    v-for="job in filteredJobs"
                                    :key="job.id"
                                    class="searchable-dropdown-option"
                                    @mousedown.prevent="selectJobOption(job)"
                                >
                                    <div class="job-name">{{ job.name }}</div>
                                    <div class="job-costs">
                                        {{ getFormattedJobDetails(job) }}
                                    </div>
                                </div>
                            </template>
                            <div v-else class="searchable-dropdown-option text-center text-gray-500 py-2">
                                {{ searchTerm ? `No se encontraron resultados para "${searchTerm}"` : 'Cargando productos o lista vacía.' }}
                            </div>
                        </div>
                    </div>
                    <button @click="handleAddJob" class="add-job-button" :disabled="!selectedJob">
                        +
                    </button>
                    <button @click="$emit('open-product-form-modal')" class="register-product-button">
                        Registrar Nuevo Producto
                    </button>
                </div>
            </div>

            <div v-if="isProductSelected" class="input-group-reception price-selection-group transition-opacity duration-300">
                <div class="flex gap-4 items-end">
                    <div class="flex-shrink-0">
                        <label for="quantity-input">Cantidad:</label>
                        <input
                            type="number"
                            v-model.number="quantityToAdd"
                            @focus="quantityToAdd = quantityToAdd || 1"
                            min="1"
                            class="input-field-reception w-20 border-blue-500 text-center"
                        />
                    </div>

                    <div class="flex-grow">
                        <label for="price-type-select">Tipo de Precio para **{{ selectedJob.name }}**:</label>
                        <select v-model="selectedPriceType" id="price-type-select" class="input-field-reception w-full border-blue-500">
                            <option v-for="priceType in priceTypes" :key="priceType.key" :value="priceType.key">
                                {{ priceType.label }} (L. {{ selectedJob.precios?.[priceType.priceKey]?.toFixed(2) || '0.00' }})
                            </option>
                        </select>
                    </div>
                </div>

                <p class="text-sm text-gray-500 mt-2">
                    Costo Unitario: L. {{ getSelectedProductCost.toFixed(2) }} |
                    **Subtotal Estimado:** L. {{ (getSelectedProductCost * quantityToAdd).toFixed(2) }}
                </p>
            </div>
            <hr v-if="isProductSelected" class="my-6 border-t border-gray-200">
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { priceTypes } from '~/composables/useQuotationLogic'; // Importar tipos de precio

const props = defineProps({
    availableJobs: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['add-job', 'open-product-form-modal', 'job-selected']);

// --- ESTADOS LOCALES DE SELECCIÓN ---
const selectedJob = ref(null);
const showDropdown = ref(false);
const searchTerm = ref('');
const selectedPriceType = ref('precio1');
const quantityToAdd = ref(1);

// --- CÓMPUTED DE BÚSQUEDA Y PRECIOS ---

const filteredJobs = computed(() => {
    const searchLower = searchTerm.value.toLowerCase();
    if (!props.availableJobs || props.availableJobs.length === 0) {
        return [];
    }
    if (!searchLower) {
        return props.availableJobs;
    }
    return props.availableJobs.filter(job =>
        job.name.toLowerCase().includes(searchLower)
    );
});

const isProductSelected = computed(() => !!selectedJob.value);

const getSelectedProductCost = computed(() => {
    if (!selectedJob.value || !selectedJob.value.precios) {
        return 0;
    }
    const priceTypeKey = priceTypes.find(p => p.key === selectedPriceType.value)?.priceKey || 'precio1';
    return selectedJob.value.precios[priceTypeKey] || 0;
});

// --- FUNCIONES LOCALES ---

function getFormattedJobDetails(job) {
    const priceValue = job.precios ? job.precios.precio1 : 0;
    let detailText = '';

    if (job.isService) {
        detailText = `Duración: ${job.duration || 'N/A'}`;
    } else {
        detailText += `Precio: L. ${priceValue.toFixed(2)}`;

        if (job.compatibilidades && job.compatibilidades.length > 0) {
            const compatibilidades = job.compatibilidades;
            const maxDisplay = 3;

            const specificCompatibilities = compatibilidades
                .slice(0, maxDisplay)
                .map(c => `${c.marca} ${c.modelo} ${c.anio}`)
                .join(', ');

            let compatText = `Compatible: ${specificCompatibilities}`;

            if (compatibilidades.length > maxDisplay) {
                const remaining = compatibilidades.length - maxDisplay;
                compatText += ` (+${remaining} más)`;
            }

            detailText += ` | ${compatText}`;
        }
    }

    return detailText;
}

function selectJobOption(job) {
    selectedJob.value = job;
    searchTerm.value = job.name;
    showDropdown.value = false;
    selectedPriceType.value = 'precio1';
    quantityToAdd.value = 1;
    emit('job-selected', job);
}

function hideDropdown() {
    setTimeout(() => {
        showDropdown.value = false;
    }, 200);
}

function handleAddJob() {
    if (selectedJob.value && quantityToAdd.value > 0) {
        emit('add-job', {
            selectedJob: selectedJob.value,
            quantityToAdd: quantityToAdd.value,
            selectedPriceType: selectedPriceType.value
        });

        // Resetear la selección después de agregar
        selectedJob.value = null;
        searchTerm.value = '';
        quantityToAdd.value = 1;
        selectedPriceType.value = 'precio1';

        nextTick(() => {
             // Scroll al contenedor principal después de añadir
            document.getElementById('reception-details-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

// Expone las referencias para que el padre pueda manipular la selección si es necesario (ej: al guardar un producto nuevo)
defineExpose({
    selectedJob,
    searchTerm,
    quantityToAdd,
    selectedPriceType,
});
</script>

<style scoped>
/* Copiar estilos de .searchable-dropdown-container,
   .searchable-input, .searchable-dropdown-options, etc. */

.input-group-reception {
    margin-bottom: 20px;
}

.input-group-reception label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

.input-field-reception {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}

/* --- SECCIÓN DE BÚSQUEDA Y BOTONES --- */
.searchable-dropdown-container {
    flex-grow: 1;
    position: relative;
}

.searchable-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    font-size: 1rem;
    transition: border-color 0.2s;
    outline: none;
}

.searchable-input:focus {
    border-color: #3498db;
}

.searchable-dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    max-height: 250px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 4px;
}

.searchable-dropdown-option {
    padding: 12px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

.searchable-dropdown-option:last-child {
    border-bottom: none;
}

.searchable-dropdown-option:hover {
    background-color: #f0f0f0;
}

.job-name {
    font-weight: 600;
    color: #34495e;
}

.job-costs {
    font-size: 0.8rem;
    color: #7f8c8d;
}

.add-job-button {
    background-color: #2ecc71;
    color: white;
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 6px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
}

.add-job-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.register-product-button {
    background-color: #3498db;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex-shrink: 0;
}

.register-product-button:hover {
    background-color: #2980b9;
}

</style>
