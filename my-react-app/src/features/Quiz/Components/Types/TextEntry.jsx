export default function TextEntry({ question, userTypedAnswer, onType, feedback, submitted }) {
  return (
    <div className="quiz-card text-mode">
      <div className="question-text">{question.questionText}</div>
      <input
        type="text"
        className={`quiz-text-input ${
          submitted ? (feedback?.isCorrect ? "correct" : "wrong") : ""
        }`}
        placeholder="Type your answer..."
        value={userTypedAnswer}
        onChange={(e) => onType(e.target.value)}
        disabled={submitted}
        autoFocus
      />
      {submitted && !feedback?.isCorrect && (
        <div className="correct-answer-reveal">
          <span className="reveal-label">Correct:</span>
          <span className="reveal-value">{question.options[0]?.optionText}</span>
        </div>
      )}
    </div>
  );
}