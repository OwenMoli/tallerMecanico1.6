<script setup lang="ts">
import type { ProductCategory } from '~/types'

const sTableComponent = useTemplateRef('sTableComponent')
const globalFilter = ref('')
const statusFilter = ref('all')
const columnVisibility = ref({ uuid: false })

const { data, status } = await useFetch<ProductCategory[]>('/api/products/categories', {
  lazy: true
})

const { columns, columnPinning } = useProductCategories({
  UButton: resolveComponent('UButton'),
  UBadge: resolveComponent('UBadge'),
  UDropdownMenu: resolveComponent('UDropdownMenu'),
  UCheckbox: resolveComponent('UCheckbox')
})

watch(() => statusFilter.value, (newVal: string) => {
  if (!sTableComponent?.value?.uTable?.tableApi) return

  const statusColumn = sTableComponent.value.uTable.tableApi.getColumn('status')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})
</script>

<template>
  <UDashboardPanel id="products-category">
    <template #header>
      <UDashboardNavbar title="Categories">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <ProductsCategoryAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <SharedTableToolbar
        :status-options="[
          { label: 'All', value: 'all' },
          { label: 'Visible', value: 'visible' },
          { label: 'Hidden', value: 'hidden' }
        ]"
        :u-table="sTableComponent?.uTable"
        :show-status-filter="true"
        :show-display-options="true"
        :show-delete-button="true"
        @update:global-filter="(value: string) => globalFilter = value"
        @update:status-filter="(value: string) => statusFilter = value"
      />

      <SharedTable
        ref="sTableComponent"
        :data="data || []"
        :loading="status === 'pending'"
        :columns="columns"
        :column-visibility="columnVisibility"
        :global-filter="globalFilter"
        :column-pinning="columnPinning"
      />

      <SharedTablePagination
        :total-rows="sTableComponent?.uTable?.tableApi.getFilteredRowModel().rows.length || 0"
        :selected-rows="sTableComponent?.uTable?.tableApi.getFilteredSelectedRowModel().rows.length || 0"
        :page-index="sTableComponent?.uTable?.tableApi.getState().pagination.pageIndex || 0"
        :page-size="sTableComponent?.uTable?.tableApi.getState().pagination.pageSize || 10"
        :show-selection="true"
        @update:page="(p: number) => sTableComponent?.uTable?.tableApi?.setPageIndex(p)"
      />
    </template>
  </UDashboardPanel>
</template>
