<template>
    <div class="p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl mx-auto border border-gray-200 dark:border-gray-700">

        <div v-if="state.esServicio !== undefined">
            <header class="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {{ isViewMode ? 'Detalles del' : 'Registro de' }} {{ state.esServicio ? 'Servicio' : 'Producto/Insumo' }} 📦
                </h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ isViewMode ? 'Viendo detalles del elemento.' : `Complete los detalles para ${isEditing ? 'actualizar' : 'crear'} el elemento.` }}
                </p>
            </header>

            <div class="flex items-center gap-6 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tipo de Elemento:</h3>
                <div class="flex items-center">
                    <input id="esServicio" type="checkbox" v-model="state.esServicio" :disabled="isViewMode" class="h-5 w-5 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 rounded-md transition duration-150 ease-in-out" />
                    <label for="esServicio" class="ml-3 block text-base font-medium text-gray-700 dark:text-gray-300 select-none">
                        ¿Es un **Servicio**?
                    </label>
                </div>
            </div>

            <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav class="-mb-px flex space-x-10" aria-label="Tabs">
                    <a v-for="(tab, index) in filteredTabs" :key="tab.label" @click="selectedTabIndex = index"
                        :class="[
                            index === selectedTabIndex
                                ? 'border-green-600 text-green-700 dark:text-green-400 font-bold'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
                            'whitespace-nowrap py-3 px-1 border-b-3 font-medium text-base cursor-pointer transition duration-200 ease-in-out'
                        ]">
                        {{ tab.label }}
                    </a>
                </nav>
            </div>

            <form @submit.prevent="handleFormSubmit" class="space-y-8">
                <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner-lg">

                    <div v-show="filteredTabs[selectedTabIndex]?.originalIndex === 0">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

                            <div v-if="!state.esServicio" class="col-span-1">
                                <label for="condicion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condición</label>
                                <select id="condicion" v-model="state.condicion" :disabled="isViewMode" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5">
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado">Usado</option>
                                </select>
                            </div>

                            <div v-if="!state.esServicio" class="col-span-1">
                                <label for="tipoInventario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Inventario</label>
                                <select id="tipoInventario" v-model="state.tipoInventario" :disabled="isViewMode" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5">
                                    <option value="Producto">Producto</option>
                                    <option value="Insumo">Insumo</option>
                                </select>
                            </div>

                            <div>
                                <label for="codigo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
                                <input type="text" id="codigo" v-model="state.generalidades.codigo" disabled class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 shadow-sm cursor-not-allowed sm:text-sm p-2.5" placeholder="Generado automáticamente" />
                            </div>

                            <div v-if="!state.esServicio">
                                <label for="codigoBarra" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Barra</label>
                                <input type="text" id="codigoBarra" v-model="state.generalidades.codigoBarra" :disabled="isViewMode" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" placeholder="Opcional" />
                            </div>

                            <div v-if="state.esServicio" class="col-span-1">
                                <label for="duracionServicio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración del Servicio (Horas) <span class="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    id="duracionServicio"
                                    v-model.number="state.duracionServicio"
                                    :disabled="isViewMode"
                                    step="0.01"
                                    min="0"
                                    :class="['mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5', { 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.duracionServicio }]"
                                    placeholder="Ej: 1.5 horas"
                                />
                                <p v-if="errors.duracionServicio" class="mt-1 text-sm text-red-500">{{ errors.duracionServicio }}</p>
                            </div>

                            <div :class="{'md:col-span-2 lg:col-span-2': true}">
                                <label for="descripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción del Elemento <span class="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="descripcion"
                                    v-model="state.generalidades.descripcion"
                                    :disabled="isViewMode"
                                    required
                                    :class="['mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5', { 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.descripcion }]"
                                    placeholder="Nombre completo o descripción corta del producto/servicio"
                                />
                                <p v-if="errors.descripcion" class="mt-1 text-sm text-red-500">{{ errors.descripcion }}</p>
                            </div>

                            <div v-if="!state.esServicio" class="md:col-span-2 lg:col-span-2">
                                <label for="referencia" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referencias Adicionales</label>
                                <textarea id="referencia" v-model="state.generalidades.referencia" :disabled="isViewMode" rows="3" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" placeholder="Añade referencias, números de parte, etc."></textarea>
                            </div>
                        </div>
                    </div>

                    <div v-show="filteredTabs[selectedTabIndex]?.originalIndex === 1" class="space-y-6">

                        <div v-if="!isViewMode">
                            <h3 class="font-bold text-gray-900 dark:text-white border-b pb-2">Agregar Vehículo Compatible</h3>
                            <div class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 mt-4">

                                <div class="col-span-2">
                                    <label for="marca" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marca <span class="text-red-500">*</span></label>
                                    <select id="marca" v-model.number="newCompatibilidadEntry.marcaId" class="block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm sm:text-sm p-2.5">
                                        <option :value="null" disabled>Seleccione una Marca</option>
                                        <option v-for="marca in vehicleData.marcas" :key="marca.id" :value="marca.id">
                                            {{ marca.nombre }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-span-2">
                                    <label for="modelo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modelo <span class="text-red-500">*</span></label>
                                    <select
                                        id="modelo"
                                        v-model.number="newCompatibilidadEntry.modeloId"
                                        :disabled="!newCompatibilidadEntry.marcaId || filteredModelos.length === 0"
                                        class="block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm sm:text-sm p-2.5"
                                        :class="{ 'opacity-60 cursor-not-allowed': !newCompatibilidadEntry.marcaId || filteredModelos.length === 0 }"
                                    >
                                        <option :value="null" disabled>
                                            {{ newCompatibilidadEntry.marcaId ? 'Seleccione un Modelo' : 'Primero seleccione una Marca' }}
                                        </option>
                                        <option v-for="modelo in filteredModelos" :key="modelo.id" :value="modelo.id">
                                            {{ modelo.nombre }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-span-1">
                                    <label for="anio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Años (Ej: 2018, 2020-2022)</label>
                                    <input
                                        type="text"
                                        id="anio"
                                        v-model="newCompatibilidadEntry.anio"
                                        class="block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm sm:text-sm p-2.5"
                                        placeholder="Múltiples años o rangos"
                                        @keyup.enter="addCompatibilidad"
                                    />
                                </div>

                                <div class="col-span-1">
                                    <button type="button" @click="addCompatibilidad" class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out h-[42px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                                        <span class="hidden md:inline">Agregar</span>
                                    </button>
                                </div>

                                <div class="col-span-full">
                                    <label for="desc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Ej: 2.0L Turbo, AWD)</label>
                                    <input type="text" id="desc" v-model="newCompatibilidadEntry.descripcion" class="block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm sm:text-sm p-2.5" placeholder="Motor, tracción, versión o notas relevantes" />
                                </div>
                            </div>
                        </div>

                        <h3 class="font-bold text-gray-900 dark:text-white border-t pt-4">Lista de Compatibilidades</h3>

                        <DxDataGridReusable
                            ref="compatibilityGridRef"
                            :data-source="state.compatibilidades"
                            key-expr="id"
                            :on-delete-click="isViewMode ? undefined : handleRemoveCompatibility"
                            :columns="compatibilityColumns"
                            :show-column-lines="true"
                            :show-row-lines="true"
                            :show-borders="true"
                        />
                        <p v-if="state.compatibilidades.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">Aún no ha agregado vehículos compatibles.</p>
                    </div>

                    <div v-show="filteredTabs[selectedTabIndex]?.originalIndex === 2">
                        <div class="space-y-8">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                                <div class="md:col-span-3 flex flex-wrap gap-6 items-center border-b pb-4 border-gray-100 dark:border-gray-700">
                                    <div class="flex items-center">
                                        <input id="aplicaImpuesto" type="checkbox" v-model="state.precios.aplicaImpuesto"
                                            :disabled="isViewMode || (state.condicion === 'Usado' && !state.esServicio)"
                                            class="h-5 w-5 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 rounded"
                                            :class="{ 'opacity-60 cursor-not-allowed': state.condicion === 'Usado' && !state.esServicio }" />
                                        <label for="aplicaImpuesto" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 select-none">Aplica Impuesto</label>
                                    </div>
                                    <div class="flex items-center">
                                        <input id="editarPrecio" type="checkbox" v-model="state.precios.editarPrecio" :disabled="isViewMode || (state.condicion === 'Usado' && !state.esServicio)" class="h-5 w-5 text-green-600 dark:text-green-400 focus:ring-green-500 border-gray-300 rounded" :class="{ 'opacity-60 cursor-not-allowed': state.condicion === 'Usado' && !state.esServicio }" />
                                        <label for="editarPrecio" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 select-none">Permitir Edición de Precios</label>
                                    </div>
                                </div>

                                <div v-if="state.precios.aplicaImpuesto || state.esServicio" class="col-span-1">
                                    <label for="impuesto" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Impuesto</label>
                                    <select id="impuesto" v-model="state.precios.impuesto" :disabled="isViewMode" @change="calculateAllPrices()" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5">
                                        <option value="ISV 15%">ISV 15%</option>
                                        <option value="ISV 18%">ISV 18%</option>
                                    </select>
                                </div>
                            </div>

                            <div class="space-y-6">
                                <div class="p-5 border border-green-200 dark:border-green-700/50 rounded-xl bg-green-50 dark:bg-gray-700/30 shadow-md">
                                    <h3 class="font-bold text-lg text-green-800 dark:text-green-300 mb-4">Precio 1 (Principal)</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                                        <div>
                                            <label for="costo1" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Costo <span class="text-red-500">*</span></label>
                                            <input type="number" id="costo1" v-model.number="state.precios.costo1" :disabled="isViewMode" step="0.01" @input="calculatePrices(1, 'costo')" :class="['mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5', { 'border-red-500': errors.costo1 }]" />
                                            <p v-if="errors.costo1" class="mt-1 text-sm text-red-500">{{ errors.costo1 }}</p>
                                        </div>

                                        <div>
                                            <label for="porcentajeUtilidad1" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilidad (%) <span class="text-red-500">*</span></label>
                                            <input type="number" id="porcentajeUtilidad1" v-model.number="state.precios.porcentajeUtilidad1" :disabled="isViewMode" step="0.01" @input="calculatePrices(1, 'porcentaje')" :class="['mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5', { 'border-red-500': errors.porcentajeUtilidad1 }]" />
                                            <p v-if="errors.porcentajeUtilidad1" class="mt-1 text-sm text-red-500">{{ errors.porcentajeUtilidad1 }}</p>
                                        </div>

                                        <div>
                                            <label for="utilidad1" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilidad</label>
                                            <input type="number" id="utilidad1" :value="calculatedUtilidad1" disabled class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 shadow-sm cursor-not-allowed sm:text-sm p-2.5" />
                                        </div>

                                        <div class="col-span-1 md:col-span-2">
                                            <label for="precioNeto" class="block text-sm font-bold text-gray-800 dark:text-white mb-1">Precio Neto (Sin Impuesto)</label>
                                            <input type="number" id="precioNeto" :value="state.precios.precio1" :disabled="isViewMode" @input="event => { state.precios.precio1 = parseFloat(event.target.value) || 0; calculatePrices(1, 'precio'); }" step="0.01" class="mt-1 block w-full rounded-lg border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-900/50 dark:text-white shadow-inner sm:text-base p-3 font-semibold" />
                                        </div>

                                        <div class="col-span-1 md:col-span-2">
                                            <label for="precio1" class="block text-sm font-bold text-gray-800 dark:text-white mb-1">Precio 1 ({{ state.precios.aplicaImpuesto ? state.precios.impuesto : 'C/S Impuesto' }})</label>
                                            <input type="number" id="precio1" :value="state.precios.precioConImpuesto1" :disabled="isViewMode" @input="handlePrice1Input" step="0.01" class="mt-1 block w-full rounded-lg border-green-500 dark:border-green-500 bg-green-100 dark:bg-green-900/50 dark:text-white shadow-inner sm:text-base p-3 font-semibold" />
                                            <p v-if="state.precios.aplicaImpuesto" class="mt-1 text-xs text-gray-500 dark:text-gray-400">*Valor del impuesto incluido: Lps. {{ (state.precios.precioConImpuesto1 - state.precios.precio1).toFixed(2) }}</p>
                                        </div>

                                    </div>
                                </div>

                                <div class="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700 space-y-6">
                                    <h3 class="font-bold text-gray-900 dark:text-white mb-4">Precios Adicionales (Mayoreo, Especial, etc.)</h3>
                                    <div v-for="n in [2, 3, 4]" :key="n" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                                        <div>
                                            <label :for="'precio' + n" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio {{ n }}</label>
                                            <input type="number" :id="'precio' + n" v-model.number="state.precios['precio' + n]" :disabled="isViewMode" step="0.01" @input="calculatePrices(n)" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" />
                                        </div>
                                        <div>
                                            <label :for="'porcentajeUtilidad' + n" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilidad %</label>
                                            <input type="number" :id="'porcentajeUtilidad' + n" v-model.number="state.precios['porcentajeUtilidad' + n]" :disabled="isViewMode" step="0.01" @input="calculatePrices(n, 'porcentaje')" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilidad (P{{ n }})</label>
                                            <input type="number" :value="n === 2 ? calculatedUtilidad2 : n === 3 ? calculatedUtilidad3 : calculatedUtilidad4" disabled class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 shadow-sm cursor-not-allowed sm:text-sm p-2.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-show="filteredTabs[selectedTabIndex]?.originalIndex === 3">
                        <div class="space-y-6">
                            <h3 class="font-bold text-gray-900 dark:text-white mb-4 border-b pb-2">Asignación de Ubicación de Inventario 📍</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="almacen" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Almacén <span class="text-red-500">*</span></label>
                                    <select id="almacen" v-model="state.inventario.almacenId" :disabled="isViewMode" :class="['mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5', { 'border-red-500': errors.almacenId }]">
                                        <option value="">Seleccione un almacén</option>
                                        <option v-for="almacen in almacenes" :key="almacen.id" :value="almacen.id">{{ almacen.nombre }}</option>
                                    </select>
                                    <p v-if="errors.almacenId" class="mt-1 text-sm text-red-500">{{ errors.almacenId }}</p>
                                </div>
                                <div>
                                    <label for="bin" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estantería (Bin)</label>
                                    <div class="flex gap-2">
                                        <select id="bin" v-model="state.inventario.binId" :disabled="isViewMode || !state.inventario.almacenId" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" :class="{ 'opacity-60 cursor-not-allowed': !state.inventario.almacenId }">
                                            <option value="">Seleccione un bin</option>
                                            <option v-for="bin in filteredBins" :key="bin.id" :value="bin.id">{{ bin.descripcion }} ({{ bin.codigo }})</option>
                                        </select>
                                        <button v-if="!isViewMode" type="button" @click="toggleBinForm" :disabled="!state.inventario.almacenId" class="mt-1 px-4 py-2 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="showBinForm" class="mt-6 p-5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <h4 class="text-md font-bold text-gray-900 dark:text-white mb-4">Crear Nueva Estantería en **{{ almacenes.find(a => a.id === state.inventario.almacenId)?.nombre || 'Almacén' }}**</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="newBinCodigo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
                                        <input type="text" id="newBinCodigo" v-model="newBin.codigo" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" />
                                    </div>
                                    <div>
                                        <label for="newBinDescripcion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                        <input type="text" id="newBinDescripcion" v-model="newBin.descripcion" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5" />
                                    </div>
                                </div>
                                <div class="flex justify-end gap-3 mt-4">
                                    <button type="button" @click="showBinForm = false" class="inline-flex ...">Cancelar</button>
                                    <button type="button" @click="createBin" class="inline-flex ...">Crear Estantería</button>
                                </div>
                            </div>

                            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 class="font-bold text-gray-900 dark:text-white mb-4">Existencias y Stock Inicial 🛒</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div class="md:col-span-1">
                                        <label for="existenciasIniciales" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Existencias Iniciales <span class="text-red-500">*</span></label>
                                        <input type="number" id="existenciasIniciales" v-model.number="state.stock.existenciasIniciales" :disabled="isViewMode" min="0" :class="['mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5', { 'border-red-500': errors.existenciasIniciales }]"/>
                                        <p v-if="errors.existenciasIniciales" class="mt-1 text-sm text-red-500">{{ errors.existenciasIniciales }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-show="filteredTabs[selectedTabIndex]?.originalIndex === 4">
                        <div class="space-y-4">
                            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notas Detalladas</label>
                            <div class="overflow-x-auto shadow-inner rounded-lg border border-gray-300 dark:border-gray-700">
                                <div id="notes-editor" class="bg-gray-50 dark:bg-gray-900/70 text-gray-900 dark:text-white rounded-lg p-4 min-h-[200px] outline-none" :contenteditable="!isViewMode" @input="updateNotes" v-html="state.notas"></div>
                            </div>
                        </div>
                    </div>

                    <div v-show="filteredTabs[selectedTabIndex]?.originalIndex === 5">
                        <div class="space-y-6">
                            <h3 class="font-bold text-gray-900 dark:text-white">Imagen Principal 🖼️</h3>
                            <div v-if="!state.imagen && !isViewMode" class="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center hover:border-green-400 dark:hover:border-green-500">
                                <label class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-green-500 dark:text-green-400 mb-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 15H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>
                                    Arrastra y suelta **una** imagen aquí o
                                    <input type="file" @change="handleImageUpload" :disabled="isViewMode" class="hidden" accept="image/*" />
                                    <span class="text-green-600 dark:text-green-400 hover:text-green-700 font-semibold">haz clic para seleccionar</span>
                                </label>
                            </div>
                            <div v-else-if="state.imagen" class="mt-4 flex flex-wrap gap-4">
                                <div class="relative w-48 h-48 group">
                                    <img :src="state.imagen" class="w-full h-full object-cover rounded-lg border-4 border-green-500 shadow-xl" alt="Imagen del producto" />
                                    <button v-if="!isViewMode" @click="removeImage" type="button" class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs -mt-2 -mr-2 flex items-center justify-center h-8 w-8 hover:bg-red-600 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div v-else class="text-center text-gray-500 p-10 bg-gray-100 rounded-lg">No hay imagen para este producto.</div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button type="button" @click="$emit('cancel')" class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        {{ isViewMode ? 'Cerrar' : 'Cancelar' }}
                    </button>
                    <button v-if="!isViewMode" type="submit" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-xl text-white bg-green-600 hover:bg-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L10 12.586l-2.293-2.293z" /><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-8a7 7 0 1114 0 7 7 0 01-14 0z" clip-rule="evenodd" /></svg>
                        {{ isEditing ? 'Actualizar' : 'Guardar' }} {{ state.esServicio ? 'Servicio' : 'Producto' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else class="text-center p-10 text-gray-500 dark:text-gray-400">
            Cargando formulario...
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, defineExpose, ref, computed } from 'vue';
import useProductForm from '~/composables/useProductsForm';
import DxDataGridReusable from '~/components/elements/ReusableDataGrid.vue';

const compatibilityGridRef = ref(null);

const props = defineProps({
    initialData: {
        type: Object,
        default: null
    },
    isEditing: {
        type: Boolean,
        default: false
    },
    isViewMode: { // <-- AÑADIDO
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['save', 'cancel']);

const {
    state,
    errors,
    selectedTabIndex,
    showBinForm,
    newBin,
    newCompatibilidadEntry,
    almacenes,
    bins,
    vehicleData,
    filteredModelos,
    filteredTabs,
    filteredBins,
    calculatedUtilidad1,
    calculatedUtilidad2,
    calculatedUtilidad3,
    calculatedUtilidad4,
    calculatePrices,
    calculateAllPrices,
    handlePrice1Input,
    toggleBinForm,
    createBin,
    addCompatibilidad,
    removeCompatibilidad,
    updateNotes,
    handleImageUpload,
    removeImage,
    onSubmit: getFormData,
    resetState,
} = useProductForm(props.initialData);

// ✅ LÓGICA PARA LAS COLUMNAS DINÁMICAS
const compatibilityColumns = computed(() => {
    const baseColumns = [
        { dataField: 'marca', caption: 'Marca' },
        { dataField: 'modelo', caption: 'Modelo' },
        { dataField: 'anio', caption: 'Año', dataType: 'number', width: 80 },
        { dataField: 'descripcion', caption: 'Descripción' },
    ];
    // Solo añadimos la columna de botones si NO estamos en modo vista
    if (!props.isViewMode) {
        baseColumns.push({
            type: 'buttons',
            width: 80,
            buttons: [{ hint: 'Desactivar', icon: 'trash' }]
        });
    }
    return baseColumns;
});

const handleRemoveCompatibility = (data) => {
    removeCompatibilidad(data);
    compatibilityGridRef.value?.instance?.refresh();
};

const handleFormSubmit = () => {
    console.log("Formulario: Validando y obteniendo datos...");
    const productData = getFormData();

    if (props.isViewMode) return; // Prevenimos el guardado

    if (productData) {
        console.log("Formulario: Datos válidos. Emitiendo evento 'save' al padre.");
        emit('save', productData);
    } else {
        console.warn("Formulario: Datos no válidos, no se emite evento.");
    }
};

defineExpose({
    resetState
});
</script>
