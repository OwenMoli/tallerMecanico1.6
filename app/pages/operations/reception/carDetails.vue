<template>
    <UDashboardPanel class="overflow-auto">
        <UDashboardNavbar title="Recepción de Vehículos - Detalles">
            <template #leading>
                <UDashboardSidebarCollapse />
            </template>
            <template #panel>
                <UButton icon="i-heroicons-wrench-screwdriver" label="Detalles del Vehículo" @click="toggleVehicleDetails" />
            </template>
        </UDashboardNavbar>

        <div class="progress-bar-container-compact">
            <div class="progress-step-compact" :class="{ 'active': currentStep >= 1 }">
                <div class="step-icon-compact">1</div>
                <div class="step-label-compact">Buscar Cliente</div>
            </div>
            <div class="progress-line" :class="{ 'active': currentStep >= 2 }"></div>

            <div class="progress-step-compact" :class="{ 'active': currentStep >= 2 }">
                <div class="step-icon-compact">2</div>
                <div class="step-label-compact">Buscar Vehículo</div>
            </div>
            <div class="progress-line" :class="{ 'active': currentStep >= 3 }"></div>

            <div class="progress-step-compact" :class="{ 'active': currentStep >= 3 }">
                <div class="step-icon-compact">3</div>
                <div class="step-label-compact">Recepción de Vehículo</div>
            </div>
            <div class="progress-line" :class="{ 'active': currentStep >= 4 }"></div>

            <div class="progress-step-compact" :class="{ 'active': currentStep >= 4 }">
                <div class="step-icon-compact">4</div>
                <div class="step-label-compact">Chequeo del Vehículo</div>
            </div>
        </div>

        <div class="p-4">
            <ClientHeader v-if="receptionStore.client && receptionStore.car" :clientName="receptionStore.clientName || ''"
                :clientPhone="receptionStore.clientPhone || ''" :carName="receptionStore.car.modelo"
                :carDetails="receptionStore.car.marca + ' ' + receptionStore.car.year" />
        </div>

        <div class="flex gap-6 p-4">
            <div class="flex-[2] w-2/3">
                <PaintEditor ref="paintEditorRef" />
            </div>

            <div class="flex-[1] w-1/3 flex flex-col gap-6">
                <div class="bg-gray-100 p-6 rounded-lg space-y-6 max-w-lg">
                    <h2 class="text-xl font-bold text-center">Observaciones Generales</h2>
                    <section class="space-y-4">
                        <div class="flex flex-col gap-2">
                            <label for="advisorNotes" class="font-semibold text-gray-700">Observaciones del Asesor de Servicio</label>
                            <textarea id="advisorNotes" v-model="receptionStore.serviceAdvisorNotes"
                                placeholder="Añade aquí tus observaciones..."
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                rows="5"></textarea>
                        </div>
                    </section>

                    <section class="space-y-4">
                        <div class="flex flex-col gap-2">
                            <label for="customerNotes" class="font-semibold text-gray-700">Notas del Cliente</label>
                            <textarea id="customerNotes" v-model="receptionStore.customerNotes"
                                placeholder="Añade aquí las notas del cliente..."
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                rows="5"></textarea>
                        </div>
                    </section>

                    <ImageUploadSlots />

                </div>
            </div>
        </div>

        <div class="fixed bottom-6 right-6 flex gap-3 z-50">
            <DxButton text="Anterior" type="normal" stylingMode="contained"
                class="rounded-full shadow-lg hover:bg-gray-300 transition-colors" @click="goPrevious" />
            <DxButton text="Finalizar y Descargar" type="success" stylingMode="contained"
                class="rounded-full shadow-lg hover:bg-cyan-600 transition-colors" @click="handleFinalize" />
        </div>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReceptionStore } from '~/store/reception';
import PaintEditor from '~/components/vuePaint/paintDetail.vue';
import ClientHeader from '~/components/headerInfo.vue';
import { DxButton } from 'devextreme-vue/button';
import ImageUploadSlots from '~/components/clientReception/ImageUploadSlots.vue';

const router = useRouter();
const receptionStore = useReceptionStore();

const currentStep = ref(5);
const showVehicleDetails = ref(false);

const paintEditorRef = ref<InstanceType<typeof PaintEditor> | null>(null);

