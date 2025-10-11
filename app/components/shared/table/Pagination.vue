<!-- Generic data table pagination component -->
<script setup lang="ts">
defineProps<{
  totalRows: number
  selectedRows?: number
  pageIndex: number
  pageSize: number
  showSelection?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()
</script>

<template>
  <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
    <div v-if="showSelection" class="text-sm text-muted">
      {{ selectedRows }} of {{ totalRows }} row(s) selected.
    </div>
    <div v-else class="text-sm text-muted">
      {{ totalRows }} total row(s)
    </div>

    <div class="flex items-center gap-1.5">
      <UPagination
        :default-page="pageIndex + 1"
        :items-per-page="pageSize"
        :total="totalRows"
        @update:page="(p: number) => emit('update:page', p - 1)"
      />
    </div>
  </div>
</template>
