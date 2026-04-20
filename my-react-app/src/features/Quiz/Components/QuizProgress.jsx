// QuizProgress.jsx — Progress bar + skill badge + close button

export default function QuizProgress({ current, total, skillName, skillIcon, onClose }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="quiz-header">
      {/* כפתור סגירה */}
      <button className="quiz-close-btn" onClick={onClose} title="Exit quiz">
        ✕
      </button>

      {/* Progress bar */}
      <div className="quiz-progress-wrap">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="quiz-progress-text">
          <span>Question {current} of {total || '?'}</span>
          <span>{pct}%</span>
        </div>
      </div>

      {/* Skill badge */}
      <div className="quiz-skill-badge">
        <span>{skillIcon || '📚'}</span>
        <span>{skillName || 'Quiz'}</span>
      </div>
    </div>
  );
}
