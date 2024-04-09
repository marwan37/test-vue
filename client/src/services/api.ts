// src/services/api.ts
import axios from 'axios';
import type { AnsweredQuestion, ProcessedQuizResult, Question, QuizResult, QuizResultResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch the questions from the server
 * 
 * @returns The questions
 */
export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await axios.get(`${API_URL}/questions`);

    const questions = response.data.map((question: any) => ({
      id: question.id,
      text: question.text,
      category: question.category,
      difficulty: question.difficulty,
      options: question.options.map((option: any) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.is_correct,
        explanation: option.explanation,
      })),
    }));
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * Fetch the quiz history from the server
 * 
 * @returns The quiz history
 */
export async function fetchQuizHistory(): Promise<QuizResultResponse[]> {
  try {
    const response = await axios.get(`${API_URL}/quiz-results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw error;
  }
}

/**
 * Save a quiz result
 * 
 * @param quizResult The quiz result
 * @returns The response from the server with the ID of the quiz result
 */
export async function saveQuizResult(quizResult: QuizResult) {
  try {
    const response = await axios.post(`${API_URL}/quiz-results`, quizResult);
    return response.data.id;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

/**
 * Save the answered questions for a specific quiz result
 * 
 * @param quizResultId The ID of the quiz result
 * @param answeredQuestions The answered questions
 * @returns The response from the server
 */
export async function saveAnsweredQuestions(quizResultId: number, answeredQuestions: AnsweredQuestion[]) {
  try {
    const response = await axios.post(`${API_URL}/answered-questions`,
      { quizResultId, answeredQuestions });
    return response.data;
  } catch (error) {
    console.error('Error saving answered questions:', error);
    throw error;
  }
}

/**
 * Fetch a quiz result by ID
 * 
 * @param quizResultId The ID of the quiz result
 * @returns The quiz result
 */
export const fetchQuizResultById = async (quizResultId: number): Promise<QuizResultResponse> => {
  try {
    const response = await axios.get(`${API_URL}/quiz-results/${quizResultId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    throw error;
  }
};

/**
 * Fetch the comprehensive quiz result by ID
 * 
 * @param quizResultId The ID of the quiz result
 * @returns The comprehensive quiz result
 */
export const fetchComprehensiveQuizResult = async (quizResultId: number): Promise<ProcessedQuizResult> => {
  try {
    const response = await axios.get(`${API_URL}/quiz-results-comprehensive/${quizResultId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comprehensive quiz result:', error);
    throw error;
  }
};
