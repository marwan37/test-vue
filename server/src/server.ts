import "dotenv/config";
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { FieldPacket, ResultSetHeader } from 'mysql2';
import { AnsweredQuestion, AnsweredQuestionModel, ProcessedOption, ProcessedQuizResult, Question, QuizResult, QuizResultModel, QuizResultRow } from './types';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const [questionRows] = await pool.query('SELECT * FROM questions') as [any[], FieldPacket[]];
    const questions: Question[] = questionRows;
    const questionIds = questions.map((question) => question.id);

    const [optionRows] = await pool.query(
      'SELECT * FROM options WHERE question_id IN (?)',
      [questionIds]
    ) as [any[], FieldPacket[]];
    const options: any[] = optionRows;

    const questionsWithOptions = questions.map((question) => ({
      ...question,
      options: options
        .filter((option) => option.question_id === question.id)
        .map((option) => ({ ...option, is_correct: Boolean(option.is_correct) })),
    }));

    res.json(questionsWithOptions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific question by ID
app.get('/api/questions/:id', async (req, res) => {
  const questionId = req.params.id;
  try {
    const [questionRows] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionId]) as [any[], FieldPacket[]];
    const questions: Question[] = questionRows;

    const [optionRows] = await pool.query('SELECT * FROM options WHERE question_id = ?', [questionId]) as [any[], FieldPacket[]];
    const options: any[] = optionRows;

    if (questions.length === 0) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      const question = {
        ...questionRows[0],
        options: options,
      };
      res.json(question);
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all quiz results with used question IDs
app.get('/api/quiz-results', async (req, res) => {
  try {
    const [quizResultRows] = await pool.query('SELECT * FROM quiz_results') as [any[], FieldPacket[]];

    const quizResults: QuizResultModel[] = await Promise.all(
      quizResultRows.map(async (quizResult) => {
        const [answeredQuestionRows] = await pool.query(
          'SELECT question_id FROM answered_questions WHERE quiz_result_id = ?',
          [quizResult.id]
        ) as [any[], FieldPacket[]];

        const usedQuestionIds = answeredQuestionRows.map((row) => row.question_id);

        return {
          ...quizResult,
          used_question_ids: usedQuestionIds,
        };
      })
    );

    res.json(quizResults);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific quiz result by ID
app.get('/api/quiz-results/:id', async (req, res) => {
  const quizResultId = parseInt(req.params.id);

  try {
    const [quizResultRows] = await pool.query(
      'SELECT * FROM quiz_results WHERE id = ?',
      [quizResultId]
    ) as [any[], FieldPacket[]];

    if (quizResultRows.length === 0) {
      res.status(404).json({ error: 'Quiz result not found' });
      return;
    }

    const quizResult: QuizResultModel = quizResultRows[0];

    const [answeredQuestionRows] = await pool.query(
      'SELECT * FROM answered_questions WHERE quiz_result_id = ?',
      [quizResultId]
    ) as [AnsweredQuestionModel[], FieldPacket[]];

    const answeredQuestions: AnsweredQuestionModel[] = answeredQuestionRows.map((row) => ({
      id: row.id,
      quiz_result_id: row.quiz_result_id,
      question_id: row.question_id,
      selected_options: row.selected_options,
      is_correct: Boolean(row.is_correct),
    }));

    const quizResultWithAnsweredQuestions: QuizResult = {
      mode: quizResult.mode,
      correctAnswers: quizResult.correct_answers,
      incorrectAnswers: quizResult.incorrect_answers,
      omittedAnswers: quizResult.omitted_answers,
      totalQuestions: quizResult.total_questions,
      answeredQuestions: answeredQuestions.map((aq) => ({
        questionId: aq.question_id,
        selectedIndices: aq.selected_options,
        isCorrect: aq.is_correct,
      })),
      timeSpent: quizResult.time_spent,
      timestamp: quizResult.timestamp,
    };

    res.json(quizResultWithAnsweredQuestions);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save quiz result
app.post('/api/quiz-results', async (req, res) => {
  const { mode, correctAnswers, incorrectAnswers, omittedAnswers, totalQuestions, timeSpent, timestamp } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO quiz_results (mode, correct_answers, incorrect_answers, omitted_answers, total_questions, time_spent, timestamp) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [mode, correctAnswers, incorrectAnswers, omittedAnswers, totalQuestions, timeSpent, timestamp]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save answered questions
app.post('/api/answered-questions', async (req, res) => {
  const { quizResultId, answeredQuestions } = req.body;
  try {
    const insertPromises = answeredQuestions.map(async (question: AnsweredQuestion) => {
      await pool.query(
        'INSERT INTO answered_questions (quiz_result_id, question_id, selected_options, is_correct) VALUES (?, ?, ?, ?)',
        [quizResultId, question.questionId, JSON.stringify(question.selectedIndices), question.isCorrect]
      );
    });
    await Promise.all(insertPromises);
    res.status(201).send();
  } catch (error) {
    console.error('Error saving answered questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/quiz-results-comprehensive/:id', async (req, res) => {
  const quizResultId = parseInt(req.params.id);

  try {
    const [results] = await pool.query(`
      SELECT qr.*, aq.*, q.*, o.*
      FROM quiz_results qr
      JOIN answered_questions aq ON qr.id = aq.quiz_result_id
      JOIN questions q ON aq.question_id = q.id
      LEFT JOIN options o ON q.id = o.question_id
      WHERE qr.id = ?
    `, [quizResultId]) as [QuizResultRow[], FieldPacket[]];

    let processedResult: ProcessedQuizResult | null = null;

    results.forEach(row => {
      if (!processedResult) {
        processedResult = {
          id: row.id,
          mode: row.mode,
          correctAnswers: row.correct_answers,
          incorrectAnswers: row.incorrect_answers,
          omittedAnswers: row.omitted_answers,
          totalQuestions: row.total_questions,
          timeSpent: row.time_spent,
          timestamp: row.timestamp,
          questions: []
        };
      }

      let question = processedResult.questions.find(q => q.id === row.question_id);
      if (!question) {
        question = {
          id: row.question_id,
          text: row.text,
          options: []
        };
        processedResult.questions.push(question);
      }

      // Ensure option_id is present before adding an option
      if (row.option_id) {
        const option: ProcessedOption = {
          id: row.option_id,
          text: row.option_text || '',
          isCorrect: row.is_correct,
          explanation: row.explanation
        };
        question.options.push(option);
      }
    });

    if (processedResult) {
      res.json(processedResult);
    } else {
      res.status(404).json({ error: 'Quiz result not found' });
    }
  } catch (error) {
    console.error('Error fetching comprehensive quiz result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});