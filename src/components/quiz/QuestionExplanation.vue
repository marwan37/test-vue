<template>
  <div class="flex flex-col space-y-2 p-3">
    <div class="font-bold">Explanation:</div>
    <div v-for="(option, index) in options" :key="option.id" class="p-2">
      <span class="font-bold">Choice {{ labels[index] }}: </span>
      {{ option.explanation }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export default defineComponent({
  name: 'QuestionExplanation',
  props: {
    options: {
      type: Array as PropType<Option[]>,
      required: true
    },
    labels: {
      type: Array as () => string[],
      required: true
    }
  }
});
</script>
