
import { useState } from "react";
 
export default function MultipleAnswerCard({ question, onSelect, submitted, feedback }) {
  const [checked, setChecked] = useState({});
 
  const toggle = (opt) => {
    if (submitted) return;
    const next = { ...checked, [opt.optionId]: !checked[opt.optionId] };
    setChecked(next);
    // שולחים את כל האפשרויות הנבחרות כטקסט מחובר
    const selectedTexts = question.options
      .filter((o) => next[o.optionId])
      .map((o) => o.optionText)
      .join(", ");
    onSelect({ optionText: selectedTexts, optionId: -1 });
  };
 
  return (
    <div className="quiz-card">
      <div className="skill-badge">☑️ Select all that apply</div>
      <div className="question-text">{question.questionText}</div>
      <div className="options-grid">
        {question.options.map((opt) => {
          const isChecked = !!checked[opt.optionId];
          let statusClass = "";
          if (submitted) {
            if (isChecked && opt.isCorrect)  statusClass = "correct";
            if (isChecked && !opt.isCorrect) statusClass = "wrong";
            if (!isChecked && opt.isCorrect) statusClass = "correct"; // הראה מה היה נכון
          } else if (isChecked) {
            statusClass = "selected";
          }
 
          return (
            <button
              key={opt.optionId}
              className={`option-btn ${statusClass}`}
              onClick={() => toggle(opt)}
              disabled={submitted}
            >
              <div className="option-letter">{isChecked ? "✓" : "○"}</div>
              {opt.optionText}
            </button>
          );
        })}
      </div>
      <p className="multi-hint">You may select more than one answer</p>
    </div>
  );
}