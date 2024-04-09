<template>
  <div class="p-card p-4 rounded-lg shadow-lg my-6 bg-white">
    <div class="flex flex-col md:flex-row items-center justify-between text-sm md:text-base">
      <div class="font-semibold mb-2 md:mb-0">
        Correct answer{{ correctAnswers.length > 1 ? 's' : '' }}: {{ correctAnswers.join(', ') }}
      </div>
      <div class="flex items-center mb-2 md:mb-0">
        <i class="pi pi-chart-bar mr-2 text-xl"></i>
        <span>{{ percentageCorrect }}% answered correctly</span>
      </div>
      <div class="flex items-center mb-2 md:mb-0">
        <i class="pi pi-clock mr-2 text-xl"></i>
        <span>{{ timeSpent }} seconds</span>
      </div>
      <div class="flex items-center">
        <i class="pi pi-calendar mr-2 text-xl"></i>
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
      required: true
    },
    percentageCorrect: {
      type: Number,
      required: true
    },
    timeSpent: {
      type: Number,
      required: true
    },
    lastUpdated: {
      type: String,
      required: true
    }
  }
});
</script>
