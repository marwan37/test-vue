<template>
  <Button
    :label="label + '. ' + text"
    :class="buttonClass"
    :disabled="isSubmitted"
    @click="onClick" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import * as mutationTypes from '@/store/mutation-types';

export default defineComponent({
  name: 'AnswerOption',
  components: {
    Button
  },
  props: {
    label: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    isSubmitted: {
      type: Boolean,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    questionId: {
      type: String,
      required: true
    },
    optionIndex: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const store = useStore();

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
      return props.isSelected ? 'p-button-secondary' : 'p-button-outlined';
    });

    const onClick = () => {
      if (!props.isSubmitted) {
        store.commit(mutationTypes.SELECT_ANSWER, {
          questionId: props.questionId,
          optionIndex: props.optionIndex
        });
      }
    };

    return {
      buttonClass,
      onClick
    };
  }
});
</script>
