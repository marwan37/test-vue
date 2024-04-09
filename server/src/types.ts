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

export interface QuizResultRow {
  id: number;
  question: Partial<Question>;
  selectedOptions: Partial<Option>[];
  correctOptions: Partial<Option>[];
  isCorrect: boolean;
}

/********************** MYSQL MODELS **********************/

export interface OptionModel {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  explanation: string;
}

export interface AnsweredQuestionModel {
  id: number;
  quiz_result_id: number;
  question_id: string;
  is_correct: boolean;
}

export interface AnsweredQuestionsOptionsModel {
  id: number;
  answered_question_id: number;
  option_id: string;
}

export interface QuizResultModel {
  id: number;
  mode: QuizMode;
  correct_answers: number;
  incorrect_answers: number;
  omitted_answers: number;
  total_questions: number;
  time_spent: number;
  timestamp: Date;
}






