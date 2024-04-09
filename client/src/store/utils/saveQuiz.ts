import type { QuizMode, AnsweredQuestion, Question, QuizResult } from '@/types';

export const generateResult = (
  questions: Question[],
  selectedAnswers: Record<string, number[]>,
  mode: QuizMode,
  timer: number,
): QuizResult => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let omittedAnswers = 0;
  let answeredQuestions: AnsweredQuestion[] = [];

  questions.forEach(question => {
    const selectedIndices = selectedAnswers[question.id] || [];
    const correctIndices = question.options
      .map((option, index) => option.isCorrect ? index : null)
      .filter(index => index !== null) as number[];

    const isCorrect = correctIndices.length === selectedIndices.length &&
      correctIndices.every(index => selectedIndices.includes(index));

    if (isCorrect) {
      correctAnswers++;
    } else if (selectedIndices.length === 0) {
      omittedAnswers++;
    } else {
      incorrectAnswers++;
    }

    answeredQuestions.push({
      questionId: question.id,
      selectedIndices,
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


