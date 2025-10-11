<template>
  <div>
    <div class="horizontal-menu-container">
      <div
        v-for="item in items"
        :key="item.id"
        :class="{
          'menu-item': true,
          'active': item.id === activeItem,
        }"
        @click="setActiveItem(item.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <hr />

    <div v-if="displayedCars.length > 0" class="car-gallery">
      <div
        v-for="car in displayedCars"
        :key="car.id"
        class="placeholder-card"
        @click="selectCar(car)"
      >
        <h2 class="placeholder-title">{{ car.carName }}</h2>
        <p class="placeholder-brand">{{ car.brandName }}</p>
        <img :src="car.carImage" :alt="car.carName" class="placeholder-image" />
        <p class="placeholder-subtitle">{{ car.carSubtitle }}</p>
        </div>
    </div>
    <div v-else class="no-cars-message">
      No hay autos disponibles para esta marca.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

const emits = defineEmits(['update:brand', 'select-car']);

const carsByBrand = {
  1: [
    { id: 1, brandId: 1, carName: 'Corolla', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: 'Sedan', transmission: 'Automática', traction: 'Delantera (FWD)', fuel: 'Gasolina' },
    { id: 2, brandId: 1, carName: 'RAV4', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: 'SUV', transmission: 'Automática', traction: 'Integral (AWD)', fuel: 'Gasolina' },
    { id: 3, brandId: 1, carName: 'Camry', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: 'Sedan', transmission: 'Automática', traction: 'Delantera (FWD)', fuel: 'Híbrido' },
    { id: 4, brandId: 1, carName: 'Land Cruiser', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: '4x4', transmission: 'Automática', traction: '4x4 (4WD)', fuel: 'Diésel' },
    { id: 5, brandId: 1, carName: 'Land Cruiser', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: '4x4', transmission: 'Automática', traction: '4x4 (4WD)', fuel: 'Diésel' },
    { id: 6, brandId: 1, carName: 'Land Cruiser', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: '4x4', transmission: 'Automática', traction: '4x4 (4WD)', fuel: 'Diésel' },
    { id: 7, brandId: 1, carName: 'Land Cruiser', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: '4x4', transmission: 'Automática', traction: '4x4 (4WD)', fuel: 'Diésel' },
    { id: 8, brandId: 1, carName: 'Land Cruiser', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: '4x4', transmission: 'Automática', traction: '4x4 (4WD)', fuel: 'Diésel' },
    { id: 9, brandId: 1, carName: 'Land Cruiser', brandName: 'Toyota', carImage: 'https://images.dealer.com/ddc/vehicles/2025/Toyota/Tacoma/Truck/still/front-left/Underground-1L7-61,68,74-640-en_US.jpg', carSubtitle: '4x4', transmission: 'Automática', traction: '4x4 (4WD)', fuel: 'Diésel' },
  ],
  2: [
    { id: 9, brandId: 2, carName: 'GT-R', brandName: 'Nissan', carImage: 'https://www.nissan-cdn.net/content/dam/Nissan/global/vehicles/gt-r/r35/2021/gallery/nissan-gt-r-50th-anniversary-edition-front-angle-view.jpg.ximg.l_full_m.smart.jpg', carSubtitle: 'Deportivo', transmission: 'Automatizada (ASG/DSG)', traction: 'Integral (AWD)', fuel: 'Gasolina' },
    { id: 10, brandId: 2, carName: 'Kicks', brandName: 'Nissan', carImage: 'https://images.nissan-cdn.net/content/dam/Nissan/us/vehicles/kicks/2025/25-nissan-kicks-sr-monarch-sky-red-pearl.jpg.ximg.l_full_m.smart.jpg', carSubtitle: 'SUV', transmission: 'CVT (Transmisión Variable Continua)', traction: 'Delantera (FWD)', fuel: 'Gasolina' },
  ],
  3: [
    { id: 12, brandId: 3, carName: 'Tucson', brandName: 'Hyundai', carImage: 'https://hips.hearstapps.com/hmg-prod/images/hyundai-tucson-2024-1698717909.jpg', carSubtitle: 'SUV', transmission: 'Automática', traction: 'Integral (AWD)', fuel: 'Diésel' },
  ],
  4: [
    { id: 14, brandId: 4, carName: 'Sorento', brandName: 'Kia', carImage: 'https://www.kia.com/content/dam/kwcms/gt/en/images/showroom/sorento_hev/discover/Kia-Sorento-HEV-PHEV-Discover-KV-H.jpg', carSubtitle: 'SUV', transmission: 'Automática', traction: 'Delantera (FWD)', fuel: 'Híbrido' },
  ],
  5: [
    { id: 18, brandId: 5, carName: 'CX-5', brandName: 'Mazda', carImage: 'https://www.mazda.es/globalassets/mazda-motor-espana/vehiculos/mazda-cx-5/2024-cx-5-rde-e_skyactiv-g-165-2024_soul-red-crystal.png', carSubtitle: 'SUV', transmission: 'Automática', traction: 'Delantera (FWD)', fuel: 'Gasolina' },
  ],
  6: [
    { id: 19, brandId: 6, carName: 'Blazer', brandName: 'Chevrolet', carImage: 'https://www.chevrolet.com.ar/content/dam/chevrolet/south-america/argentina/espanol/index/suvs/2024-blazer/mov/01-images/blazer-slider-24.jpg?imwidth=960', carSubtitle: 'SUV', transmission: 'Automática', traction: 'Delantera (FWD)', fuel: 'Gasolina' },
  ],
  7: [
    { id: 20, brandId: 7, carName: 'Explorer', brandName: 'Ford', carImage: 'https://img.goraymi.com/2024/02/09/Ford_Explorer_e_i_1920_q75_w1920_h1080_e.jpg', carSubtitle: 'SUV', transmission: 'Automática', traction: 'Integral (AWD)', fuel: 'Gasolina' },
  ],
  8: [
    { id: 21, brandId: 8, carName: 'Civic', brandName: 'Honda', carImage: 'https://www.honda.es/cars/new/civic-hatchback/overview/_jcr_content/par/column_control/column_2/image.res/civic_fl_overview_1_16_9_1920x1080.jpg/1698242488730.jpg', carSubtitle: 'Sedan', transmission: 'CVT (Transmisión Variable Continua)', traction: 'Delantera (FWD)', fuel: 'Gasolina' },
  ],
  9: [
    { id: 22, brandId: 9, carName: 'L200', brandName: 'Mitsubishi', carImage: 'https://www.mitsubishi-motors.es/images/cms/7279_6814_1_21123.webp', carSubtitle: 'Pickup', transmission: 'Manual', traction: '4x4 (4WD)', fuel: 'Diésel' },
  ],
  10: [
    { id: 23, brandId: 10, carName: 'Swift', brandName: 'Suzuki', carImage: 'https://cdn.suzuki.co.jp/car/swift/img/exterior_02.jpg', carSubtitle: 'Hatchback', transmission: 'Manual', traction: 'Delantera (FWD)', fuel: 'Gasolina' },
  ],
};

