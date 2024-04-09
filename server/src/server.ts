import "dotenv/config";
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { FieldPacket, ResultSetHeader } from 'mysql2';
import { AnsweredQuestion, AnsweredQuestionModel, Question, QuizResultModel, SelectedOption, QuizResultDetails, Option, OptionModel, QuestionDetails, QuizResult, QuizResultRow } from './types';

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

/**
 * Get all questions
 * 
 * @returns {QuestionDetails[]} - The questions with their options
 */
app.get('/api/questions', async (req, res) => {
  try {
    const [questionRows] = await pool.query('SELECT * FROM questions') as [any[], FieldPacket[]];
    const questions: Question[] = questionRows;
    const questionIds = questions.map((question) => question.id);

    const [optionRows] = await pool.query(
      'SELECT * FROM options WHERE question_id IN (?)',
      [questionIds]
    ) as [OptionModel[], FieldPacket[]];

    const options: Option[] = optionRows.map(opt => {
      return {
        ...opt,
        questionId: opt.question_id,
        isCorrect: Boolean(opt.is_correct)
      };
    });

    const questionsWithOptions: QuestionDetails[] = questions.map((question) => ({
      ...question,
      options: options
        .filter((option) => option.questionId === question.id)
        .map((option) => ({ ...option, is_correct: Boolean(option.isCorrect) })),
    }));

    res.json(questionsWithOptions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get a specific question by ID
 * 
 * @param {number} questionId - The ID of the question
 * @returns {QuestionDetails} - The question with its options
 */
app.get('/api/questions/:id', async (req, res) => {
  const questionId = req.params.id;
  try {
    const [questionRows] = await pool.query('SELECT * FROM questions WHERE id = ?', [questionId]) as [Question[], FieldPacket[]];
    const questions: Question[] = questionRows;

    const [optionRows] = await pool.query('SELECT * FROM options WHERE question_id = ?', [questionId]) as [OptionModel[], FieldPacket[]];
    const options: Option[] = optionRows.map(opt => {
      return {
        ...opt,
        questionId: opt.question_id,
        isCorrect: Boolean(opt.is_correct)
      };
    });

    if (questions.length === 0) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      const question: QuestionDetails = {
        ...questions[0],
        options: options,
      };

      res.json(question);
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** 
 * Get all quiz results with used question IDs
 * 
 * @returns {QuizResult[]} - The quiz results
 */
app.get('/api/quiz-results', async (req, res) => {
  try {
    const [quizResultRows] = await pool.query('SELECT * FROM quiz_results') as [QuizResultModel[], FieldPacket[]];

    const quizResults: QuizResult[] = quizResultRows.map(quizResult => {
      return {
        ...quizResult,
        correctAnswers: quizResult.correct_answers,
        incorrectAnswers: quizResult.incorrect_answers,
        omittedAnswers: quizResult.omitted_answers,
        totalQuestions: quizResult.total_questions,
        timeSpent: quizResult.time_spent,
        timestamp: quizResult.timestamp,
      };
    });

    res.json(quizResults);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get a specific quiz result by ID
 * 
 * @param {number} quizResultId - The ID of the quiz result
 * @returns {QuizResultDetails} - The quiz result details
 */
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

    // const [answeredQuestionsRows] = await pool.query(`
    //   SELECT aq.id, aq.quiz_result_id, aq.question_id, aq.is_correct
    //   FROM answered_questions aq
    //   WHERE aq.quiz_result_id = ?
    // `, [quizResultId]) as [AnsweredQuestionModel[], FieldPacket[]];

    // // For each answered question, fetch selected options
    // const answeredQuestions = await Promise.all(answeredQuestionsRows.map(async (aq) => {
    //   const [selectedOptionsRows] = await pool.query(
    //     'SELECT option_id FROM answered_question_options WHERE answered_question_id = ?',
    //     [aq.id]
    //   ) as [SelectedOption[], FieldPacket[]];

    //   return {
    //     id: aq.id,
    //     quizResultId: aq.quiz_result_id,
    //     questionId: aq.question_id,
    //     isCorrect: aq.is_correct,
    //     selectedOptions: selectedOptionsRows.map(so => so.option_id), // Extracting option_id from each row
    //   };
    // }));

    const quizResultWithAnsweredQuestions: QuizResultDetails = {
      id: quizResult.id,
      mode: quizResult.mode,
      correctAnswers: quizResult.correct_answers,
      incorrectAnswers: quizResult.incorrect_answers,
      omittedAnswers: quizResult.omitted_answers,
      totalQuestions: quizResult.total_questions,
      // answeredQuestions, // Now includes selectedOptions as array of option IDs
      timeSpent: quizResult.time_spent,
      timestamp: quizResult.timestamp,
    };

    res.json(quizResultWithAnsweredQuestions);
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get comprehensive quiz result by ID
 * 
 * @param {number} quizResultId - The ID of the quiz result
 * @returns {QuizResultRow[]} - The quiz result rows (with selected options and correct options)
 */
app.get('/api/quiz-results-comprehensive/:id', async (req, res) => {
  const quizResultId = parseInt(req.params.id);

  try {
    // Initial query to get quiz result details and basic question info
    const [questionsRows] = await pool.query(`
      SELECT q.id AS question_id, q.category, q.difficulty
      FROM quiz_results qr
      JOIN answered_questions aq ON qr.id = aq.quiz_result_id
      JOIN questions q ON aq.question_id = q.id
      WHERE qr.id = ?
      GROUP BY q.id
    `, [quizResultId]) as [Partial<Question>[], FieldPacket[]];

    let quizResultRows: QuizResultRow[] = await Promise.all(questionsRows.map(async (question) => {
      // Fetch selected options
      const [selectedOptions] = await pool.query(`
        SELECT o.id, o.text
        FROM answered_question_options aqo
        JOIN options o ON aqo.option_id = o.id
        WHERE aqo.answered_question_id IN (
          SELECT aq.id
          FROM answered_questions aq
          WHERE aq.quiz_result_id = ? AND aq.question_id = ?
        )
      `, [quizResultId, question.id]) as [Partial<Option>[], FieldPacket[]];

      // Fetch correct options
      const [correctOptions] = await pool.query(`
        SELECT o.id, o.text
        FROM options o
        WHERE o.question_id = ? AND o.is_correct = 1
      `, [question.id]) as [Partial<Option>[], FieldPacket[]];

      return {
        id: quizResultId,
        question: { id: question.id, category: question.category, difficulty: question.difficulty },
        selectedOptions,
        correctOptions,
        isCorrect: selectedOptions.every(
          so => correctOptions.some(co => co.id === so.id)) &&
          correctOptions.every(co => selectedOptions.some(so => so.id === co.id)),
      };
    }));

    res.json(quizResultRows);
  } catch (error) {
    console.error('Error fetching comprehensive quiz result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get all used question IDs
 * 
 * @returns {string[]} - The used question IDs
 */
app.get('/api/used-questions', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT question_id
      FROM answered_questions
    `) as [{ question_id: string }[], FieldPacket[]];

    const usedQuestionIds = new Set(rows.map(row => row.question_id));

    res.json({ usedQuestionIds: Array.from(usedQuestionIds) });
  } catch (error) {
    console.error('Error fetching used questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/********************************* POST ROUTES *********************************/

/**
 * Save quiz result
 * 
 * @param {QuizResult} quizResult - The quiz result to save
 * @returns {number} - The ID of the saved quiz result
 */
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

/**
 * Save answered questions
 * 
 * @param {AnsweredQuestion[]} answeredQuestions - The answered questions to save
 * @returns {void}
 */
app.post('/api/answered-questions', async (req, res) => {
  const { quizResultId, answeredQuestions } = req.body;
  try {
    const answeredQuestionPromises = answeredQuestions.map(async (question: AnsweredQuestion) => {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO answered_questions (quiz_result_id, question_id, is_correct) VALUES (?, ?, ?)',
        [quizResultId, question.questionId, question.isCorrect]
      );

      // Insert selected options into answered_question_options
      const optionInsertPromises = question.selectedOptions.map(optionId =>
        pool.query(
          'INSERT INTO answered_question_options (answered_question_id, option_id) VALUES (?, ?)',
          [result.insertId, optionId]
        )
      );

      await Promise.all(optionInsertPromises);
    });

    await Promise.all(answeredQuestionPromises);
    res.status(201).send({ id: quizResultId });
  } catch (error) {
    console.error('Error saving answered questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Start the server
 */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});