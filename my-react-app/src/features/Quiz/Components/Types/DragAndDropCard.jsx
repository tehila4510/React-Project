// הנחה: options[0].optionText = "word1 / word2 / word3" (כמו Ordering)
// המשתמש גורר מילים לאזור ה-drop ומסדר אותן
 
import { useState } from "react";
 
export default function DragAndDropCard({ question, onSelect, submitted }) {
  const words = question.options[0]?.optionText.split(" / ") ?? [];
  const [arranged, setArranged] = useState([]);
  const [remaining, setRemaining] = useState([...words]);
 
  const addWord = (word, idx) => {
    if (submitted) return;
    const newArranged = [...arranged, word];
    const newRemaining = remaining.filter((_, i) => i !== idx);
    setArranged(newArranged);
    setRemaining(newRemaining);
    onSelect({ optionText: newArranged.join(" "), optionId: 999 });
  };
 
  const removeWord = (word, idx) => {
    if (submitted) return;
    const newArranged = arranged.filter((_, i) => i !== idx);
    setArranged(newArranged);
    setRemaining([...remaining, word]);
    onSelect({ optionText: newArranged.join(" "), optionId: 999 });
  };
 
  const reset = () => {
    if (submitted) return;
    setArranged([]);
    setRemaining([...words]);
    onSelect(null);
  };
 
  return (
    <div className="quiz-card ordering-mode">
      <div className="skill-badge">🔀 Drag & Drop</div>
      <div className="question-text">{question.questionText}</div>
 
      {/* אזור ה-drop - המילים שנבחרו */}
      <div className="drop-zone">
        {arranged.length === 0 && (
          <span className="drop-placeholder">Tap words to build your answer...</span>
        )}
        {arranged.map((word, i) => (
          <button key={i} className="word-bubble selected" onClick={() => removeWord(word, i)}>
            {word} ✕
          </button>
        ))}
      </div>
 
      {/* המילים שנותרו */}
      <div className="words-container">
        {remaining.map((word, i) => (
          <button key={i} className="word-bubble" onClick={() => addWord(word, i)}>
            {word}
          </button>
        ))}
      </div>
 
      {!submitted && arranged.length > 0 && (
        <button className="reset-btn" onClick={reset}>↺ Reset</button>
      )}
    </div>
  );
}