import { useSelector } from 'react-redux';
import { useGetAllUserAnswersQuery } from '../Redux/api';
import './ErrorsView.css';

export default function ErrorsView() {
  const { currentUser } = useSelector((state) => state.user);

  const { data: answers, isLoading, isError } = useGetAllUserAnswersQuery();

  const myErrors = answers?.filter(
    (a) => a.userId === currentUser?.userId && a.isCorrect === false
  );

  if (isLoading) {
    return (
      <div className="ev-page">
        <div className="ev-loading">
          <div className="ev-spinner" />
          Loading mistakes...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="ev-page">
        <div className="ev-error-state">⚠️ Could not load mistakes.</div>
      </div>
    );
  }

  return (
    <div className="ev-page">

      <div className="ev-header">
        <div className="ev-header-left">
          <h1>My Mistakes</h1>
          <p>Review and practice your errors</p>
        </div>
        <div className="ev-count-pill">{myErrors?.length || 0} errors</div>
      </div>

      {myErrors?.length === 0 && (
        <div className="ev-empty">
          <div className="ev-empty-emoji">🎉</div>
          <div className="ev-empty-title">No mistakes yet!</div>
          <div className="ev-empty-sub">Keep it up!</div>
        </div>
      )}

      <div className="ev-list">
        {myErrors?.map((answer, i) => (
          <div
            className="ev-card"
            key={answer.answerId}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="ev-question">
              {answer.questionText || `Question #${answer.questionId}`}
            </div>

            <div className="ev-answers">
              <div className="ev-chip wrong">
                <div className="ev-chip-label">❌ Your answer</div>
                <div className="ev-chip-value">{answer.answerText}</div>
              </div>
              <div className="ev-chip correct">
                <div className="ev-chip-label">✅ Correct</div>
                <div className="ev-chip-value">{answer.correctAnswer || '—'}</div>
              </div>
            </div>

            <div className="ev-footer">
              <div className="ev-meta">
                <span className="ev-skill">
                  {answer.skillName || 'Unknown skill'}
                </span>
                <span className="ev-date">
                  {answer.answeredAt
                    ? new Date(answer.answeredAt).toLocaleDateString()
                    : 'Unknown date'}
                </span>
              </div>
              <button className="ev-retry-btn">🔄 Practice</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
