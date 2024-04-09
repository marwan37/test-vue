// store/index.ts
import { fetchComprehensiveQuizResult, fetchQuestions, fetchQuizHistory, fetchQuizResultById, fetchUsedQuestionIds, saveAnsweredQuestions, saveQuizResult } from '@/services/api';
import type { QuestionDetails, QuizState } from '@/types';
import { type InjectionKey } from 'vue';
import { Store, createStore } from 'vuex';
import * as actions from './constants/actions';
import * as mutations from './constants/mutations';
import { generateResult } from './utils/saveQuiz';
import router from '@/router';

export const initialState: QuizState = {
  questions: [],
  totalQuestions: 0,
  usedQuestionIds: null,
  currentQuestionIndex: 0,
  numQuestions: 0,
  selectedAnswers: {},
  omittedAnswers: 0,
  isSubmitted: {},
  timer: 0,
  mode: null,
  startTime: null,
  endTime: null,
  quizHistory: null,
  selectedQuizResult: null,
  showingExplanation: false,
  finished: false,
  suspended: false,
  suspendedTimer: 0,
  latestQuizResult: null,
};

export const key: InjectionKey<Store<QuizState>> = Symbol()

const store = createStore<QuizState>({
  state: initialState,

  mutations: {
    [mutations.SET_USED_QUESTION_IDS](state: QuizState, usedQuestionIds: string[]) {
      state.usedQuestionIds = usedQuestionIds;
    },
    [mutations.SET_TOTAL_QUESTIONS](state: QuizState, totalQuestions: number) {
      state.totalQuestions = totalQuestions;
    },
    [mutations.SET_QUESTIONS](state: QuizState, questions: QuestionDetails[]) {
      // console.log('[Mutation] SET_QUESTIONS', questions);
      state.questions = questions;
    },
    [mutations.SET_QUIZ_HISTORY](state: QuizState, quizHistory) {
      state.quizHistory = quizHistory;
    },
    [mutations.SET_MODE](state, mode) {
      state.mode = mode;
    },
    [mutations.SET_NUM_QUESTIONS](state, numQuestions) {
      state.numQuestions = numQuestions;
    },
    [mutations.SET_SHOWING_EXPLANATION](state, status) {
      state.showingExplanation = status;
    },
    [mutations.SET_QUIZ_FINISHED](state, status) {
      state.finished = status;
    },
    [mutations.SET_QUIZ_SUSPENDED](state, status) {
      state.suspended = status;
      if (status) {
        state.suspendedTimer = state.timer;
      }
    },
    [mutations.SET_LATEST_QUIZ_RESULT](state, quizResult) {
      state.latestQuizResult = quizResult;
    },
    [mutations.RESUME_QUIZ](state) {
      state.suspended = false;
      state.timer = state.suspendedTimer;
    },
    [mutations.SELECT_ANSWER](state, { questionId, optionIndex }) {
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const numberOfCorrectAnswers = question.options.filter((option) => option.isCorrect).length;
        if (numberOfCorrectAnswers === 1) {
          // Single-answer question
          state.selectedAnswers[questionId] = [optionIndex];
        } else {
          // Multiple-answer question
          const selectedAnswers = state.selectedAnswers[questionId] || [];
          state.selectedAnswers[questionId] = selectedAnswers.includes(optionIndex)
            ? selectedAnswers.filter((index) => index !== optionIndex)
            : [...selectedAnswers, optionIndex];
        }
      }
    },
    [mutations.SUBMIT_ANSWER](state, questionId) {
      state.isSubmitted[questionId] = true;
    },
    [mutations.NEXT_QUESTION](state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    [mutations.PREV_QUESTION](state) {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    [mutations.ADD_QUIZ_RESULT](state, result) {
      state.quizHistory?.push({
        ...result,
        omittedAnswers: result.totalQuestions - (result.correctAnswers + result.incorrectAnswers)
      });
    },
    [mutations.START_QUIZ](state, { numQuestions, mode }) {
      state.numQuestions = numQuestions;
      state.mode = mode;
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.isSubmitted = {};
      state.showingExplanation = false;
      state.startTime = new Date();
      state.endTime = null;
      state.finished = false;
      state.suspended = false;
      state.timer = mode === 'timed' ? numQuestions * 90 : 0;
    },
    [mutations.RESET_QUIZ](state) {
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.isSubmitted = {};
      state.startTime = null;
      state.endTime = null;
    },
    [mutations.INCREMENT_TIMER](state) {
      if (!state.showingExplanation) {
        state.timer++;
      }
    },
    [mutations.DECREMENT_TIMER](state) {
      if (!state.showingExplanation && state.timer > 0) {
        state.timer--;
      }
    },
  },
  actions: {
    [actions.GO_TO_NEXT_QUESTION]({ commit, state }) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        commit('nextQuestion');
      }
    },
    [actions.GO_TO_PREVIOUS_QUESTION]({ commit, state }) {
      if (state.currentQuestionIndex > 0) {
        commit('prevQuestion');
      }
    },
    async [actions.FINISH_QUIZ]({ commit, state }) {
      const result = generateResult(state.questions, state.selectedAnswers, state.mode, state.timer);
      try {
        const quizResultId = await saveQuizResult(result);
        const fullResult = { ...result, id: quizResultId };
        commit(mutations.ADD_QUIZ_RESULT, fullResult);
        await saveAnsweredQuestions(quizResultId, result.answeredQuestions);
        console.log('Quiz result and answered questions saved');

        await store.dispatch(actions.FETCH_COMPREHENSIVE_QUIZ_RESULT, quizResultId);

        commit(mutations.SET_QUIZ_FINISHED, true);
        commit(mutations.RESET_QUIZ);
        router.push('/quiz-result');
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    },
    async [actions.FETCH_QUESTIONS]({ commit, state }) {
      try {
        let questions = await fetchQuestions();
        console.log('[store] Questions:', questions);
        commit(mutations.SET_TOTAL_QUESTIONS, questions.length);
        questions = questions.slice(0, state.numQuestions);
        questions = questions.sort(() => Math.random() - 0.5);
        commit(mutations.SET_QUESTIONS, questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async [actions.FETCH_QUIZ_HISTORY]({ commit }) {
      try {
        const quizHistory = await fetchQuizHistory();
        // console.log('[store] Quiz history:', quizHistory);
        if (!quizHistory || quizHistory.length === 0) {
          return [];
        }
        const formattedQuizHistory = quizHistory.map((quizResult) => ({
          id: quizResult.id,
          mode: quizResult.mode,
          correctAnswers: quizResult.correctAnswers,
          incorrectAnswers: quizResult.incorrectAnswers,
          omittedAnswers: quizResult.omittedAnswers,
          totalQuestions: quizResult.totalQuestions,
          timeSpent: quizResult.timeSpent,
          timestamp: new Date(quizResult.timestamp).toLocaleString(),
        }));
        commit(mutations.SET_QUIZ_HISTORY, formattedQuizHistory);
      } catch (error) {
        console.error('Error fetching quiz history:', error);
      }
    },
    async [actions.FETCH_USED_QUESTION_IDS]({ commit }) {
      const usedQuestionIds = await fetchUsedQuestionIds();
      commit(mutations.SET_USED_QUESTION_IDS, usedQuestionIds);
    },
    async [actions.FETCH_COMPREHENSIVE_QUIZ_RESULT]({ commit }, quizResultId: number) {
      try {
        const quizResult = await fetchComprehensiveQuizResult(quizResultId);
        commit(mutations.SET_LATEST_QUIZ_RESULT, quizResult);
      } catch (error) {
        console.error('Error fetching comprehensive quiz result:', error);
        commit(mutations.SET_LATEST_QUIZ_RESULT, null);
      }
    },
    async [actions.FETCH_QUIZ_RESULT_BY_ID]({ commit }, quizResultId: number) {
      try {
        const quizResult = await fetchQuizResultById(quizResultId);
        commit(mutations.SET_SELECTED_QUIZ_RESULT, quizResult);
      } catch (error) {
        console.error('Error fetching quiz result:', error);
        commit(mutations.SET_SELECTED_QUIZ_RESULT, null);
      }
    },

  },
  getters: {
    questions: (state) => state.questions,
    totalQuestions: (state) => state.totalQuestions,
    usedQuestionIds: (state) => state.usedQuestionIds,
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    selectedAnswers: (state) => state.selectedAnswers,
    isSubmitted: (state) => state.isSubmitted,
    timer: (state) => state.timer,
    mode: (state) => state.mode,
    startTime: (state) => state.startTime,
    endTime: (state) => state.endTime,
    quizHistory: (state) => state.quizHistory,
    selectedQuizResult: (state) => state.selectedQuizResult,
    showingExplanation: (state) => state.showingExplanation,
    isQuizFinished: (state) => state.finished,
    isQuizSuspended: (state) => state.suspended,
    latestQuizResult: (state) => state.latestQuizResult,
  },
});

export default store;
