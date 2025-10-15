<template>
    <div>
        <h3 class="font-semibold text-xl mb-4 text-gray-800">Datos Requeridos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <h4 class="font-bold text-lg mb-3 text-gray-700 border-b pb-2">Datos del Cliente</h4>
                <div class="space-y-4">
                    <div>
                        <label for="client-name" class="block text-sm font-medium text-gray-700">Nombre/Empresa *</label>
                        <input type="text" id="client-name" v-model="clientModel.nombre" required class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="client-phone" class="block text-sm font-medium text-gray-700">Teléfono *</label>
                        <input type="tel" id="client-phone" v-model="clientModel.telefono" required class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="client-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="client-email" v-model="clientModel.correo" class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="client-rtn" class="block text-sm font-medium text-gray-700">RTN/ID</label>
                        <input type="text" id="client-rtn" v-model="clientModel.rtn" class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="client-address" class="block text-sm font-medium text-gray-700">Dirección</label>
                        <input type="text" id="client-address" v-model="clientModel.direccion" class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                </div>
            </div>

            <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <h4 class="font-bold text-lg mb-3 text-gray-700 border-b pb-2">Datos del Vehículo</h4>
                <div class="space-y-4">
                    <div>
                        <label for="car-make" class="block text-sm font-medium text-gray-700">Marca *</label>
                        <input type="text" id="car-make" v-model="carModel.marca" required class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="car-model" class="block text-sm font-medium text-gray-700">Modelo *</label>
                        <input type="text" id="car-model" v-model="carModel.modelo" required class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="car-plate" class="block text-sm font-medium text-gray-700">Placa *</label>
                        <input type="text" id="car-plate" v-model="carModel.placa" required class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                    <div>
                        <label for="car-mileage" class="block text-sm font-medium text-gray-700">Odómetro (Km)</label>
                        <input type="number" id="car-mileage" v-model.number="carModel.kilometraje" class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                     <div>
                        <label for="car-vin" class="block text-sm font-medium text-gray-700">VIN</label>
                        <input type="text" id="car-vin" v-model="carModel.vin" class="mt-1 block w-full input-field-reception border-gray-300">
                    </div>
                </div>
            </div>

            <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-200 md:col-span-2 lg:col-span-1">
                 <h4 class="font-bold text-lg mb-3 text-gray-700 border-b pb-2">Datos de la Orden</h4>
                 <div class="space-y-4">
                     <div>
                         <label for="order-asesor" class="block text-sm font-medium text-gray-700">Asesor *</label>
                         <input type="text" id="order-asesor" v-model="orderDetailsModel.asesor" required class="mt-1 block w-full input-field-reception border-gray-300">
                     </div>
                     <div>
                         <label for="order-validity" class="block text-sm font-medium text-gray-700">Validez (Días) *</label>
                         <input type="number" id="order-validity" v-model.number="orderDetailsModel.vigenciaDias" required class="mt-1 block w-full input-field-reception border-gray-300" min="1">
                     </div>
                     <div>
                         <label for="order-date" class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                         <input type="date" id="order-date" v-model="orderDetailsModel.fechaCreacion" disabled class="mt-1 block w-full input-field-reception border-gray-300 bg-gray-100 cursor-not-allowed">
                     </div>
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Usamos defineModel para crear v-models desde el componente padre
const clientModel = defineModel('client');
const carModel = defineModel('car');
const orderDetailsModel = defineModel('orderDetails');
</script>

<style scoped>
/* Copia y pega aquí los estilos .input-field-reception si es necesario */
.input-field-reception {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}
</style>
