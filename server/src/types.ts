export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface AnsweredQuestion {
  questionId: string;
  selectedIndices: number[];
  isCorrect: boolean;
}

export interface AnsweredQuestionModel {
  id: number;
  quiz_result_id: number;
  question_id: string;
  selected_options: number[];
  is_correct: boolean;
}

export type QuizMode = 'tutor' | 'timed' | null;

export interface QuizResultModel {
  id: number;
  mode: QuizMode;
  correct_answers: number;
  incorrect_answers: number;
  omitted_answers: number;
  total_questions: number;
  answered_questions: AnsweredQuestion[];
  time_spent: number;
  timestamp: Date;
}

export interface QuizResult {
  mode: QuizMode;
  correctAnswers: number;
  incorrectAnswers: number;
  omittedAnswers: number;
  totalQuestions: number;
  answeredQuestions: AnsweredQuestion[];
  timeSpent: number;
  timestamp: Date;
}

export interface QuizResultRow {
  id: number;
  mode: string;
  correct_answers: number;
  incorrect_answers: number;
  omitted_answers: number;
  total_questions: number;
  time_spent: number;
  timestamp: Date;
  question_id: string;
  text: string;
  option_id?: string;
  option_text?: string;
  is_correct?: boolean;
  explanation?: string;
}

export interface ProcessedQuizResult {
  id: number;
  mode: string;
  correctAnswers: number;
  incorrectAnswers: number;
  omittedAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: Date;
  questions: ProcessedQuestion[];
}

export interface ProcessedQuestion {
  id: string;
  text: string;
  options: ProcessedOption[];
}

export interface ProcessedOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
}