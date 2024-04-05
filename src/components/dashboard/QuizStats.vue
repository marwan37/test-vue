<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Quiz Stats</h2>
    <div class="flex justify-between mb-4">
      <p>Total Quizzes:</p>
      <strong>{{ totalQuizzes }}</strong>
    </div>
    <div class="flex justify-between mb-4">
      <p>Total Correct Answers:</p>
      <strong>{{ totalCorrectAnswers }}</strong>
    </div>
    <div class="flex justify-between mb-4">
      <p>Total Incorrect Answers:</p>
      <strong>{{ totalIncorrectAnswers }}</strong>
    </div>
    <div class="flex justify-between">
      <p>Accuracy:</p>
      <strong>{{ accuracy }}%</strong>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const totalQuizzes = computed(() => store.state.totalQuizzes);
const totalCorrectAnswers = computed(() => store.state.totalCorrectAnswers);
const totalIncorrectAnswers = computed(() => store.state.totalIncorrectAnswers);
const accuracy = computed(() => store.state.accuracy);
</script>
