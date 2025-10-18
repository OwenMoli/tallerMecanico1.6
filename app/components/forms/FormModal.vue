<template>
  <div>
    <div v-if="visible"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
         @click.self="handleCancel">

      <div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <h2 class="mb-4 text-2xl font-bold">{{ title }}</h2>
        <DxValidationGroup ref="validationGroup">
          <component
            :is="formComponent"
            v-model="editableData"
            v-bind="formProps"
            :is-view-mode="isViewMode"
          />
        </DxValidationGroup>
        <div class="flex justify-end mt-6 space-x-3">
          <DxButton :text="isViewMode ? 'Cerrar' : 'Cancelar'" type="default" @click="handleCancel" />
          <DxButton v-if="!isViewMode" text="Guardar" type="success" @click="handleSave" />
        </div>
      </div>
    </div>

    <ConfirmationModal
      v-model:visible="isConfirmModalVisible"
      :title="confirmationTitle"
      :message="confirmationMessage"
      @confirmed="onConfirmSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DxButton } from 'devextreme-vue/button';
import { DxValidationGroup } from 'devextreme-vue/validation-group';
import ConfirmationModal from './ConfirmationModal.vue';

const props = defineProps<{
  visible: boolean;
  title: string;
  formComponent: object;
  formData: object | null;
  formProps?: object;
  isViewMode?: boolean;
  keyExpr: string;
}>();

const emit = defineEmits(['update:visible', 'save']);

const validationGroup = ref<InstanceType<typeof DxValidationGroup> | null>(null);
const editableData = ref<any>({});
const isConfirmModalVisible = ref(false);

const confirmationTitle = ref('');
const confirmationMessage = ref('');

watch(() => props.formData, (newVal) => {
  editableData.value = { ...(newVal || {}) };
}, { immediate: true, deep: true });

const handleSave = async () => {
  const validationResult = validationGroup.value!.instance!.validate();
  if (validationResult.isValid) {
    const isEditing = editableData.value && editableData.value[props.keyExpr];
    if (isEditing) {
      confirmationTitle.value = 'Confirmar Edición';
      confirmationMessage.value = `¿Estás seguro de que quieres guardar los cambios en el registro #${editableData.value[props.keyExpr]}?`;
    } else {
      confirmationTitle.value = 'Confirmar Creación';
      confirmationMessage.value = '¿Estás seguro de que quieres guardar este nuevo registro?';
    }
    isConfirmModalVisible.value = true;
  }
};

const onConfirmSave = () => {
  emit('save', editableData.value);
  handleCancel();
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>
