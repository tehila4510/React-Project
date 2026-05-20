export default function ListeningCard({ question, selectedOption, onSelect, submitted }) {
  return (
    <div className="quiz-card listening-mode">
      <div className="skill-badge">🎧 {question.Title}</div>
      {question.audioSource && (
        <button className="audio-play-btn" onClick={() => new Audio(question.audioSource).play()}>
          🔊 Play Audio
        </button>
      )}
      <div className="context-box">
        <p>{question.questionText}</p>
      </div>
      <div className="options-vertical">
        {question.options.map(opt => (
          <button 
            key={opt.optionId} 
            className={`opt-btn ${selectedOption?.optionId === opt.optionId ? 'active' : ''}`}
            onClick={() => !submitted && onSelect(opt)}
          >
            {opt.optionText}
          </button>
        ))}
      </div>
    </div>
  );
}