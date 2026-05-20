export default function MatchingCard({ question, selectedOption, onSelect, submitted, feedback }) {
  return (
    <div className="quiz-card matching-mode">
      <div className="skill-badge">🔗 {question.Title}</div>
      <div className="question-text">{question.questionText}</div>
      <div className="options-vertical">
        {question.options.map((opt) => {
          const isSelected = selectedOption?.optionId === opt.optionId;
          let statusClass = "";
          if (submitted) {
            if (isSelected) statusClass = feedback?.isCorrect ? "correct" : "wrong";
            else if (opt.isCorrect) statusClass = "correct";
          } else if (isSelected) {
            statusClass = "selected";
          }
 
          // optionText הוא "phrase = meaning"
          const [left, right] = opt.optionText.split(" = ");
 
          return (
            <button
              key={opt.optionId}
              className={`opt-btn match-btn ${statusClass}`}
              onClick={() => !submitted && onSelect(opt)}
              disabled={submitted}
            >
              <span className="match-left">{left}</span>
              <span className="match-arrow">→</span>
              <span className="match-right">{right}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
 