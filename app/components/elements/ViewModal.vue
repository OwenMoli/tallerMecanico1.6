<template>
  <DxPopup
    title="Detalles del Proveedor"
    :visible.sync="open"
    :show-close-button="true"
    :width="700"
    :height="500"
    @hiding="handlePopupHiding"
  >
    <template #content>
      <div>
        <DxForm
          v-if="open"
          :col-count="3"
          :form-data="localFormData"
          :read-only="true"
          label-location="top"
        >
          <template v-for="(item, index) in formItems" :key="index">
            <DxItem
              :data-field="item.dataField"
              :caption="item.caption"
              :col-span="item.colSpan"
            />
          </template>
        </DxForm>
        <div class="dx-form-buttons">
          <DxButton text="Cerrar" type="normal" @click="cancel" />
        </div>
      </div>
    </template>
  </DxPopup>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import { DxForm, DxItem } from 'devextreme-vue/form';
import DxButton from 'devextreme-vue/button';

interface FormItem {
  dataField: string;
  caption: string;
  colSpan?: number;
}

interface Props {
  open: boolean;
  initialFormData: any;
  formItems: FormItem[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open']);

const localFormData = ref({});

watch(
  () => props.initialFormData,
  (newVal) => {
    if (newVal) {
      localFormData.value = reactive({ ...newVal });
    }
  },
  { immediate: true }
);

const cancel = () => {
  emit('update:open', false);
};

const handlePopupHiding = () => {
  emit('update:open', false);
};
</script>

<style scoped>
.dx-form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
