export interface Option {
  id: string;
  text: string;
  questionId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
}

export interface QuestionDetails extends Question {
  options: Option[];
}

export interface AnsweredQuestion {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
}

export interface SelectedOption {
  option_id: string;
}

export type QuizMode = 'tutor' | 'timed' | null;

export interface QuizResult {
  mode: QuizMode;
  correctAnswers: number;
  incorrectAnswers: number;
  omittedAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: Date;
}

export interface AnsweredQuestionDetails {
  id: number;
  quizResultId: number;
  questionId: string;
  isCorrect: boolean;
  selectedOptions: string[];
}

export interface QuizResultDetails extends QuizResult {
  id: number;
  // answeredQuestions: AnsweredQuestionDetails[];
}

export interface GeneratedQuizResult {
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
  question: Partial<Question>;
  selectedOptions: Partial<Option>[];
  correctOptions: Partial<Option>[];
  isCorrect: boolean;
}

export interface QuizState {
  questions: QuestionDetails[];
  totalQuestions: number;
  usedQuestionIds: string[] | null;
  numQuestions: number;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string[]>;
  omittedAnswers: number;
  isSubmitted: Record<string, boolean>;
  timer: number;
  mode: QuizMode;
  startTime: Date | null;
  endTime: Date | null;
  quizHistory: QuizResult[] | QuizResultDetails[] | null;
  selectedQuizResult: QuizResultDetails | null;
  latestQuizResult: QuizResultRow[] | null;
  showingExplanation: boolean;
  finished: boolean;
  suspended: boolean;
  suspendedTimer: number;
}