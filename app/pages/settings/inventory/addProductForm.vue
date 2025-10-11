<template>
  <div class="product-form-container">
    <h2 class="form-title">Agregar nuevo Producto</h2>

    <ProductDetails :product="product" />

    <InventoryLots :lots="product.lots" @add-lot="addLot" @remove-lot="removeLot" />

    <div class="form-actions">
      <button @click="cancel" class="cancel-button">Cancelar</button>
      <button @click="saveProduct" class="add-product-button">Agregar</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import ProductDetails from '~/components/settings/productsDetails.vue';
import InventoryLots from '~/components/settings/InventoryLots.vue';

const product = reactive({
  name: '',
  description: '',
  provider: '',
  brand: '',
  category: '',
  subcategory: '',
  units: '',
  lots: [],
});

const addLot = (newLot) => {
  product.lots.push({ ...newLot });
  product.lots.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const removeLot = (index) => {
  product.lots.splice(index, 1);
};

const saveProduct = async () => {
  try {
    console.log('Datos listos para enviar:', product);
    alert('Producto guardado exitosamente. Datos en la consola.');
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    alert('Ocurrió un error al guardar el producto.');
  }
};

const cancel = () => {
  console.log('Operación cancelada.');
  Object.assign(product, {
    name: '',
    description: '',
    provider: '',
    brand: '',
    category: '',
    subcategory: '',
    units: '',
    lots: [],
  });
};
</script>

<style scoped>
.product-form-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f7f7f7;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.form-title {
  text-align: center;
  font-size: 2.2em;
  margin-bottom: 30px;
  color: #000000; 
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;
}

.cancel-button:hover {
  background-color: #c0392b;
}

.add-product-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;
}

.add-product-button:hover {
  background-color: #45a049;
}
</style>