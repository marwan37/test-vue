<template>
  <div
    class="flex flex-column align-center justify-center"
    style="min-height: 100vh; background-color: #f0f0f0; padding: 2rem">
    <h2 class="mb-8">AWS Exam Prep</h2>
    <div class="v-stack mb-8" style="width: 100%">
      <QuizStats
        :totalQuizzes="totalQuizzes"
        :totalCorrectAnswers="totalCorrectAnswers"
        :totalIncorrectAnswers="totalIncorrectAnswers"
        :accuracy="accuracy" />
      <PieChartComponent :data="pieChartData" />
      <Button
        label="Start Tutor Mode"
        @click="handleQuizStart('tutor')"
        class="p-button-success"
        style="width: 100%; max-width: 30rem" />
      <Button
        label="Start Timed Mode"
        @click="handleQuizStart('timed')"
        class="p-button-info"
        style="width: 100%; max-width: 30rem" />
    </div>
    <div style="width: 100%">
      <QuizHistory :quizHistory="quizHistory" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import type { QuizResult } from '@/types';
import QuizStats from '@/components/dashboard/QuizStats.vue';
import PieChartComponent from '@/components/dashboard/PieChartComponent.vue';
import QuizHistory from '@/components/dashboard/QuizHistory.vue';

const store = useStore();
const router = useRouter();

const quizHistory = computed(() => store.state.quizHistory);

const handleQuizStart = (mode: 'tutor' | 'timed') => {
  store.commit('setMode', mode);
  router.push('/Quiz');
};

const calculateStats = () => {
  const totalQuizzes = quizHistory.value.length;
  const totalCorrectAnswers = quizHistory.value.reduce(
    (sum: number, result: QuizResult) => sum + result.correctAnswers,
    0
  );
  const totalIncorrectAnswers = quizHistory.value.reduce(
    (sum: number, result: QuizResult) => sum + result.incorrectAnswers,
    0
  );
  const accuracy =
    totalQuizzes > 0
      ? (totalCorrectAnswers / (totalCorrectAnswers + totalIncorrectAnswers)) * 100
      : 0;

  return {
    totalQuizzes,
    totalCorrectAnswers,
    totalIncorrectAnswers,
    accuracy: accuracy.toFixed(2)
  };
};

const { totalQuizzes, totalCorrectAnswers, totalIncorrectAnswers, accuracy } = calculateStats();

const pieChartData = [
  { name: 'Correct', value: totalCorrectAnswers },
  { name: 'Incorrect', value: totalIncorrectAnswers }
];
</script>
