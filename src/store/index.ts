// store/index.ts
import { type InjectionKey } from 'vue'
import type { QuizState, QuizMode, QuizResult } from '@/types';
import { createStore, Store } from 'vuex'
import practiceQuestions from '@/qbank/practice_1.json';

export const initialState: QuizState = {
  questions: practiceQuestions,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  isSubmitted: {},
  timer: 0,
  mode: null,
  startTime: null,
  endTime: null,
  quizHistory: [],
};

export const key: InjectionKey<Store<QuizState>> = Symbol()


const store = createStore<QuizState>({
  state: initialState,
  mutations: {
    setMode(state: QuizState, mode: QuizMode) {
      state.mode = mode;
    },
    selectAnswer(state: QuizState, { questionId, optionIndex }: { questionId: string; optionIndex: number }) {
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const numberOfCorrectAnswers = question.options.filter((option) => option.isCorrect).length;
        if (numberOfCorrectAnswers === 1) {
          // Single-answer question
          return {
            selectedAnswers: { ...state.selectedAnswers, [questionId]: [optionIndex] },
          };
        }
        // Multiple-answer question
        const selectedAnswers = state.selectedAnswers[questionId] || [];
        const updatedAnswers = selectedAnswers.includes(optionIndex)
          ? selectedAnswers.filter((index) => index !== optionIndex)
          : [...selectedAnswers, optionIndex];
        return {
          selectedAnswers: { ...state.selectedAnswers, [questionId]: updatedAnswers },
        };
      }
      return state;
    },
    submitAnswer(state: QuizState, questionId: string) {
      state.isSubmitted[questionId] = true;
    },
    nextQuestion(state: QuizState) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion(state: QuizState) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    addQuizResult(state: QuizState, result: QuizResult) {
      state.quizHistory.push(result);
    },
    resetQuiz(state: QuizState) {
      state.timer = state.mode === 'timed' ? state.questions.length * 90 : 0;
      state.isSubmitted = {};
      state.selectedAnswers = {};
    },
  },
  actions: {
    // Actions can be used for asynchronous operations.
    // For simple state updates, you might not need them.
  },
  getters: {
    currentQuestion: (state: QuizState) => state.questions[state.currentQuestionIndex],
  },
});

export default store;