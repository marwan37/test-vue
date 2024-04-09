<!-- quiz/QuestionComponent.vue -->
<template>
  <div class="p-fluid">
    <div class="p-field">
      <div class="mb-8">{{ currentQuestion.text }}</div>
    </div>
    <div v-for="(option, index) in currentQuestion.options" :key="option.id" class="p-field">
      <AnswerOption
        @select-option="handleSelectOption"
        :label="labels[index]"
        :text="option.text"
        :is-selected="selectedOptionIndices.includes(index)"
        :is-submitted="isQuestionSubmitted"
        :is-correct="option.isCorrect"
        :question-id="currentQuestion.id"
        :option-index="index" />
    </div>
    <div v-if="mode === 'tutor' && !isQuestionSubmitted" class="p-field">
      <Button class="mt-8" label="Submit Answer" @click="handleSubmit" />
    </div>
    <div v-if="isQuestionAnswered && isQuestionSubmitted" class="p-field">
      <AnswerStats
        :correct-answers="correctAnswers"
        :percentage-correct="percentageCorrect"
        :time-spent="timeSpent"
        :last-updated="lastUpdated" />
      <QuestionExplanation :options="currentQuestion.options" :labels="labels" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import AnswerOption from './AnswerOption.vue';
import AnswerStats from './AnswerStats.vue';
import QuestionExplanation from './QuestionExplanation.vue';
import type { Question } from '@/types';
import type { ComputedRef } from 'vue';
import { useToast } from 'vue-toastification';
import * as mutations from '@/store/constants/mutations';

export default defineComponent({
  name: 'QuestionComponent',
  components: {
    AnswerOption,
    AnswerStats,
    QuestionExplanation,
    Button
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    const currentQuestion: ComputedRef<Question> = computed(
      () => store.getters.currentQuestion as Question
    );
    const selectedOptionIndices = computed(
      () => store.state.selectedAnswers[currentQuestion.value.id] || []
    );
    const isQuestionSubmitted = computed(
      () => store.state.isSubmitted[currentQuestion.value.id] || false
    );
    const isQuestionAnswered = computed(
      () => currentQuestion.value.id in store.state.selectedAnswers
    );
    const mode = computed(() => store.state.mode);
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    const handleSubmit = () => {
      if (
        selectedOptionIndices.value.length ===
        currentQuestion.value.options.filter(opt => opt.isCorrect).length
      ) {
        store.commit(mutations.SUBMIT_ANSWER, currentQuestion.value.id);
        if (mode.value === 'tutor') {
          store.commit(mutations.SET_SHOWING_EXPLANATION, true);
        }
      } else {
        const requiredAnswers = currentQuestion.value.options.filter(opt => opt.isCorrect).length;
        toast.warning(`Please select ${requiredAnswers} answer(s).`, {
          timeout: 5000,
          closeOnClick: true
        });
      }
    };

    const handleSelectOption = ({
      questionId,
      optionIndex
    }: {
      questionId: string;
      optionIndex: number;
    }) => {
      store.commit('SELECT_ANSWER', { questionId, optionIndex });
    };

    const correctAnswerIndices = computed(() =>
      currentQuestion.value.options
        .map((opt, index) => (opt.isCorrect ? index : -1))
        .filter(index => index !== -1)
    );
    const correctAnswers = computed(() => correctAnswerIndices.value.map(index => labels[index]));

    // TODO: Replace with actual data
    const percentageCorrect = 75;
    const timeSpent = 30;
    const lastUpdated = '2023-06-08';

    return {
      currentQuestion,
      selectedOptionIndices,
      isQuestionSubmitted,
      isQuestionAnswered,
      mode,
      labels,
      handleSubmit,
      handleSelectOption,
      correctAnswers,
      percentageCorrect,
      timeSpent,
      lastUpdated
    };
  }
});
</script>
