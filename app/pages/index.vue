<script setup lang="ts">
import { sub } from 'date-fns';
import type { DropdownMenuItem } from '@nuxt/ui';
import type { Period, Range } from '~/types';
import ReceptionTypeModal from '~/components/clientReception/receptionTypeModal.vue';

const { isNotificationsSlideoverOpen } = useDashboard();

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][];

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
});
const period = ref<Period>('daily');

const isModalOpen = ref(false);

const handleReceptionTypeSelected = (type: string) => {
  console.log('Tipo de recepción seleccionado:', type);
  isModalOpen.value = false;
};
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>
          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
          <UButton
            icon="i-heroicons-plus-circle"
            label="Nueva Recepción"
            @click="isModalOpen = true"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ms-1" />
          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>
    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>

  <ReceptionTypeModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    @select="handleReceptionTypeSelected"
  />
</template>
