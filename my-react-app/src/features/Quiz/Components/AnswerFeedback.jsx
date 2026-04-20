
const CORRECT_EMOJIS  = ['🎉', '⭐', '🔥', '💪', '🦉', '✨'];
const WRONG_EMOJIS    = ['😅', '🤔', '💡', '📚', '🧠'];

const CORRECT_TITLES  = ['Excellent!', 'Amazing!', 'You got it!', 'Correct!', 'Brilliant!'];
const WRONG_TITLES    = ['Not quite!', 'Almost!', 'Keep trying!', 'Good effort!'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function AnswerFeedback({ feedback, onNext, isLastQuestion }) {
  if (!feedback) return null;

  const isCorrect = feedback.isCorrect;
  const emoji     = isCorrect ? randomFrom(CORRECT_EMOJIS) : randomFrom(WRONG_EMOJIS);
  const title     = isCorrect ? randomFrom(CORRECT_TITLES) : randomFrom(WRONG_TITLES);

  return (
    <>
      {/* פאנל פידבק */}
      <div className={`feedback-panel ${isCorrect ? 'correct' : 'wrong'}`}>
        <div className="feedback-emoji">{emoji}</div>
        <div className="feedback-content">
          <div className="feedback-title">{title}</div>

          {feedback.feedbackMessage && (
            <div className="feedback-msg">{feedback.feedbackMessage}</div>
          )}

          {!isCorrect && feedback.correctAnswerText && (
            <div className="feedback-correct-answer">
              ✅ Correct answer: <span>{feedback.correctAnswerText}</span>
            </div>
          )}
        </div>
      </div>

      {/* כפתור הבא */}
      <button
        className={`quiz-next-btn ${isCorrect ? 'correct' : 'wrong'}`}
        onClick={onNext}
      >
        {isLastQuestion
          ? '🏁 See Results!'
          : isCorrect
            ? '→ Next Question'
            : '→ Keep Going'}
      </button>
    </>
  );
}
