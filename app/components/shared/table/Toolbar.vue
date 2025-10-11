<!-- Generic table toolbar with search and filters -->
<script setup lang="ts">
import type { ShallowUnwrapRef } from 'vue'
import type { Table } from '@tanstack/vue-table'
import { upperFirst } from 'scule'

interface StatusOption {
  label: string
  value: string
}

const props = defineProps<{
  statusOptions?: StatusOption[]
  showStatusFilter?: boolean
  showDisplayOptions?: boolean
  showDeleteButton?: boolean
}>()

const emit = defineEmits(['update:globalFilter', 'update:statusFilter'])
const uTable = defineModel<ShallowUnwrapRef<{
  tableRef: Ref<HTMLTableElement | null, HTMLTableElement | null>
  tableApi: Table<any>
}> | null | undefined>('uTable')

const globalFilter = ref('')
const statusFilter = ref(props.statusOptions?.[0]?.value ?? 'all')

watch(globalFilter, (value) => {
  emit('update:globalFilter', value)
})

watch(statusFilter, (value) => {
  emit('update:statusFilter', value)
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-1.5">
    <UInput
      v-model="globalFilter"
      class="max-w-sm"
      icon="i-lucide-search"
      placeholder="Filter..."
    />

    <div class="flex flex-wrap items-center gap-1.5">
      <SharedActionsDeleteModal v-if="showDeleteButton" :count="uTable?.tableApi?.getFilteredSelectedRowModel().rows.length">
        <UButton
          v-if="uTable?.tableApi?.getFilteredSelectedRowModel().rows.length"
          label="Delete"
          color="error"
          variant="subtle"
          icon="i-lucide-trash"
        >
          <template #trailing>
            <UKbd>
              {{ uTable?.tableApi?.getFilteredSelectedRowModel().rows.length }}
            </UKbd>
          </template>
        </UButton>
      </SharedActionsDeleteModal>

      <USelect
        v-if="showStatusFilter && statusOptions?.length"
        v-model="statusFilter"
        :items="statusOptions"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        placeholder="Filter status"
        class="min-w-28"
      />
      <UDropdownMenu
        v-if="showDisplayOptions"
        :items="uTable?.tableApi
          ?.getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => ({
            label: upperFirst(column.id),
            type: 'checkbox' as const,
            checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
              uTable?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
            },
            onSelect(e?: Event) {
              e?.preventDefault()
            }
          }))
        "
        :content="{ align: 'end' }"
      >
        <UButton
          label="Display"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-settings-2"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
