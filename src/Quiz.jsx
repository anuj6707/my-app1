import { useState, useEffect } from 'react';
import './Quiz.css';
import QuizForm from './QuizForm';
import QuizDisplay from './QuizDisplay';

export default function Quiz({ username, onLogout }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleStartQuiz = (selectedTopic, questionCount) => {
    setTopic(selectedTopic);
    setScore(0);
    setQuizStarted(true);
    generateQuestions(selectedTopic, questionCount);
  };

  const generateQuestions = async (selectedTopic, questionCount) => {
    setLoading(true);
    setError('');

    try {
      const { generateMCQQuestions } = await import('./geminiApi');
      const generatedQuestions = await generateMCQQuestions(selectedTopic, questionCount);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswer(null);
      setSubmitted(false);
    } catch (err) {
      setError(`Failed to generate questions: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answer) => {
    if (!submitted) {
      setUserAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (userAnswer === null) {
      alert('Please select an answer');
      return;
    }

    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(null);
      setSubmitted(false);
    } else {
      // Quiz complete
      alert(`Quiz Complete! Final Score: ${score + (submitted && userAnswer === currentQuestion.correctAnswer ? 1 : 0)}/${questions.length}`);
      setQuizStarted(false);
      setQuestions([]);
    }
  };

  const handleEndQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setScore(0);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>🧠 AI Quiz Master</h1>
        <div className="user-info">
          <span>Welcome, <strong>{username}</strong>!</span>
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!quizStarted ? (
        <QuizForm onStartQuiz={handleStartQuiz} />
      ) : loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating your questions...</p>
        </div>
      ) : currentQuestion ? (
        <QuizDisplay
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          userAnswer={userAnswer}
          submitted={submitted}
          score={score}
          onSelectAnswer={handleSelectAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          onEndQuiz={handleEndQuiz}
        />
      ) : null}
    </div>
  );
}
