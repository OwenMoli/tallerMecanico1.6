<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number
  itemName?: string
  description?: string
  loading?: boolean
  onDelete?: () => Promise<void> | void
}>(), {
  count: 0,
  itemName: 'item',
  description: 'Are you sure? This action cannot be undone.',
  loading: false
})

const open = ref(false)

async function handleDelete() {
  if (typeof props.onDelete === 'function') {
    await props.onDelete()
  }
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} ${itemName}${count > 1 ? 's' : ''}`"
    :description="description"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          :loading="loading"
          @click="handleDelete"
        />
      </div>
    </template>
  </UModal>
</template>
