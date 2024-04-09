// src/services/api.ts
import axios from 'axios';
import type { AnsweredQuestion, QuestionDetails, QuizResult, QuizResultDetails, QuizResultRow } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch the questions from the server
 * 
 * @returns {QuestionDetails[]} The questions, with the options and explanations
 */
export async function fetchQuestions(): Promise<QuestionDetails[]> {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
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
export async function fetchQuizHistory(): Promise<QuizResultDetails[]> {
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
 * @returns {number} The ID of the quiz result
 */
export async function saveQuizResult(quizResult: QuizResult): Promise<number> {
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
export async function saveAnsweredQuestions(quizResultId: number, answeredQuestions: AnsweredQuestion[]): Promise<void> {
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
export const fetchQuizResultById = async (quizResultId: number): Promise<QuizResultDetails> => {
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
 * @returns {Promise<QuizResultRow[]>} The quiz result rows (with selected and correct options)
 */
export const fetchComprehensiveQuizResult = async (quizResultId: number): Promise<QuizResultRow[]> => {
  try {
    const response = await axios.get(`${API_URL}/quiz-results-comprehensive/${quizResultId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comprehensive quiz result:', error);
    throw error;
  }
};

/**
 * Fetch the used question IDs from the server
 * 
 * @returns {string[]} The used question IDs
 */
export const fetchUsedQuestionIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/used-questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching used question IDs:', error);
    throw error;
  }
};

