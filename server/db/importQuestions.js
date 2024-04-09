const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const jsonDirectory = path.join(__dirname);

const pool = mysql.createPool({
  host: 'localhost',
  user: 'marwan',
  password: '1337',
  database: 'aws_world'
});

async function importQuestions() {
  const files = fs.readdirSync(jsonDirectory);

  for (const file of files) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(jsonDirectory, file);
      const questionBank = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const question of questionBank) {
        try {
          const questionId = uuidv4();
          await pool.query(
            'INSERT INTO questions (id, text, category, difficulty) VALUES (?, ?, ?, ?)',
            [questionId, question.text, question.category, question.difficulty]
          );

          for (const option of question.options) {
            const optionId = uuidv4();
            await pool.query(
              'INSERT INTO options (id, question_id, text, is_correct, explanation) VALUES (?, ?, ?, ?, ?)',
              [optionId, questionId, option.text, option.isCorrect, option.explanation]
            );
          }
        } catch (error) {
          console.error('Error importing question:', error);
        }
      }
    }
  }

  console.log('Questions imported successfully!');
  await pool.end();
}

importQuestions();
