<!-- quiz/AnswerOption.vue -->
<template>
  <Button :class="[buttonClass, 'mb-2', 'custom-button']" :disabled="isSubmitted" @click="onClick">
    <template #default>
      <div class="flex space-x-2">
        <span class="label">{{ label }}.</span>
        <span class="text">{{ text }}</span>
      </div>
    </template>
  </Button>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import Button from 'primevue/button';

export default defineComponent({
  name: 'AnswerOption',
  components: {
    Button
  },
  props: {
    label: { type: String, required: true },
    text: { type: String, required: true },
    isSelected: { type: Boolean, required: true },
    isSubmitted: { type: Boolean, required: true },
    isCorrect: { type: Boolean, required: true },
    questionId: { type: String, required: true },
    optionIndex: { type: Number, required: true }
  },
  setup(props, { emit }) {
    const buttonClass = computed(() => {
      if (props.isSubmitted) {
        if (props.isCorrect) {
          return 'p-button-success';
        }
        if (props.isSelected) {
          return 'p-button-danger';
        }
        return 'p-button-secondary';
      }
      return props.isSelected ? ['p-button-secondary', 'selected'].join(' ') : 'p-button-outlined';
    });

    const onClick = () => {
      if (!props.isSubmitted) {
        emit('select-option', { questionId: props.questionId, optionIndex: props.optionIndex });
      }
    };

    return {
      buttonClass,
      onClick
    };
  }
});
</script>

<style scoped>
.custom-button {
  display: flex;
  justify-content: flex-start;
  text-align: left;
  transition: all 0.1s ease-in-out !important;
}

.p-button-secondary:hover,
.selected:hover {
  background-color: #b1b1b1 !important;
}

.p-button-secondary.selected {
  background-color: #b1b1b1 !important;
  outline: none !important;
  border: 1px solid #b1b1b1 !important;
  box-shadow: none !important;
}

.text {
  margin-left: 12px;
}
</style>
