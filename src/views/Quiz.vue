<template>
  <div class="quiz-container">
    <Question :questionId="currentQuestionId" />
    <div class="button-group">
      <Button v-if="hasPrev" label="Previous" @click="prevQuestion" class="p-button-secondary" />
      <Button v-if="hasNext" label="Next" @click="nextQuestion" class="p-button-primary" />
    </div>
    <p class="question-info">Question {{ currentQuestionIndex + 1 }} of {{ questionsLength }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import Question from '../components/quiz/QuestionComponent.vue';
import * as mutationTypes from '../store/mutation-types';

const store = useStore();

const questions = computed(() => store.state.questions);
const currentQuestionIndex = computed(() => store.state.currentQuestionIndex);

const hasPrev = computed(() => currentQuestionIndex.value > 0);
const hasNext = computed(() => currentQuestionIndex.value < questions.value.length - 1);

const currentQuestionId = computed(() => questions.value[currentQuestionIndex.value].id);
const questionsLength = computed(() => questions.value.length);

const prevQuestion = () => {
  store.commit(mutationTypes.PREV_QUESTION);
};

const nextQuestion = () => {
  store.commit(mutationTypes.NEXT_QUESTION);
};
</script>

<style scoped>
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.p-button-secondary {
  background-color: #4299e1;
  color: white;
}

.p-button-secondary:hover {
  background-color: #3182ce;
}

.p-button-primary {
  background-color: #38b2ac;
  color: white;
}

.p-button-primary:hover {
  background-color: #319795;
}

.question-info {
  font-size: 1rem;
  color: #4a5568;
}
</style>