const items = ref([
  { id: 1, name: 'Toyota' },
  { id: 2, name: 'Nissan' },
  { id: 3, name: 'Hyundai' },
  { id: 4, name: 'Kia' },
  { id: 5, name: 'Mazda' },
  { id: 6, name: 'Chevrolet' },
  { id: 7, name: 'Ford' },
  { id: 8, name: 'Honda' },
  { id: 9, name: 'Mitsubishi' },
  { id: 10, name: 'Suzuki' },
]);

const activeItem = ref(1);

const setActiveItem = (id) => {
  activeItem.value = id;
};

const displayedCars = computed(() => {
  return carsByBrand[activeItem.value] || [];
});

const selectCar = (car) => {
  emits('select-car', car);
};
</script>

<style scoped>
/*
 * Se eliminó el bloque .car-specs y se mantuvieron los demás estilos.
 */
.horizontal-menu-container {
  display: flex;
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
}

.horizontal-menu-container::-webkit-scrollbar {
  display: none;
}

.menu-item {
  padding: 1rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 0 4px;
}

.menu-item:hover {
  background-color: #555;
  color: #fff;
}

.menu-item.active {
  background-color: #16a34a;
  color: #fff;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.menu-item.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #16a34a;
}

.car-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.placeholder-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  text-align: center;
  padding: 15px;
  cursor: pointer;
}

.placeholder-card:hover {
  border-color: rgb(39, 199, 124);
  border-width: 2px;
}

.placeholder-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px;
}

.placeholder-brand {
  font-size: 16px;
  color: #666;
  margin: 0 0 10px;
  font-weight: bold;
}

.placeholder-image {
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: 10px;
}

.placeholder-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.no-cars-message {
  text-align: center;
  margin-top: 50px;
  font-size: 1.5rem;
  color: #666;
}

@media (max-width: 1200px) {
  .car-gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .car-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .car-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
