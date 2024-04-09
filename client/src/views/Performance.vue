<!-- views/Performance.vue -->
<template>
  <div class="performance">
    <h1 class="text-center text-xl">Performance</h1>
    <div v-if="quizHistory === null" class="text-center">Loading...</div>
    <div v-else-if="quizHistory && quizHistory.length === 0" class="text-center">
      No data available.
    </div>
    <div v-else class="grid">
      <!-- PieChart #1 -->
      <div class="card flex-row">
        <PieChartComponent
          :labels="['Correct Answers', 'Incorrect Answers', 'Omitted Answers']"
          :data="[stats.totalCorrect, stats.totalIncorrect, stats.totalOmitted]"
          :backgroundColors="['#38A169', '#E53E3E', '#4299E1']"
          style="max-height: 400px">
          <!-- Using scoped slot for custom labels -->
          <template v-slot:default="{ data }">
            <div class="chart-center">
              <div class="chart-center-metric">{{ stats.correctPercentage }}%</div>
              <div class="chart-center-label">Correct</div>
            </div>
          </template>
        </PieChartComponent>
        <PerformanceTable
          title="Your Score"
          :data="[
            { label: 'Total Correct', value: stats.totalCorrect },
            { label: 'Total Incorrect', value: stats.totalIncorrect },
            { label: 'Total Omitted', value: stats.totalOmitted }
          ]" />
      </div>
      <!-- PieChart #2 -->
      <div class="card flex-row">
        <PieChartComponent
          :labels="['Used Questions', 'Unused Questions', 'Total Questions']"
          :data="[
            stats.usedQuestions,
            stats.totalQuestions - stats.usedQuestions,
            stats.totalQuestions
          ]"
          :backgroundColors="['#4299E1', '#EAEAEA', '#888']"
          style="max-height: 400px">
          <!-- Using scoped slot for custom labels -->
          <template v-slot:default="{ data }">
            <div class="chart-center">
              <div class="chart-center-metric">{{ stats.usedQuestionsPercentage }}%</div>
              <div class="chart-center-label">Used</div>
            </div>
          </template>
        </PieChartComponent>
        <PerformanceTable
          title="QBank Usage"
          :data="[
            { label: 'Used Questions', value: stats.usedQuestions },
            { label: 'Unused Questions', value: stats.totalQuestions - stats.usedQuestions },
            { label: 'Total Questions', value: stats.totalQuestions }
          ]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import type { QuizResult } from '../types';
import PieChartComponent from '@/components/performance/PieChartComponent.vue';
import PerformanceTable from '@/components/performance/PerformanceTable.vue';
import * as actions from '@/store/constants/actions';

const store = useStore();

const quizHistory = computed(() => store.state.quizHistory);
const totalQuestions = computed(() => store.getters.totalQuestions);
const usedQuestionIds = computed(() => store.getters.usedQuestionIds);

const stats = reactive({
  totalQuizzes: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  totalOmitted: 0,
  correctPercentage: '0',
  usedQuestionsPercentage: '0',
  usedQuestions: 0,
  totalQuestions: 0
});

const calculateStats = () => {
  const quizzes = quizHistory.value;
  stats.totalQuizzes = quizzes && quizzes.length;
  if (!stats.totalQuizzes) {
    stats.totalCorrect = 0;
    stats.totalIncorrect = 0;
    stats.totalOmitted = 0;
    stats.correctPercentage = '0';
    stats.usedQuestionsPercentage = '0';
    stats.usedQuestions = 0;
    stats.totalQuestions = 0;
    return;
  }

  stats.totalCorrect = quizzes.reduce(
    (sum: number, result: QuizResult) => sum + result.correctAnswers,
    0
  );
  stats.totalIncorrect = quizzes.reduce(
    (sum: number, result: QuizResult) => sum + result.incorrectAnswers,
    0
  );
  stats.totalOmitted = quizzes.reduce(
    (sum: number, result: QuizResult) => sum + result.omittedAnswers,
    0
  );

  const totalAnswers = stats.totalCorrect + stats.totalIncorrect + stats.totalOmitted;
  stats.correctPercentage =
    totalAnswers > 0 ? ((stats.totalCorrect / totalAnswers) * 100).toFixed(0) : '0';

  stats.usedQuestions = usedQuestionIds.value.length;
  stats.totalQuestions = totalQuestions.value;
  stats.usedQuestionsPercentage =
    stats.totalQuestions > 0
      ? ((stats.usedQuestions / stats.totalQuestions) * 100).toFixed(0)
      : '0';
};

onMounted(async () => {
  if (store.state.quizHistory === null) {
    await store.dispatch(actions.FETCH_QUIZ_HISTORY);
  }

  if (store.getters.totalQuestions === 0) {
    await store.dispatch(actions.FETCH_QUESTIONS);
  }
  console.log(store.state.questions);
  console.log('[Performance] quizHistory', stats.totalQuestions);
  calculateStats();
});

watch(
  () => [store.state.quizHistory, store.state.questions],
  () => {
    calculateStats();
  }
);
</script>

<style scoped>
.performance {
  max-width: 100%;
  height: 100vh;
  margin: 0;
  padding: 2rem;
}

.card {
  background-color: var(--surface-card);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card.flex-row {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.card.flex-row > * {
  flex: 1;
  margin: 0 1rem;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  text-align: center;
}

.chart-center-metric {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.chart-center-label {
  font-size: 18px;
  color: #888;
}

.text-center {
  text-align: center;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #888;
}
</style>
