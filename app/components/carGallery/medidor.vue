<template>
  <div class="medidor-container">
    <v-chart 
      class="medidor-chart" 
      :option="option"
      @mousedown="handleDragStart"
      @mousemove="handleDrag"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { use } from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

use([CanvasRenderer, GaugeChart]);

const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 0
  },
  unit: { // ✅ unidad (%, °C, etc.)
    type: String,
    default: '%'
  },
  type: { // ✅ tipo de medidor (gas, temp, aceite)
    type: String,
    default: 'default'
  }
});

const emit = defineEmits(['update:value']);

const isDragging = ref(false);
const localValue = ref(props.value);

watch(() => props.value, (newValue) => {
  localValue.value = newValue;
});

const option = computed(() => {
  // ✅ Definir colores según tipo
  let colorRanges = [
    [0.25, '#FF6E76'], // rojo
    [0.75, '#eeb600'], // naranja (antes amarillo)
    [1, '#58D9F9']     // azul
  ];

  // ✅ Si es temperatura, el rojo va a la derecha
  if (props.type === 'temperature') {
    colorRanges = [
      [0.75, '#58D9F9'], // azul primero
      [0.9, '#eeb600'],  // naranja en medio
      [1, '#FF6E76']     // rojo al final (derecha)
    ];
  }

  return {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: colorRanges
          }
        },
        axisLabel: { show: false },
        splitLine: { show: false },
        pointer: { itemStyle: { color: 'auto' } },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '70%'],
          formatter: `{value}${props.unit}`, // ✅ usa la unidad
          color: 'auto'
        },
        data: [{ value: localValue.value }]
      }
    ]
  };
});

const handleDragStart = () => {
  isDragging.value = true;
};

const handleDrag = (e) => {
  if (!isDragging.value) return;

  const chartRect = e.target.getBoundingClientRect();
  const centerX = chartRect.width / 2;
  const centerY = chartRect.height;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const angle = Math.atan2(mouseX - centerX, - (mouseY - centerY));
  const normalizedAngle = (angle + Math.PI) / Math.PI;

  const newValue = Math.max(0, Math.min(100, Math.round(normalizedAngle * 100)));

  localValue.value = newValue;
  emit('update:value', localValue.value);
};

const handleDragEnd = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.medidor-container {
  height: 250px;
  width: 250px;
}
.medidor-chart {
  height: 100%;
  width: 100%;
}
</style>
