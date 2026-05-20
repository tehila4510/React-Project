const LETTERS = ['A', 'B', 'C', 'D'];

export default function MultipleChoice({ question, selectedOption, onSelect, feedback, submitted }) {
  return (
    <div className="quiz-card">
      <div className="question-text">{question.questionText}</div>
      <div className="options-grid">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption?.optionId === opt.optionId;
          const isCorrect = opt.isCorrect;
          let statusClass = "";
          if (submitted) {
            if (isSelected) statusClass = feedback.isCorrect ? "correct" : "wrong";
            else if (isCorrect) statusClass = "correct";
          } else if (isSelected) statusClass = "selected";

          return (
            <button key={opt.optionId} className={`option-btn ${statusClass}`} onClick={() => !submitted && onSelect(opt)} disabled={submitted}>
              <div className="option-letter">{LETTERS[idx]}</div>
              {opt.optionText}
            </button>
          );
        })}
      </div>
    </div>
  );
}