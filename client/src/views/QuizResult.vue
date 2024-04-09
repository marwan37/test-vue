<template>
  <div class="quiz-result-container">
    <h1 class="text-center text-xl">Quiz Result</h1>
    <div class="grid">
      <!-- PieChart -->
      <div class="card flex-row">
        <PieChartComponent
          :labels="['Correct Answers', 'Incorrect Answers']"
          :data="[correctAnswers, incorrectAnswers]"
          :backgroundColors="['#38A169', '#E53E3E']"
          style="max-height: 400px">
          <!-- Using scoped slot for custom labels -->
          <template v-slot:default="{ data }">
            <div class="chart-center">
              <div class="chart-center-metric">{{ correctPercentage }}%</div>
              <div class="chart-center-label">Correct</div>
            </div>
          </template>
        </PieChartComponent>
        <PerformanceTable
          title="Your Score"
          :data="[
            { label: 'Total Correct', value: correctAnswers },
            { label: 'Total Incorrect', value: incorrectAnswers }
          ]" />
      </div>
    </div>
    <div class="card">
      <DataTable :value="answeredQuestions">
        <Column field="questionNumber" header="Question"></Column>
        <Column field="selectedAnswers" header="Your Answer"></Column>
        <Column field="correctAnswers" header="Correct Answer"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="difficulty" header="Difficulty"></Column>
        <Column header="Result">
          <template #body="{ data }">
            <i :class="[data.isCorrect ? 'pi pi-check' : 'pi pi-times']"></i>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import PieChartComponent from '@/components/performance/PieChartComponent.vue';
import PerformanceTable from '@/components/performance/PerformanceTable.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// QuizResultRow[]
const quizResultRows = computed(() => store.getters.latestQuizResult);

const correctAnswers = computed(() => quizResultRows.value.filter(row => row.isCorrect).length);
const incorrectAnswers = computed(() => quizResultRows.value.filter(row => !row.isCorrect).length);
const totalQuestions = computed(() => quizResultRows.value.length);
const correctPercentage = computed(() => ((correctAnswers / totalQuestions) * 100).toFixed(0));

const answeredQuestions = computed(() => {
  console.log('[QuizResult] quizResult', quizResult.value);
  if (!quizResult.value || !quizResult.value.questions) {
    console.warn('Quiz result or questions for quizResult is undefined.');
    return [];
  }
  return quizResultRows.value.map((row, index) => {
    const selectedAnswers = row.selectedOptions.map(option => option.text).join(', ');

    const correctAnswers = row.correctOptions.map(option => option.text).join(', ');

    return {
      questionNumber: index + 1,
      selectedAnswers,
      correctAnswers,
      category: row.question.category,
      difficulty: row.question.difficulty,
      isCorrect: row.isCorrect
    };
  });
});

onMounted(() => {
  if (!quizResult.value) {
    router.push('/');
  }
});
</script>

<style scoped>
/* Add styles */
</style>
