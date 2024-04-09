<!-- src/components/quiz/QuizOptions.vue -->
<template>
  <div class="quiz-options p-4 bg-white shadow rounded-lg">
    <h2 class="text-2xl font-bold mb-4">Quiz Options</h2>
    <div class="mb-4">
      <label for="num-questions" class="block mb-2">Number of Questions:</label>
      <InputNumber id="num-questions" v-model="numQuestions" :min="1" class="w-full" />
    </div>
    <div class="mb-4">
      <label for="filter" class="block mb-2">Filter Questions:</label>
      <Dropdown
        id="filter"
        v-model="selectedFilter"
        :options="filterOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full" />
    </div>
    <div class="flex justify-center mt-4">
      <Button label="Tutor" class="mr-4" @click="handleQuizStart('tutor')" />
      <Button label="Timed" @click="handleQuizStart('timed')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as mutations from '../../store/constants/mutations';
import * as actions from '../../store/constants/actions';

const router = useRouter();
const store = useStore();

const numQuestions = ref(10);
const selectedFilter = ref('all');
const filterOptions = [
  { label: 'All Questions', value: 'all' },
  { label: 'Unused Questions', value: 'unused' },
  { label: 'Incorrectly Answered Questions', value: 'incorrect' }
];

const handleQuizStart = (mode: 'tutor' | 'timed') => {
  store.commit(mutations.START_QUIZ, {
    numQuestions: numQuestions.value,
    mode: mode
  });
  store.dispatch(actions.FETCH_QUESTIONS);
  router.push('/quiz');
};

defineEmits(['start-quiz']);
</script>
