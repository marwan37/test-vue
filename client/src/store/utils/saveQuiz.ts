import type { QuizMode, AnsweredQuestion, GeneratedQuizResult, QuestionDetails } from '@/types';

export const generateResult = (
  questions: QuestionDetails[],
  selectedAnswers: Record<string, string[]>,
  mode: QuizMode,
  timer: number,
): GeneratedQuizResult => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let omittedAnswers = 0;
  let answeredQuestions: AnsweredQuestion[] = [];

  questions.forEach(question => {
    const selectedOptions = selectedAnswers[question.id] || [];
    const correctOptions = question.options.filter(opt => opt.isCorrect)

    const isCorrect = correctOptions.length === selectedOptions.length &&
      correctOptions.every(opt => selectedOptions.includes(opt.id));

    if (isCorrect) {
      correctAnswers++;
    } else if (selectedOptions.length === 0) {
      omittedAnswers++;
    } else {
      incorrectAnswers++;
    }

    answeredQuestions.push({
      questionId: question.id,
      selectedOptions,
      isCorrect,
    });
  });

  const result = {
    mode: mode,
    correctAnswers,
    incorrectAnswers,
    omittedAnswers,
    totalQuestions: questions.length,
    answeredQuestions,
    timeSpent: mode === 'timed' ? questions.length * 90 - timer : 0,
    timestamp: new Date(),
  };

  return result;
};


