export default function QuizProgress({ current, total, onClose, hearts = 5 }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="quiz-header">
      <button className="quiz-close-btn" onClick={onClose} title="Exit quiz">
        ✕
      </button>
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ fontSize: 20, opacity: i < hearts ? 1 : 0.2 }}>
            ❤️
          </span>
        ))}
      </div>
      <div className="quiz-progress-wrap">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="quiz-progress-text">
          <span>
            Question {current} of {total || "?"}
          </span>

          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
