export default function TranslationCard({ question, selectedOption, onSelect, submitted }) {
  return (
    <div className="quiz-card translation-mode">
      <div className="hebrew-prompt" dir="rtl">
        {question.questionText}
      </div>
      <div className="translation-divider">מתרגמים לראש...</div>
      <div className="options-grid">
        {question.options.map(opt => (
          <button 
            key={opt.optionId}
            className={`opt-btn-trans ${selectedOption?.optionId === opt.optionId ? 'selected' : ''}`}
            onClick={() => !submitted && onSelect(opt)}
          >
            {opt.optionText}
          </button>
        ))}
      </div>
    </div>
  );
}