import { useState } from 'react';
import './QuizForm.css';

export default function QuizForm({ onStartQuiz }) {
  const [selectedTopic, setSelectedTopic] = useState('Artificial Intelligence');
  const [questionCount, setQuestionCount] = useState(5);

  const topics = [
    'Artificial Intelligence',
    'Machine Learning',
    'Python Programming',
    'Web Development',
    'Data Science',
    'Cloud Computing',
    'Cybersecurity',
    'Databases',
    'Mobile Development',
    'DevOps'
  ];

  const handleStart = () => {
    onStartQuiz(selectedTopic, questionCount);
  };

  return (
    <div className="quiz-form-container">
      <div className="form-card">
        <h2>🎯 Start Your Quiz</h2>

        <div className="form-group">
          <label htmlFor="topic">Select Topic:</label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="count">Number of Questions: {questionCount}</label>
          <div className="slider-container">
            <input
              id="count"
              type="range"
              min="1"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            />
          </div>
          <small>Select between 1-10 questions</small>
        </div>

        <button onClick={handleStart} className="btn-start">
          Start Quiz
        </button>
      </div>
    </div>
  );
}
