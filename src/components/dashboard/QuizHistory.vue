<template>
  <div>
    <h2>Quiz History</h2>
    <DataTable :value="quizHistory">
      <Column field="testName" header="Test Name"></Column>
      <Column field="correct" header="Correct" :body="percentageTemplate"></Column>
      <Column field="incorrect" header="Incorrect" :body="percentageTemplate"></Column>
      <Column field="omitted" header="Omitted"></Column>
      <Column body="actionTemplate" header="Action"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from 'vuex';
import {computed} from "vue";

const store = useStore();
const quizHistory = computed(() =>
  store.state.quizHistory.map((result, index) => ({
    testName: `Test ${index + 1}`,
    correct: result.correctAnswers,
    incorrect: result.incorrectAnswers,
    omitted: result.totalQuestions - (result.correctAnswers + result.incorrectAnswers)
  }))
);

const percentageTemplate = rowData => {
  // Calculate and return percentage markupx
};

const actionTemplate = () => {
  // Define how action buttons are rendered
};
</script>
