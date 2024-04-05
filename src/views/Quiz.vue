<template>
  <div class="v-stack" style="gap: 2rem">
    <Question :questionId="currentQuestionId" />
    <div>
      <Button v-if="hasPrev" label="Previous" @click="prevQuestion" />
      <Button v-if="hasNext" label="Next" @click="nextQuestion" />
    </div>
    <p>Question {{ currentQuestionIndex + 1 }} of {{ questionsLength }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Button } from 'primevue/button';
import Question from '../components/quiz/QuestionComponent.vue';

const store = useStore();

const questions = computed(() => store.state.questions);
const currentQuestionIndex = computed(() => store.state.currentQuestionIndex);

const hasPrev = computed(() => currentQuestionIndex.value > 0);
const hasNext = computed(() => currentQuestionIndex.value < questions.value.length - 1);

const currentQuestionId = computed(() => questions.value[currentQuestionIndex.value].id);
const questionsLength = computed(() => questions.value.length);

const prevQuestion = () => {
  store.dispatch('prevQuestion');
};

const nextQuestion = () => {
  store.dispatch('nextQuestion');
};
</script>
