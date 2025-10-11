<script setup lang="ts">
import type * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  title?: string
  description?: string
  buttonLabel?: string
  buttonIcon?: string
  schema?: z.ZodObject<any>
  fields?: Array<{ label: string, name: string, placeholder?: string, type?: string }>
  onSubmit?: (event: FormSubmitEvent<any>) => Promise<void> | void
  newItem?: () => void
}>()

const open = ref(false)
const state = reactive<{ data: any }>({ data: {} })
// const state = reactive<Record<string, any>>({})
function handleOpen() {
  if (typeof props.newItem === 'function') {
    state.data = props.newItem()
    console.log('New item state:', state.data)
  }
  open.value = true
}

function handleSubmit(event: FormSubmitEvent<any>) {
  if (typeof props.onSubmit === 'function') {
    props.onSubmit(event)
  }
  open.value = false
}
defineExpose({
  state,
  handleOpen
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
  >
    <UButton :label="buttonLabel" :icon="buttonIcon" @click="handleOpen" />
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <slot name="fields" :state="state" />
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
