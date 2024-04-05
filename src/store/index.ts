// store/index.ts
import { type InjectionKey } from 'vue'
import type { QuizState, QuizMode, QuizResult } from '@/types';
import { createStore, Store } from 'vuex'
import * as mutationTypes from './mutation-types';
import * as actionTypes from './action-types';
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
    [mutationTypes.SET_MODE](state: QuizState, mode: QuizMode) {
      state.mode = mode;
    },
    [mutationTypes.SELECT_ANSWER](state: QuizState, { questionId, optionIndex }: { questionId: string; optionIndex: number }) {
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
    [mutationTypes.SUBMIT_ANSWER](state: QuizState, questionId: string) {
      state.isSubmitted[questionId] = true;
    },
    [mutationTypes.NEXT_QUESTION](state: QuizState) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    [mutationTypes.PREV_QUESTION](state: QuizState) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    [mutationTypes.ADD_QUIZ_RESULT](state: QuizState, result: QuizResult) {
      state.quizHistory.push(result);
    },
    [mutationTypes.RESET_QUIZ](state: QuizState) {
      state.timer = state.mode === 'timed' ? state.questions.length * 90 : 0;
      state.isSubmitted = {};
      state.selectedAnswers = {};
    },
  },
  actions: {
    [actionTypes.GO_TO_NEXT_QUESTION]({ commit, state }) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        commit('nextQuestion');
      }
    },
    [actionTypes.GO_TO_PREVIOUS_QUESTION]({ commit, state }) {
      if (state.currentQuestionIndex > 0) {
        commit('prevQuestion');
      }
    },
  },
  getters: {
    currentQuestion: (state: QuizState) => state.questions[state.currentQuestionIndex],
  },
});

export default store;
