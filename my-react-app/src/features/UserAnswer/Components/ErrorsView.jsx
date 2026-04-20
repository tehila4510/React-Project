import { useSelector } from 'react-redux';
import { useGetAllUserAnswersQuery } from '../Redux/api';

export default function ErrorsView() {
  const { currentUser } = useSelector((state) => state.user);

  const {
    data: answers,
    isLoading,
    isError,
  } = useGetAllUserAnswersQuery();

  // סנן רק תשובות שגויות של המשתמש הנוכחי
  const myErrors = answers?.filter(
    (a) => a.userId === currentUser?.userId && a.isCorrect === false
  );

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          Loading mistakes...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <div className="error-state">⚠️ Could not load mistakes.</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ marginBottom: 22 }}>
        <div className="section-title">
          ❌ My Mistakes
          <span className="section-badge">{myErrors?.length || 0} errors</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
          Review your mistakes and practice them again
        </div>
      </div>

      {myErrors?.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: 'var(--text-muted)', fontWeight: 700,
        }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: 'var(--text)' }}>
            No mistakes yet!
          </div>
          <div>Keep it up!</div>
        </div>
      )}

      <div className="errors-list">
        {myErrors?.map((answer) => (
          <div className="error-card" key={answer.answerId}>
            <div className="error-icon">📝</div>
            <div className="error-content">

              {/* שאלה — אם יש questionText על האובייקט */}
              <div className="error-question">
                {answer.questionText || `Question #${answer.questionId}`}
              </div>

              <div className="error-answer">
                ❌ You answered:{' '}
                <span className="wrong">{answer.answerText}</span>
                {'  '}
                ✅ Correct:{' '}
                <span className="right">{answer.correctAnswer || '—'}</span>
              </div>

              <div className="error-meta">
                <span className="error-tag">
                  {answer.skillName || 'Unknown skill'}
                </span>
                <span>
                  🕐{' '}
                  {answer.answeredAt
                    ? new Date(answer.answeredAt).toLocaleDateString()
                    : 'Unknown date'}
                </span>
              </div>
            </div>

            <button className="retry-btn">🔄 Practice</button>
          </div>
        ))}
      </div>
    </div>
  );
}
