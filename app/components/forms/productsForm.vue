<template>
  <DxForm
    :form-data="formData"
    :show-validation-summary="true"
    label-location="top"
  >
    <DxGroupItem
      :col-count="2"
      caption="Información Básica"
    >
      <DxSimpleItem
        data-field="Tipo"
        caption="Tipo"
        editor-type="dxRadioGroup"
        :editor-options="{ items: ['Producto', 'Servicio'], layout: 'horizontal' }"
        :validation-rules="[{ type: 'required', message: 'El tipo es obligatorio.' }]"
      />
      <DxSimpleItem
        data-field="Condicion"
        caption="Condición"
        editor-type="dxSelectBox"
        :editor-options="{ items: ['Nuevo', 'Usado'] }"
        :validation-rules="[{ type: 'required', message: 'La condición es obligatoria.' }]"
        :visible="isProduct"
      />
      <DxSimpleItem
        data-field="Codigo"
        caption="Código"
        :validation-rules="[{ type: 'required', message: 'El código es obligatorio.' }]"
      />
      <DxSimpleItem
        data-field="CodigoBarras"
        caption="Código de Barras"
        :visible="isProduct"
      />
      <DxSimpleItem
        data-field="Nombre"
        caption="Nombre"
        :col-span="2"
        :validation-rules="[{ type: 'required', message: 'El nombre es obligatorio.' }]"
      />
    </DxGroupItem>

    <DxGroupItem>
      <DxTabPanel
        :animation-enabled="true"
        :loop="false"
        height="auto"
      >
        <DxItem
          title="Compatibilidad"
          :visible="isProduct"
        >
          <DxForm>
            <DxGroupItem
              :col-count="2"
              caption="Añadir Compatibilidad"
            >
              <DxSimpleItem
                data-field="Compatibilidad_Ano"
                caption="Año"
                editor-type="dxNumberBox"
                :editor-options="{ min: 1900, max: new Date().getFullYear() + 1, showSpinButtons: true }"
              />
              <DxSimpleItem
                data-field="Compatibilidad_Marca"
                caption="Marca"
                editor-type="dxTextBox"
              />
              <DxSimpleItem
                data-field="Compatibilidad_Modelo"
                caption="Modelo"
                editor-type="dxTextBox"
              />
              <DxSimpleItem
                data-field="Compatibilidad_Descripcion"
                caption="Descripción"
                :col-span="2"
                editor-type="dxTextBox"
              />
              <DxSimpleItem
                data-field="Compatibilidad_Notas"
                caption="Notas"
                :col-span="2"
                editor-type="dxTextArea"
              />
              <DxSimpleItem>
                <template #default>
                  <DxButton
                    text="Añadir Compatibilidad"
                    type="default"
                    @click="addCompatibility"
                  />
                </template>
              </DxSimpleItem>
            </DxGroupItem>

            <DxGroupItem caption="Lista de Compatibilidades">
              <DxDataGrid
                :data-source="compatibleEntries"
                :allow-column-reordering="true"
                :row-alternation-enabled="true"
              >
                <DxColumn
                  data-field="year"
                  caption="Año"
                  width="100"
                />
                <DxColumn
                  data-field="make"
                  caption="Marca"
                />
                <DxColumn
                  data-field="model"
                  caption="Modelo"
                />
                <DxColumn
                  data-field="description"
                  caption="Descripción"
                />
                <DxColumn
                  data-field="notes"
                  caption="Notas"
                />
                <DxColumn
                  type="buttons"
                  caption="Acciones"
                >
                  <DxButton :hint="'Eliminar'" icon="trash" :onClick="removeCompatibility" />
                </DxColumn>
              </DxDataGrid>
            </DxGroupItem>
          </DxForm>
        </DxItem>

        <DxItem
          title="Inventario y Ubicación"
          :visible="isProduct"
        >
          <DxForm>
            <DxGroupItem :col-count="2">
              <DxSimpleItem
                data-field="TipoInventario"
                caption="Tipo de Inventario"
                editor-type="dxSelectBox"
                :editor-options="{ items: ['Repuestos', 'Suministros'] }"
                :validation-rules="[{ type: 'required', message: 'El tipo de inventario es obligatorio.' }]"
              />
              <DxSimpleItem
                data-field="Stock"
                caption="Stock Actual"
                editor-type="dxNumberBox"
                :editor-options="{ min: 0, format: '#,##0' }"
                :validation-rules="[{ type: 'required', message: 'El stock es obligatorio.' }, { type: 'range', min: 0, message: 'El stock no puede ser negativo.' }]"
              />
              <DxSimpleItem
                data-field="Almacen"
                caption="Almacén"
                editor-type="dxSelectBox"
                :editor-options="{ items: ['Principal', 'Bodega Sur', 'Almacén 3'], searchEnabled: true }"
                :validation-rules="[{ type: 'required', message: 'El almacén es obligatorio.' }]"
              />
              <DxSimpleItem
                data-field="Estante"
                caption="Estante"
                editor-type="dxSelectBox"
                :editor-options="{ items: ['A1', 'A2', 'B1', 'B2', 'C1'], searchEnabled: true }"
                :validation-rules="[{ type: 'required', message: 'El estante es obligatorio.' }]"
              />
            </DxGroupItem>
          </DxForm>
        </DxItem>

        <DxItem title="Precios e Impuestos">
          <DxForm>
            <DxGroupItem :col-count="2">
              <DxSimpleItem
                data-field="CostoUnitario"
                caption="Costo Unitario"
                editor-type="dxNumberBox"
                :editor-options="{ format: '$#,##0.00' }"
                :validation-rules="[{ type: 'required', message: 'El costo es obligatorio.' }, { type: 'range', min: 0.01, message: 'El costo debe ser positivo.' }]"
                :visible="isProduct"
              />
              <DxSimpleItem
                data-field="PorcentajeUtilidad"
                caption="% Utilidad (sobre costo)"
                editor-type="dxNumberBox"
                :editor-options="{ format: 'p0', min: 0, max: 1, step: 0.01 }"
                :visible="isProduct"
              />
              <DxSimpleItem
                data-field="AplicaImpuesto"
                caption="Aplica Impuesto"
                editor-type="dxSwitch"
              />
              <DxSimpleItem
                data-field="PorcentajeImpuesto"
                caption="% Impuesto (IVA)"
                editor-type="dxNumberBox"
                :editor-options="{ format: 'p0', min: 0, max: 1, step: 0.01, disabled: !formData?.AplicaImpuesto }"
              />
              <DxSimpleItem
                data-field="PrecioVenta1"
                caption="Precio Venta 1 (Base)"
                editor-type="dxNumberBox"
                :editor-options="{ format: '$#,##0.00', readOnly: true }"
                :validation-rules="[{ type: 'required', message: 'El precio es obligatorio.' }, { type: 'range', min: 0.01, message: 'El precio debe ser positivo.' }]"
              />
              <DxSimpleItem
                data-field="PrecioVentaConImpuesto1"
                caption="Precio Venta 1 (Con Impuesto)"
                editor-type="dxNumberBox"
                :editor-options="{ format: '$#,##0.00', readOnly: true }"
              />
              <DxSimpleItem
                data-field="PrecioVenta2"
                caption="Precio Venta 2"
                editor-type="dxNumberBox"
                :editor-options="{ format: '$#,##0.00' }"
              />
              <DxSimpleItem
                data-field="PrecioVenta3"
                caption="Precio Venta 3"
                editor-type="dxNumberBox"
                :editor-options="{ format: '$#,##0.00' }"
              />
              <DxSimpleItem
                data-field="PrecioVenta4"
                caption="Precio Venta 4"
                editor-type="dxNumberBox"
                :editor-options="{ format: '$#,##0.00' }"
              />
            </DxGroupItem>
          </DxForm>
        </DxItem>

        <DxItem title="Catálogo y Archivos">
          <DxForm>
            <DxGroupItem :col-count="1">
              <DxSimpleItem
                data-field="CatalogoCompra"
                caption="Catálogo de Compra (Texto Enriquecido)"
                editor-type="dxHtmlEditor"
                :editor-options="{ height: 200 }"
              >
                <DxMedia :tabs="['image', 'link', 'video']" />
              </DxSimpleItem>

              <DxSimpleItem
                data-field="NotasEspeciales"
                caption="Notas Especiales (si es pieza especial)"
                editor-type="dxTextArea"
                :editor-options="{ height: 70 }"
              />

              <DxSimpleItem>
                <template #default>
                  <div class="p-4 border-2 border-dashed border-gray-300 rounded-md">
                    <h4 class="text-lg font-semibold mb-2">Imágenes del Producto</h4>
                    <DxFileUploader
                      :multiple="true"
                      :accept="'image/*'"
                      upload-mode="instantly"
                      @uploaded="onFileUploaded"
                      :show-file-list="false"
                      label-text="Arrastra y suelta imágenes aquí o haz clic para seleccionarlas"
                    />
                    <div class="mt-4 flex flex-wrap gap-2">
                      <div v-for="(image, index) in uploadedImages" :key="index" class="relative w-24 h-24">
                        <img :src="image.url" class="w-full h-full object-cover rounded-md" />
                        <button
                          @click="removeImage(index)"
                          class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs -mt-2 -mr-2"
                        >
                          X
                        </button>
                      </div>
                      <p v-if="uploadedImages.length === 0" class="text-gray-500 text-sm mt-2">No hay imágenes subidas.</p>
                    </div>
                  </div>
                </template>
              </DxSimpleItem>
            </DxGroupItem>
          </DxForm>
        </DxItem>
      </DxTabPanel>
    </DxGroupItem>
  </DxForm>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from 'vue';
