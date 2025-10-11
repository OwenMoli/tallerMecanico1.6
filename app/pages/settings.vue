<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [[{
  label: 'General',
  icon: 'i-lucide-user',
  to: '/settings',
  exact: true
}, {
  label: 'Sucursales',
  icon: 'i-lucide-users',
  to: '/settings/branches'
}, {
  label: 'Clientes',
  icon: 'i-lucide-bell',
  to: '/settings/Directory/customers'
},

{
  label: 'Proveedores',
  icon: 'i-lucide-shield',
  to: '/settings/Directory/suppliers'
},
{
  label: 'Marcas de Vehiculos',
  icon: 'i-lucide-bell',
  to: '/settings/carSpecifications/brandCar'
},
{
  label: 'Modelo de Vehiculos',
  icon: 'i-lucide-bell',
  to: '/settings/carSpecifications/carModel'
},
{
  label: 'Detalles Tecnicos',
  icon: 'i-lucide-bell',
  type: 'trigger',
  children: [

      {
      label: 'Motores',
      icon: 'i-lucide-bell',
      to: '/settings/carSpecifications/engine'
    },
    {
      label: 'Combustible',
      icon: 'i-lucide-bell',
      to: '/settings/carSpecifications/fuel'
    },

  ]
},

{
  label: 'Inventario',
  icon: 'i-lucide-bell',
  defaultOpen: false,
  type: 'trigger',
  children: [

    {
      label: 'Categoria',
      icon: 'i-lucide-bell',
      to: '/settings/inventory/categorie',
      onSelect: () => {
        open.value = false
      }
    },

    {
      label: 'Servicios',
      icon: 'i-lucide-bell',
      to: '/settings/inventory/service',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Productos',
      icon: 'i-lucide-bell',
      to: '/settings/inventory/products',
      onSelect: () => {
        open.value = false
      }
    }

  ]
},

], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
  target: '_blank'
}, {
  label: 'Buy now',
  icon: 'i-lucide-shopping-cart',
  to: 'https://ui.nuxt.com/pro/purchase',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="settings" class="relative overflow-visible" :ui="{ body: 'lg:py-12' } ">
    <template #header>
      <UDashboardNavbar title="Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      
      <UDashboardToolbar class="!overflow-visible relative z-30">
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" orientation="horizontal" contentOrientation="vertical" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full px-4">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>