function toggleVehicleDetails() { }

const goPrevious = () => {
    router.push('/operations/reception/carCheck');
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string); 
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

async function handleFinalize() {
    // 1. Validaciones esenciales
    if (!receptionStore.client || !receptionStore.car) {
        console.error("Faltan datos esenciales (cliente o vehículo) para generar el documento.");
        alert('Faltan datos de cliente/vehículo.');
        return;
    }

    // 2. Obtener y Guardar el Diagrama de Pintura del Editor en Pinia
    // Accede a la propiedad 'imageBase64' expuesta por el componente hijo.
    if (paintEditorRef.value && receptionStore.car) {
        const diagramBase64 = paintEditorRef.value.imageBase64;
        
        // Asignación directa: Si el Base64 existe y parece válido, se guarda. 
        // El deep: true en el watch de Pinia se encargará de la persistencia.
        if (diagramBase64 && diagramBase64.length > 50 && diagramBase64.startsWith('data:image/png;base64,')) { 
            receptionStore.car.paintDiagram = diagramBase64;
            console.log("✅ Diagrama de pintura guardado en Pinia. Base64 fragmento:", diagramBase64.substring(0, 50) + '...');
        } else {
            receptionStore.car.paintDiagram = null;
            console.warn("No se detectó un diagrama de pintura válido del editor. Se enviará como null.");
        }
    } else {
         console.error("No se pudo acceder a la referencia del editor de pintura o al objeto 'car' en la store.");
         if (receptionStore.car) {
             receptionStore.car.paintDiagram = null;
         }
    }
    
    try {
        // 3. LLAMADA A LA API CON TODOS LOS DATOS DEL STORE
        // receptionStore.car ahora contiene el paintDiagram actualizado.
        const response = await fetch('/api/generate-authorization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client: receptionStore.client,
                car: receptionStore.car, 
                checklist: receptionStore.checklist,
                serviceAdvisorNotes: receptionStore.serviceAdvisorNotes,
                customerNotes: receptionStore.customerNotes,
                carImages: receptionStore.carImages,
                vin: receptionStore.vin,
                vinImageUrl: receptionStore.vinImageUrl,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al generar el documento. Estado: ' + response.status);
        }

        // 4. DESCARGA DEL ARCHIVO PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Autorizacion_${receptionStore.car.placa || 'Generica'}.pdf`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        // 5. GUARDAR EL COMPROBANTE EN EL HISTORIAL LOCAL
        const pdfBase64 = await blobToBase64(blob);

        const newReceptionId = Math.floor(Math.random() * 100000) + 1000;
        receptionStore.setLastCompletedReception({
            clientName: receptionStore.clientName || 'N/A',
            carPlate: receptionStore.car.placa,
            carBrand: receptionStore.car.marca,
            receptionDate: new Date().toLocaleDateString('es-ES'),
            receptionId: newReceptionId,
            assignedMechanic: null,
            pdfBase64: pdfBase64,
        });

        // 6. LIMPIAR EL ESTADO Y REDIRIGIR
        receptionStore.resetReception();
        router.push('/operations/WorkSpaceBoss/BossMain');

    } catch (error) {
        console.error('Fallo en la descarga o generación del documento:', error);
        alert('No se pudo generar el documento. Inténtalo de nuevo. Revisa la consola para más detalles.');
    }
}
</script>

<style scoped>
.progress-bar-container-compact {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.75rem;
    background-color: #f3f4f6;
    border-bottom: 2px solid #e5e7eb;
}

.progress-step-compact {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    color: #9ca3af;
    transition: color 0.3s;
    text-align: left;
}

.progress-step-compact.active {
    color: #1f2937;
    font-weight: bold;
}

.step-icon-compact {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d1d5db;
    color: #4b5563;
    border-radius: 9999px;
    font-weight: bold;
    transition: background-color 0.3s, color 0.3s;
}

.progress-step-compact.active .step-icon-compact {
    background-color: #2563eb;
    color: white;
}

.progress-line {
    height: 2px;
    width: 4rem;
    background-color: #d1d5db;
    transition: background-color 0.3s;
}

.progress-line.active {
    background-color: #2563eb;
}

div[class^="flex"]>div {
    min-height: 500px;
}
</style>