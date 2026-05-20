export default function OrderingCard({ question, onSelect, submitted }) {
  // ב-Ordering בדרך כלל התשובה היא מחרוזת אחת שמחולקת ב- /
  const words = question.options[0].optionText.split(" / ");
  
  return (
    <div className="quiz-card ordering-mode">
      <h3>Put the words in order:</h3>
      <div className="words-container">
        {words.map((word, i) => (
          <div key={i} className="word-bubble">{word}</div>
        ))}
      </div>
      <textarea 
        placeholder="Type the full sentence here..."
        className="order-input"
        onChange={(e) => onSelect({ optionText: e.target.value, optionId: 999 })}
        disabled={submitted}
      />
    </div>
  );
}