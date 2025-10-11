<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-700"></h3>
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="(slot, index) in imageSlots"
        :key="index"
        class="image-slot"
        :class="{ 'filled': slot.url, 'empty': !slot.url }"
        @click="selectImage(index)"
      >
        <img v-if="slot.url" :src="slot.url" alt="Imagen del Vehículo" class="uploaded-image" />
        <div v-else class="empty-slot-content">
          <i class="i-heroicons-camera w-8 h-8 text-gray-400"></i>
          <span class="text-sm font-medium text-gray-500">ADD</span>
        </div>
        <input
          type="file"
          :ref="(el) => setFileInputRef(el, index)"
          class="hidden"
          accept="image/*"
          @change="onFileSelected($event, index)"
        />
        <button
          v-if="slot.url"
          class="remove-image-button"
          @click.stop="removeImage(index)"
        >
          <i class="i-heroicons-x-mark w-4 h-4 text-white">x</i>
        </button>
      </div>
    </div>

    <p v-if="receptionStore.carImages.length >= 3" class="text-green-600 text-sm mt-2">
      {{ receptionStore.carImages.length }} imágenes cargadas.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useReceptionStore } from '~/store/reception';

const receptionStore = useReceptionStore();

interface ImageSlot {
  url: string | null;
}

const imageSlots = ref<ImageSlot[]>(Array(6).fill(null).map(() => ({ url: null })));
const fileInputs = ref<HTMLInputElement[]>([]);

const setFileInputRef = (el: any, index: number) => {
  if (el) {
    fileInputs.value[index] = el as HTMLInputElement;
  }
};

onMounted(() => {
  receptionStore.carImages.forEach((imageUrl, index) => {
    // **CAMBIO:** Verificamos que el slot exista antes de asignar la URL.
    if (index < 6 && imageSlots.value[index]) {
      imageSlots.value[index].url = imageUrl;
    }
  });
});

watch(() => receptionStore.carImages, (newImages) => {
  imageSlots.value = Array(6).fill(null).map(() => ({ url: null }));
  newImages.forEach((url, index) => {
    // **CAMBIO:** Verificamos que el slot exista antes de asignar la URL.
    if (index < 6 && imageSlots.value[index]) {
      imageSlots.value[index].url = url;
    }
  });
}, { deep: true });

const selectImage = (index: number) => {
  // **CAMBIO:** Usamos la verificación `imageSlots.value[index]?.url`
  // para acceder de forma segura a la propiedad `url`.
  if (receptionStore.carImages.length >= 6 && !imageSlots.value[index]?.url) {
    alert('Ya has subido el número máximo de 6 imágenes.');
    return;
  }
  if (fileInputs.value[index]) {
    fileInputs.value[index].click();
  }
};

const onFileSelected = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      const imageUrl = e.target.result as string;

      // **CAMBIO:** Verificamos que el slot exista antes de actualizarlo.
      if (imageSlots.value[index]) {
        imageSlots.value[index].url = imageUrl;
      }

      const currentStoreImages = [...receptionStore.carImages];
      if (currentStoreImages[index] !== undefined && currentStoreImages[index] !== null) {
        currentStoreImages[index] = imageUrl;
      } else {
        const firstEmptyStoreIndex = currentStoreImages.findIndex(img => img === null || img === undefined);
        if (firstEmptyStoreIndex !== -1) {
          currentStoreImages[firstEmptyStoreIndex] = imageUrl;
        } else if (currentStoreImages.length < 6) {
          currentStoreImages.push(imageUrl);
        } else {
            alert('Límite de 6 imágenes alcanzado.');
            return;
        }
      }

      receptionStore.clearCarImages();
      currentStoreImages.filter(Boolean).forEach(img => receptionStore.addCarImage(img));
    }
  };
  reader.readAsDataURL(file);

  if (target) {
    target.value = '';
  }
};

const removeImage = (index: number) => {
  // **CAMBIO:** Verificamos que el slot exista antes de limpiar su URL.
  if (imageSlots.value[index]) {
    imageSlots.value[index].url = null;
  }

  const currentStoreImages = [...receptionStore.carImages];
  if (currentStoreImages[index] !== undefined && currentStoreImages[index] !== null) {
    currentStoreImages.splice(index, 1);
  }

  receptionStore.clearCarImages();
  currentStoreImages.filter(img => img !== null && img !== undefined).forEach(img => receptionStore.addCarImage(img));
};
</script>

<style scoped>
/* ... (estilos sin cambios) ... */
.image-slot {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

.image-slot.empty:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

.image-slot.filled {
  border: 1px solid #ddd;
}

.empty-slot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-image-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(220, 38, 38, 0.8);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  z-index: 10;
}

.remove-image-button:hover {
  background-color: rgb(220, 38, 38);
}
</style>
