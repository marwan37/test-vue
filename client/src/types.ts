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

export type QuizMode = 'tutor' | 'timed' | null;

export interface BaseQuizResult {
  mode: QuizMode;
  correctAnswers: number;
  incorrectAnswers: number;
  omittedAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: Date;
}

export interface QuizResult extends BaseQuizResult {
  id?: number;
  answeredQuestions: AnsweredQuestion[];
}

export interface QuizResultResponse extends BaseQuizResult {
  id: number;
  correct_answers: number;
  incorrect_answers: number;
  omitted_answers: number;
  total_questions: number;
  time_spent: number;
  used_question_ids: string[];
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

export interface QuizState {
  questions: Question[];
  totalQuestions: number;
  usedQuestionIds: string[] | null;
  numQuestions: number;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number[]>;
  omittedAnswers: number;
  isSubmitted: Record<string, boolean>;
  timer: number;
  mode: QuizMode;
  startTime: Date | null;
  endTime: Date | null;
  quizHistory: QuizResult[] | QuizResultResponse[] | null;
  selectedQuizResult: QuizResultResponse | null;
  latestQuizResult: ProcessedQuizResult | null;
  showingExplanation: boolean;
  finished: boolean;
  suspended: boolean;
  suspendedTimer: number;
}

export interface QuizMutations {
  setMode: (mode: QuizMode) => void;
  selectAnswer: (questionId: string, optionIndex: number) => void;
  submitAnswer: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  decrementTimer: () => void;
  addQuizResult: (result: QuizResult) => void;
  resetQuiz: () => void;
}
