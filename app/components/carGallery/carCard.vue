<template>
  <div class="car-card">
    <div v-if="brandLogo" class="brand-label">
      <img :src="brandLogo" :alt="`Logo de la marca de ${carName}`" class="logo-image" />
    </div>

    <h2 class="car-title">{{ carName }}</h2>
    <p v-if="carSubtitle" class="car-subtitle">{{ carSubtitle }}</p>

    <img :src="carImage" :alt="`Imagen de ${carName}`" class="main-car-image" />

    <p class="car-type-label">
      <span>{{ carType }}</span>
    </p>
  </div>
</template>

<script setup>
// Las props cardWidth y cardHeight ya no son necesarias.
defineProps({
  carName: {
    type: String,
    required: true
  },
  carImage: {
    type: String,
    required: true
  },
  brandLogo: {
    type: String,
    default: null
  },
  carType: {
    type: String,
    required: true
  },
  carSubtitle: {
    type: String,
    default: null
  }
});
</script>

<style scoped>
.car-card {
  position: relative;
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-family: sans-serif;
  text-align: center;
}

.brand-label {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logo-image {
  width: 50px;
  height: auto;
}

.car-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
  margin-bottom: 5px;
}

.car-subtitle {
  font-size: 20px;
  color: #666;
  margin-top: 0;
  margin-bottom: 10px;
}

.main-car-image {
  width: 100%;
  height: auto;
  display: block;
}

.car-type-label {
  width: 100%;
  background-color: #666;
  color: #fff;
  padding: 5px 0;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
