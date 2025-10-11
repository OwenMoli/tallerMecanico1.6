<template>
  <div class="form-section">
    <h3 class="section-title">Detalles del producto</h3>
    <div class="form-row">
      <div class="form-field">
        <label for="product-name">Nombre de Producto:</label>
        <input type="text" id="product-name" v-model="product.name" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label for="product-description">Descripción:</label>
        <textarea id="product-description" v-model="product.description"></textarea>
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-field">
        <label for="product-provider">Proveedor:</label>
        <select id="product-provider" v-model="product.provider">
          <option disabled value="">Selecciona un proveedor</option>
          <option value="proveedor1">Proveedor 1</option>
          <option value="proveedor2">Proveedor 2</option>
        </select>
      </div>
      <div class="form-field">
        <label for="product-brand">Marca del Producto:</label>
        <input type="text" id="product-brand" v-model="product.brand" placeholder="Ej: Pennzoil, Castrol" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="product-category">Categoría de Producto:</label>
        <select id="product-category" v-model="product.category">
          <option disabled value="">Selecciona una categoría</option>
          <option value="lubricantes">Lubricantes</option>
          <option value="repuestos">Repuestos</option>
        </select>
      </div>
      <div class="form-field">
        <label for="product-subcategory">Subcategoría de Producto:</label>
        <select id="product-subcategory" v-model="product.subcategory">
          <option disabled value="">Selecciona una subcategoría</option>
          <option value="sinteticos">Sintéticos</option>
          <option value="minerales">Minerales</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label for="product-units">Unidades de Medida:</label>
        <input type="text" id="product-units" v-model="product.units" placeholder="Ej: Litros, Unidad, Caja" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.form-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.5em;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
  margin-bottom: 20px;
  color: #333;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.form-field {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 250px;
}

label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  border-radius: 4px;
  font-size: 1em;
  transition: all 0.2s ease-in-out;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

textarea {
  resize: vertical;
  min-height: 80px;
}
</style>