import { useToast } from '#imports';
import { DxForm, DxGroupItem, DxSimpleItem } from 'devextreme-vue/form';
import { DxTabPanel, DxItem } from 'devextreme-vue/tab-panel';
import { DxHtmlEditor } from 'devextreme-vue/html-editor';
import { DxButton } from 'devextreme-vue/button';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import { DxFileUploader } from 'devextreme-vue/file-uploader';

// Definición de las propiedades y eventos
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:formData']);

const toast = useToast();

const uploadedImages = ref<{ url: string; file?: File }[]>(props.formData.Imagenes || []);
const compatibleEntries = ref(props.formData.Compatibilidad || []);

// Propiedad computada para determinar si el tipo es 'Producto'
const isProduct = computed(() => props.formData.Tipo === 'Producto');

// Se utilizan watchers para detectar cambios en las propiedades relevantes y actualizar el formulario
watch(() => props.formData.Condicion, (newVal) => {
  if (newVal === 'Usado') {
    emit('update:formData', { ...props.formData, AplicaImpuesto: false, PorcentajeImpuesto: 0 });
  } else {
    emit('update:formData', { ...props.formData, AplicaImpuesto: true, PorcentajeImpuesto: 0.15 });
  }
}, { immediate: true });

watch(() => props.formData.Tipo, (newVal) => {
  if (newVal === 'Servicio') {
    emit('update:formData', {
      ...props.formData,
      Condicion: undefined,
      TipoInventario: undefined,
      Stock: undefined,
      Almacen: undefined,
      Estante: undefined,
      CostoUnitario: undefined,
      PorcentajeUtilidad: undefined,
      CodigoBarras: undefined,
    });
  }
});

