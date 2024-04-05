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

export type QuizMode = 'tutor' | 'timed' | null;

export interface QuizResult {
  mode: QuizMode;
  correctAnswers: number;
  incorrectAnswers: number;
  timestamp: Date;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number[]>;
  isSubmitted: Record<string, boolean>;
  timer: number;
  mode: QuizMode;
  startTime: Date | null;
  endTime: Date | null;
  quizHistory: QuizResult[];
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
