import { useState, useEffect } from 'react';
import './QuizDisplay.css';

export default function QuizDisplay({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  submitted,
  score,
  onSelectAnswer,
  onSubmitAnswer,
  onNextQuestion,
  onEndQuiz
}) {
  const [explanation, setExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const isCorrect = userAnswer === question.correctAnswer;

  useEffect(() => {
    if (submitted && !isCorrect) {
      loadExplanation();
    }
  }, [submitted]);

  const loadExplanation = async () => {
    setLoadingExplanation(true);
    try {
      const { generateExplanation } = await import('./geminiApi');
      const exp = await generateExplanation(
        question.question,
        userAnswer,
        question.correctAnswer
      );
      setExplanation(exp);
    } catch (err) {
      setExplanation('Could not generate explanation. Check the answer and try again!');
      console.error('Error:', err);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <div className="quiz-display">
      <div className="quiz-progress">
        <span>Question {questionNumber} of {totalQuestions}</span>
        <span className="score-badge">Score: {score}</span>
      </div>

      <div className="question-box">
        <h2>{question.question}</h2>
      </div>

      <div className="options-container">
        {question.options.map((option, index) => {
          const isSelected = userAnswer === option;
          const isCorrectOption = option === question.correctAnswer;
          const isIncorrectSelected = submitted && isSelected && !isCorrect;

          return (
            <button
              key={index}
              className={`option ${
                isSelected ? 'selected' : ''
              } ${
                submitted && isCorrectOption ? 'correct' : ''
              } ${
                isIncorrectSelected ? 'incorrect' : ''
              }`}
              onClick={() => onSelectAnswer(option)}
              disabled={submitted}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {submitted && isCorrectOption && <span className="check-icon">✓</span>}
              {submitted && isIncorrectSelected && <span className="cross-icon">✗</span>}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
          {isCorrect ? (
            <>
              <span className="emoji">✅</span>
              <div>
                <strong>Correct!</strong> Well done!
              </div>
            </>
          ) : (
            <>
              <span className="emoji">❌</span>
              <div>
                <strong>Incorrect.</strong> The correct answer is: <strong>{question.correctAnswer}</strong>
                {loadingExplanation && <p className="loading-exp">Loading explanation...</p>}
                {explanation && <p className="explanation">{explanation}</p>}
              </div>
            </>
          )}
        </div>
      )}

      <div className="button-group">
        {!submitted ? (
          <button onClick={onSubmitAnswer} className="btn-submit-answer">
            Submit Answer
          </button>
        ) : (
          <>
            <button onClick={onNextQuestion} className="btn-next">
              {questionNumber === totalQuestions ? 'See Results' : 'Next Question'}
            </button>
            <button onClick={onEndQuiz} className="btn-end">
              End Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
