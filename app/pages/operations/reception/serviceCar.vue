<template>
  <div class="job-card">
    <div class="job-card-header">
      <span class="job-title">{{ job.name }}</span>
      <button @click="$emit('remove')" class="remove-job-button">×</button>
    </div>
    <div class="job-card-body">
      <div class="job-info-row">
        <p><strong>Costo del Servicio:</strong> L.{{ job.serviceCost }}</p>
        <p><strong>Duración Estimada:</strong> {{ job.duration }}</p>
      </div>

      <div class="parts-section">
        <div class="part-item" v-for="(part, pIndex) in job.parts" :key="pIndex">
          <div class="part-header">
            <span class="font-semibold">{{ part.name }}</span>
            <div class="flex items-center gap-1">
              <input
                v-model="job.parts[pIndex].quantity"
                type="number"
                min="1"
                class="w-16"
                placeholder="Cant"
              />
              <input
                v-model="job.parts[pIndex].price"
                type="number"
                min="0"
                class="w-24"
                placeholder="Precio"
              />
              <input type="checkbox" v-model="job.parts[pIndex].customerProvided" class="h-4 w-4 text-green-600 rounded" />
              <span class="text-sm">trae producto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['remove']);
</script>

<style scoped>
.job-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.job-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}
.remove-job-button {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.job-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}
.parts-section {
  margin-top: 15px;
}
.part-item {
  margin-bottom: 10px;
}
.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex.items-center.gap-1 input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
}
</style>
