export default function PronunciationCard({ question, submitted }) {
  return (
    <div className="quiz-card speech-mode">
      <div className="target-word">"{question.questionText}"</div>
      <p>Tap the mic and say the word clearly</p>
      <button className={`mic-btn ${submitted ? 'disabled' : ''}`}>
        🎤
      </button>
      {submitted && <div className="voice-wave">Waveform analyzing...</div>}
    </div>
  );
}