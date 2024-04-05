<template>
  <div class="p-4 rounded p-shadow-2 mb-4">
    <div class="flex items-center justify-between">
      <div class="font-bold">
        Correct answer{{ correctAnswers.length > 1 ? 's' : '' }}: {{ correctAnswers.join(', ') }}
      </div>
      <div class="flex items-center">
        <i class="pi pi-chart-bar mr-2"></i>
        <span>{{ percentageCorrect }}% answered correctly</span>
      </div>
      <div class="flex items-center">
        <i class="pi pi-clock mr-2"></i>
        <span>{{ timeSpent }} seconds</span>
      </div>
      <div class="flex items-center">
        <i class="pi pi-calendar mr-2"></i>
        <span>Last Updated: {{ lastUpdated }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AnswerStats',
  props: {
    correctAnswers: {
      type: Array as () => string[],
      required: true,
    },
    percentageCorrect: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
    },
    lastUpdated: {
      type: String,
      required: true,
    },
  },
});
</script>
