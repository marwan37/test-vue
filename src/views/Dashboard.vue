<!-- views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h1 class="text-center text-xl">AWS Exam Prep</h1>
          <div class="flex justify-center mt-4">
            <Button
              label="Tutor"
              class="mr-4"
              @click="handleQuizStart('tutor')"
              style="width: 20%; max-width: 20rem" />
            <Button
              label="Timed"
              @click="handleQuizStart('timed')"
              style="width: 20%; max-width: 20rem" />
          </div>
        </div>
      </div>
      <div class="card">
        <QuizStats
          :totalQuizzes="totalQuizzes"
          :totalCorrectAnswers="totalCorrectAnswers"
          :totalIncorrectAnswers="totalIncorrectAnswers"
          :accuracy="accuracy" />
      </div>
      <div class="col-12 md:col-6">
        <div class="card">
          <PieChartComponent :data="pieChartData" />
        </div>
      </div>

      <div class="col-12">
        <div class="card">
          <QuizHistory :quizHistory="quizHistory" />
        </div>
      </div>
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
import Button from 'primevue/button';
import * as mutationTypes from '@/store/mutation-types';

const store = useStore();
const router = useRouter();

const quizHistory = computed(() => store.state.quizHistory);

const handleQuizStart = (mode: 'tutor' | 'timed') => {
  store.commit(mutationTypes.SET_MODE, mode);
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

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--surface-ground);
  padding: 2rem;
}

.card {
  background-color: var(--surface-card);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.text-center {
  text-align: center;
}
</style>
