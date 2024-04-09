<template>
  <div class="quiz-container">
    <Question v-if="currentQuestion" :questionId="currentQuestionId" />
    <div class="button-group">
      <Button v-if="hasPrev" label="Previous" @click="prevQuestion" class="p-button-secondary" />
      <Button
        v-if="hasNext && !isLastQuestion"
        label="Next"
        @click="nextQuestion"
        class="p-button-primary" />
      <Button v-else label="Finish" @click="finishQuiz" class="p-button-success" />
    </div>
    <p class="question-info">Question {{ currentQuestionIndex + 1 }} of {{ questionsLength }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import Question from '../components/quiz/QuestionComponent.vue';
import * as mutations from '@/store/constants/mutations';
import * as actions from '@/store/constants/actions';

const store = useStore();

const questions = computed(() => store.state.questions);
const currentQuestionIndex = computed(() => store.state.currentQuestionIndex);

const hasPrev = computed(() => currentQuestionIndex.value > 0);
const hasNext = computed(() => currentQuestionIndex.value < questions.value.length - 1);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const currentQuestionId = computed(() => currentQuestion.value?.id);
const questionsLength = computed(() => questions.value.length);

const prevQuestion = () => {
  store.commit(mutations.PREV_QUESTION);
};

const nextQuestion = () => {
  store.commit(mutations.NEXT_QUESTION);
};

const finishQuiz = () => {
  store.dispatch(actions.FINISH_QUIZ);
};

onMounted(() => {
  store.dispatch(actions.FETCH_QUESTIONS);
});
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

.question-info {
  font-size: 1rem;
  color: #4a5568;
}
</style>
