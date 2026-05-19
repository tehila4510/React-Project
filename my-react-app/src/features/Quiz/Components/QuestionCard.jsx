
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const LEVEL_LABELS = {
  1: '🌱 Beginner',
  2: '📗 Elementary',
  3: '📘 Intermediate',
  4: '📙 Upper-Int',
  5: '📕 Advanced',
  6: '🏆 Proficient',
};

export default function QuestionCard({ question, selectedOption, onSelect, feedback, submitted }) {
  if (!question) return null;
const getOptionClass = (opt) => {
  let cls = 'option-btn';

  // 1. מצב בחירה (לפני לחיצה על Submit)
  if (!submitted) {
    if (selectedOption === opt.optionId) cls += ' selected';
    return cls;
  }

  // 2. מצב פידבק (אחרי לחיצה על Submit)
  // נבדוק אם האופציה הנוכחית היא זו שהמשתמש בחר
  const isSelected = selectedOption === opt.optionId;
  
  // נסתמך על הפידבק שהגיע מהשרת
  if (isSelected) {
    return feedback?.isCorrect ? 'option-btn correct' : 'option-btn wrong';
  }

  // אם זו לא האופציה שנבחרה, אבל השרת אמר שהיא הנכונה (חשיפת התשובה הנכונה במקרה של טעות)
  if (opt.isCorrect) {
    return 'option-btn correct';
  }

  return cls;
};

const getOptionIcon = (opt) => {
  if (!submitted || !feedback) return null;

  const isSelected = selectedOption === opt.optionId;

  if (isSelected) {
    return feedback.isCorrect ? 
      <span className="option-icon">✅</span> : 
      <span className="option-icon">❌</span>;
  }
  
  // חשיפת ה-V על התשובה הנכונה גם אם לא בחרנו בה
  if (opt.isCorrect) return <span className="option-icon">✅</span>;

  return null;
};
  return (
    <div className="quiz-card">
      {/* רמת קושי */}
      <div className="question-level-badge">
        {LEVEL_LABELS[question.levelId] || `Level ${question.levelId}`}
      </div>

      {/* כותרת */}
      {question.title && (
        <div className="question-title">{question.title}</div>
      )}

      {/* שאלה */}
      <div className="question-text">{question.questionText}</div>

      {/* תמונה אם יש */}
      {question.imageUrl && (
        <img
          src={`data:image/png;base64,${question.imageUrl}`}
          alt="Question"
          style={{ width: '100%', borderRadius: 12, marginBottom: 20, maxHeight: 200, objectFit: 'cover' }}
        />
      )}

      {/* אפשרויות */}
      <div className="options-grid">
        {question.options?.map((opt, idx) => (
          <button
            key={opt.optionId}
            className={getOptionClass(opt)}
            onClick={() => !submitted && onSelect(opt)}
            disabled={submitted}
          >
            <div className="option-letter">{LETTERS[idx]}</div>
            <span style={{ flex: 1 }}>{opt.optionText}</span>
            {getOptionIcon(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}
