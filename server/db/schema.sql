CREATE TABLE questions (
  id VARCHAR(36) PRIMARY KEY,
  text TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  difficulty VARCHAR(255) NOT NULL
);

CREATE TABLE options (
  id VARCHAR(36) PRIMARY KEY,
  question_id VARCHAR(36) NOT NULL,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  explanation TEXT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mode VARCHAR(255) NOT NULL,
  correct_answers INT NOT NULL,
  incorrect_answers INT NOT NULL,
  omitted_answers INT NOT NULL,
  total_questions INT NOT NULL,
  time_spent INT NOT NULL,
  timestamp TIMESTAMP NOT NULL
);

CREATE TABLE answered_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_result_id INT NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  selected_options JSON NOT NULL,
  is_correct BOOLEAN NOT NULL,
  FOREIGN KEY (quiz_result_id) REFERENCES quiz_results(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);