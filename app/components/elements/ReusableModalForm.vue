<template>
  <DxPopup
    :title="title"
    :visible.sync="open"
    :show-close-button="true"
    :width="700"
    :height="500"
    @hiding="handlePopupHiding"
  >
    <template #content>
      <form v-if="modalType !== 'view'" @submit.prevent="handleSubmit">
        <DxForm
          v-if="open"
          :col-count="3"
          :form-data="localFormData"
          ref="formRef"
          label-location="top"
        >
          <template v-for="(item, index) in formItems" :key="index">
            <DxItem
              :data-field="item.dataField"
              :caption="item.caption"
              :col-span="item.colSpan"
              :editor-type="item.editorType"
              :editor-options="item.editorOptions"
            >
              <template v-if="item.validationRules">
                <template v-for="(rule, i) in item.validationRules" :key="i">
                  <DxRequiredRule v-if="rule.type === 'required'" :message="rule.message" />
                  <DxPatternRule v-if="rule.type === 'pattern'" :pattern="rule.pattern" :message="rule.message" />
                  <DxEmailRule v-if="rule.type === 'email'" :message="rule.message" />
                  <DxStringLengthRule v-if="rule.type === 'stringLength'" :max="rule.max" :message="rule.message" />
                </template>
              </template>
            </DxItem>
          </template>
        </DxForm>

        <div class="dx-form-buttons">
          <DxButton text="Cancelar" type="normal" @click="cancel" />
          <DxButton
            v-if="modalType === 'add'"
            text="Crear"
            type="success"
            :use-submit-behavior="true"
          />
          <DxButton
            v-if="modalType === 'edit'"
            text="Guardar Cambios"
            type="success"
            :use-submit-behavior="true"
          />
        </div>
      </form>

      <div v-if="modalType === 'view'">
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
import {
  DxRequiredRule,
  DxPatternRule,
  DxEmailRule,
  DxStringLengthRule,
} from 'devextreme-vue/data-grid';

interface FormItem {
  dataField: string;
  caption: string;
  colSpan?: number;
  editorType?: string;
  editorOptions?: any;
  validationRules?: any[];
}

interface Props {
  open: boolean;
  modalType: 'add' | 'edit' | 'view';
  title: string;
  initialFormData?: any;
  formItems: FormItem[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:open', 'form-submitted']);

const formRef = ref<any>(null);
const localFormData = ref({});

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      localFormData.value = reactive({ ...props.initialFormData });
    }
  }
);

watch(
  () => props.initialFormData,
  (newVal) => {
    localFormData.value = reactive({ ...newVal });
  }
);

const handleSubmit = () => {
  const result = formRef.value.instance.validate();
  if (result.isValid) {
    emit('form-submitted', localFormData.value);
  } else {
    // Aquí puedes agregar una notificación de error si es necesario
    console.error('Error de validación');
  }
};

const cancel = () => {
  emit('update:open', false);
};

const handlePopupHiding = () => {
  if (formRef.value) {
    formRef.value.instance.resetValues();
  }
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
