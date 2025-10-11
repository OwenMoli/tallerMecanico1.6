<!-- Generic data table component -->
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel, type ColumnPinningState, type VisibilityState } from '@tanstack/table-core'

defineProps<{
  data: any[]
  loading?: boolean
  columns: TableColumn<any>[]
  // columnVisibility?: Record<string, boolean>
  // globalFilter?: string
}>()

const columnVisibility = defineModel<VisibilityState>('columnVisibility')
const globalFilter = defineModel<string>('globalFilter')
const columnPinning = defineModel<ColumnPinningState>('columnPinning')

const uTable = useTemplateRef('uTable')
const uRowSelection = ref()
const uPagination = ref({
  pageIndex: 0,
  pageSize: 10
})

defineExpose({
  uTable,
  uRowSelection,
  uPagination
})
</script>

<template>
  <div>
    <UTable
      ref="uTable"
      v-model:row-selection="uRowSelection"
      v-model:pagination="uPagination"
      :column-visibility="columnVisibility"
      :global-filter="globalFilter"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="shrink-0"
      :data="data"
      :columns="columns"
      :loading="loading"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-dashed border-default'
      }"
      :column-pinning="columnPinning"
    />
  </div>
</template>
