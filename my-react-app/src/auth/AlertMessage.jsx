export default function AlertMessage({ alert }) {
  if (!alert) return null;

  return (
    <div className={`alert ${alert.type}`}>
      {/* אם ההודעה היא אובייקט, נציג מחרוזת ריקה או הודעה כללית */}
      {typeof alert.msg === 'string' ? alert.msg : "משהו השתבש..."}
    </div>
  );
}