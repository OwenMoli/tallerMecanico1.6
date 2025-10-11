<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { FormState, ProductCategory } from '~/types'

const addModal = useTemplateRef('addModal')

const schema = z.object({
  description: z.string().min(2, 'Too short').max(255, 'Too long'),
  order: z.number().min(1, 'Order must be at least 1')
})

function handleSubmit(event: FormSubmitEvent<ProductCategory>) {
  // You can replace this with your actual logic
  const { description } = event.data
  useToast().add({ title: 'Success', description: `New category ${description} added`, color: 'success' })
}

function newCategory() {
  return {
    description: '',
    order: 1
  } as Partial<ProductCategory>
}
</script>

<template>
  <SharedActionsAddModal
    ref="addModal"
    title="New category"
    description="Add a new category to your catalog."
    button-label="New category"
    button-icon="i-lucide-plus"
    :schema="schema"
    :on-submit="handleSubmit"
    :new-item="newCategory"
  >
    <template #fields="{ state }: FormState<ProductCategory>">
      <UFormField label="Description" placeholder="Category name" name="description">
        <UInput v-model="state.data.description" class="w-full" />
      </UFormField>
      <UFormField label="Order" placeholder="1" name="order">
        <UInput v-model="state.data.order" class="w-full" type="number" />
      </UFormField>
    </template>
  </SharedActionsAddModal>
</template>
