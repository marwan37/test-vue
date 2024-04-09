<template>
  <div class="previous-tests-container">
    <h1 class="text-center text-xl">Previous Tests</h1>

    <!-- quizHistory is null (unloaded) -->
    <div v-if="quizHistory === null" class="text-center">Loading...</div>
    <!-- quizHistory is loaded but empty -->
    <div v-else-if="quizHistory && quizHistory.length === 0" class="text-center">
      No previous tests available.
    </div>

    <!-- Data loaded and available -->
    <DataTable v-else :value="quizHistory">
      <Column field="testName" header="Test Name"></Column>
      <Column field="timestamp" header="Date" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.timestamp) }}
        </template>
      </Column>
      <Column field="mode" header="Mode" sortable></Column>
      <Column field="correct" header="Correct" :body="percentageTemplate" sortable></Column>
      <Column field="incorrect" header="Incorrect" :body="percentageTemplate" sortable></Column>
      <Column field="omitted" header="Omitted" sortable></Column>
      <Column body="actionTemplate" header="Action"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';
import * as actions from '@/store/constants/actions';

const store = useStore();
const quizHistory = computed(() => {
  console.log('[PreviousTests] quizHistory', store.state.quizHistory);
  if (store.state.quizHistory === null) {
    return [];
  }
  return store.state.quizHistory.map((result, index) => ({
    testName: `Test ${index + 1}`,
    correct: result.correctAnswers || 0,
    incorrect: result.incorrectAnswers || 0,
    omitted: result.omittedAnswers || 0,
    timestamp: result.timestamp,
    mode: result.mode,
    totalQuestions: result.totalQuestions
  }));
});

const formatDate = timestamp => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const percentageTemplate = rowData => {
  const total = rowData.correct + rowData.incorrect + rowData.omitted;
  if (total === 0) {
    return '0.00%';
  }
  const percentage = (rowData.correct / total) * 100;
  return `${percentage.toFixed(2)}%`;
};

const actionTemplate = () => {
  // Define how action buttons are rendered
  return '<Button text="View" />';
};

onMounted(() => {
  if (store.state.quizHistory === null) {
    store.dispatch(actions.FETCH_QUIZ_HISTORY);
  }
});
</script>

<style scoped>
.previous-tests-container {
  max-width: 100%;
  height: 100vh;
  margin: 0;
  background-color: var(--surface-ground);
  padding: 2rem;
}
</style>
