<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const items: BreadcrumbItem[] = [
  {
    label: 'Clientes',
    to: '/operations/reception/clientSelect'
  },
  {
    label: 'Vehiculo',
    to: '/operations/reception/vehicleReception'
  },
  {
    label: 'Chequeo',
    to: '/operations/reception/carCheck'
  },
  {
    label: 'Detalles',
    to: '/operations/reception/carDetails'
  }
]
</script>

<template>
  <UBreadcrumb :items="items">
    <template #separator>
      <span class="mx-2 text-muted">/</span>
    </template>
  </UBreadcrumb>
</template>