// Propiedad computada para calcular el Precio Venta 1
const precioVenta1 = computed(() => {
  const costo = props.formData.CostoUnitario || 0;
  const utilidad = props.formData.PorcentajeUtilidad || 0;
  return parseFloat((costo * (1 + utilidad)).toFixed(2));
});

// Propiedad computada para calcular el Precio Venta 1 con Impuesto
const precioVentaConImpuesto1 = computed(() => {
  const aplicaImpuesto = props.formData.AplicaImpuesto;
  const impuesto = props.formData.PorcentajeImpuesto || 0;
  return aplicaImpuesto ? parseFloat((precioVenta1.value * (1 + impuesto)).toFixed(2)) : precioVenta1.value;
});

// Se utilizan watchers para actualizar los campos basados en las propiedades computadas
watch(precioVenta1, (newVal) => {
  if (props.formData.Condicion !== 'Usado') {
    emit('update:formData', { ...props.formData, PrecioVenta1: newVal });
  }
}, { immediate: true });

watch(precioVentaConImpuesto1, (newVal) => {
  if (props.formData.Condicion !== 'Usado') {
    emit('update:formData', { ...props.formData, PrecioVentaConImpuesto1: newVal });
  }
}, { immediate: true });

// Lógica de subida y eliminación de imágenes
const onFileUploaded = (e: any) => {
  const file = e.file;
  const imageUrl = URL.createObjectURL(file);
  const newImages = [...uploadedImages.value, { url: imageUrl, file: file }];
  uploadedImages.value = newImages;
  emit('update:formData', { ...props.formData, Imagenes: newImages });
  toast.add({ title: 'Imagen subida', description: `Imagen ${file.name} lista para adjuntar.`, color: 'info' });
};

const removeImage = (index: number) => {
  if (uploadedImages.value) {
    const newImages = [...uploadedImages.value];
    newImages.splice(index, 1);
    uploadedImages.value = newImages;
    emit('update:formData', { ...props.formData, Imagenes: newImages });
    toast.add({ title: 'Imagen eliminada', color: 'info' });
  }
};

// Lógica para añadir y eliminar compatibilidades
const addCompatibility = () => {
  const newEntry = {
    year: props.formData.Compatibilidad_Ano,
    make: props.formData.Compatibilidad_Marca,
    model: props.formData.Compatibilidad_Modelo,
    description: props.formData.Compatibilidad_Descripcion,
    notes: props.formData.Compatibilidad_Notas,
  };

  if (newEntry.year || newEntry.make || newEntry.model) {
    compatibleEntries.value.push(newEntry);
    emit('update:formData', { ...props.formData, Compatibilidad: compatibleEntries.value });

    // Limpiar campos de entrada
    emit('update:formData', {
      ...props.formData,
      Compatibilidad_Ano: null,
      Compatibilidad_Marca: '',
      Compatibilidad_Modelo: '',
      Compatibilidad_Descripcion: '',
      Compatibilidad_Notas: '',
    });

    toast.add({ title: 'Compatibilidad agregada', description: 'Se añadió una nueva entrada de compatibilidad.', color: 'success' });
  } else {
    toast.add({ title: 'Error', description: 'Por favor, complete al menos el año, marca o modelo.', color: 'error' });
  }
};

const removeCompatibility = (e: any) => {
  const index = e.row.rowIndex;
  if (index !== undefined) {
    compatibleEntries.value.splice(index, 1);
    emit('update:formData', { ...props.formData, Compatibilidad: compatibleEntries.value });
    toast.add({ title: 'Compatibilidad eliminada', description: 'La entrada de compatibilidad ha sido eliminada.', color: 'info' });
  }
};
</script>
