<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()

const open = ref(false)

const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, 


{
  label: 'Operaciones',
  to: '/operations/',
  icon: 'i-lucide-briefcase',
  defaultOpen: false,
  type: 'trigger',
  children: [
    {
      label: 'Recepcion de Vehiculo',
      onSelect: () => {
        open.value = false
      },
      children: [
    {
      label: 'Recepcion y Diagnostico',
      to: '/operations/reception/clientSelect',
      onSelect: () => {
        open.value = false
      },
    },

      {
      label: 'Recepcion rapida',
      to: '/operations/reception/quickReception',
      onSelect: () => {
        open.value = false
      },
    },
  ]
    },
    {
      label: 'Listado Recepcion',
      to: '/operations/WorkSpaceBoss/BossMain',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Cotizaciones',
      to: '/operations/cotizacion/cotizacionMain',

      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Jefe Mecanico',
      to: '/operations/WorkSpaceBoss/chiefMechanicWorkSpace',

      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Productos',
      to: '/operations/AsignarMecanico/interfazMecanico',
      onSelect: () => {
        open.value = false
      }
    },
  ]
},





{
  label: 'Configuraciones',
  to: '/settings',
  icon: 'i-lucide-wrench',
  defaultOpen: false,
  type: 'trigger',
  children: [
    
    

    {
      label: 'General',
      to: '/settings',
      onSelect: () => {
        open.value = false
      },
    },

      {
      label: 'Sucursales',
      to: '/login',
      onSelect: () => {
        open.value = false
      },
    },

      {
      label: 'Mecanicos',
      to: '/settings/Directory/mechanics',
      onSelect: () => {
        open.value = false
      }
    },

      {
      label: 'proveedores',
      to: '/settings/Directory/suppliers',
      onSelect: () => {
        open.value = false
      }
    },

    {
      label: 'proveedores',
      to: '/settings/Directory/suppliers',
      onSelect: () => {
        open.value = false
      }
    },

    {
      label: 'productos',
      to: '/settings/inventory/productTable',
      onSelect: () => {
        open.value = false
      }
    },


      {
        label: 'Modelo de Vehiculo',
        to: '/settings/Directory/modelView',
        onSelect: () => {
          open.value = false
        }
      },

      {
        label: 'Tipos de Motor',
        to: '/operations/reception/carDetails',
        onSelect: () => {
          open.value = false
        }
      },

      {
        label: 'Tipos de Combustible',
        to: '/settings/Directory/',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'modelos',
        to: '/settings/Directory/modelView',
        onSelect: () => {
          open.value = false
        }
      },

      {
        label: 'marcas',
        to: '/settings/Directory/BrandView',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Servicios',
        to: '/settings/Directory/modelView',
        onSelect: () => {
          open.value = false
        }
      },
      {
        label: 'Marcas de productos',
        to: '/settings/Directory/modelView',
        onSelect: () => {
          open.value = false
        }
      },
  ]
},




{
  label: 'Opciones',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: false,
  type: 'trigger',
  children: [{
    label: 'Datos del Taller',
    to: '/settings/members',
    onSelect: () => {
      open.value = false
    }
  }, 

  {
    label: 'Usuarios y roles',
    to: '/settings/users',
    onSelect: () => {
      open.value = false
    },

  },

  {
    label: 'notificaciones',
    to: '/settings/notifications',
    onSelect: () => {
      open.value = false
    },

  },

  {
    label: 'Security',
    to: '/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-pro/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui-pro',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
