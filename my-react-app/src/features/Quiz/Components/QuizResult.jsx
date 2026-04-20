// QuizResult.jsx
// מוצג בסוף הסשן עם ציון + XP
// props: result = SessionDto { sessionId, userId, score, xp, durationInMinutes }
//        correctCount, totalQuestions, onHome, onPlayAgain

import { useEffect, useState } from 'react';

function ScoreRing({ score }) {
  const r    = 56;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(score, 0), 100);

  const color =
    pct >= 80 ? '#22C67A' :
    pct >= 60 ? '#FFB800' :
    '#FF5C7A';

  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle
          fill="none" stroke="#EDE9FF" strokeWidth="10"
          cx="70" cy="70" r={r}
        />
        {/* Fill */}
        <circle
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          cx="70" cy="70" r={r}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        {/* Text */}
        <text x="70" y="65" className="score-ring-label" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, fill: '#1A1440', fontWeight: 900 }}>
          {pct}%
        </text>
        <text x="70" y="90" textAnchor="middle"
          style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fill: '#7B72A0', fontWeight: 800 }}>
          SCORE
        </text>
      </svg>
    </div>
  );
}

// קונפטי
function Confetti() {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left:  `${Math.random() * 100}%`,
    color: ['#7B5EFF','#3B8FFF','#FFB800','#22C67A','#FF5C7A','#FF8C42'][i % 6],
    delay: `${Math.random() * 1}s`,
    dur:   `${1.5 + Math.random() * 1.5}s`,
  }));
  return (
    <>
      {dots.map((d) => (
        <div key={d.id} className="confetti-dot"
          style={{ left: d.left, background: d.color, animationDelay: d.delay, animationDuration: d.dur }}
        />
      ))}
    </>
  );
}

export default function QuizResult({ result, correctCount, totalQuestions, onHome, onPlayAgain }) {
  const [xpAnimated, setXpAnimated] = useState(0);
  const score     = result?.score       || 0;
  const xpGained  = result?.xp          || 0;
  const duration  = result?.durationInMinutes
    ? `${Math.round(result.durationInMinutes)} min`
    : '—';

  // אנימציית XP
  useEffect(() => {
    const timer = setTimeout(() => setXpAnimated(xpGained), 300);
    return () => clearTimeout(timer);
  }, [xpGained]);

  const isGood = score >= 70;
  const isPerfect = score >= 90;

  const getTitle = () => {
    if (isPerfect) return 'Outstanding! 🏆';
    if (isGood)   return 'Well Done! 🎉';
    return 'Keep Practicing! 💪';
  };

  const getSub = () => {
    if (isPerfect) return "You're on fire! Perfect performance!";
    if (isGood)    return 'Great job! You\'re improving fast!';
    return 'Every mistake is a step forward. Keep going!';
  };

  return (
    <div className="result-wrapper">
      {isPerfect && <Confetti />}

      <div className="result-card">
        <span className="result-owl">{isPerfect ? '🦉✨' : isGood ? '🦉' : '🦉'}</span>
        <div className="result-title">{getTitle()}</div>
        <div className="result-subtitle">{getSub()}</div>

        {/* Ring */}
        <ScoreRing score={score} />

        {/* Stats */}
        <div className="result-stats">
          <div className="result-stat">
            <div className="r-val">{correctCount}</div>
            <div className="r-lbl">Correct</div>
          </div>
          <div className="result-stat">
            <div className="r-val">{totalQuestions - correctCount}</div>
            <div className="r-lbl">Wrong</div>
          </div>
          <div className="result-stat">
            <div className="r-val">{duration}</div>
            <div className="r-lbl">Duration</div>
          </div>
        </div>

        {/* XP gained */}
        <div className="xp-gained-wrap">
          <div className="xp-gained-label">
            <span>⚡ XP Earned</span>
            <span style={{ color: '#7B5EFF', fontSize: 15 }}>+{xpGained} XP</span>
          </div>
          <div className="xp-bar-outer">
            <div
              className="xp-bar-inner"
              style={{ width: `${Math.min((xpAnimated / 50) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <button className="result-home-btn" onClick={onHome}>
          🏠 Back to Home
        </button>
        {onPlayAgain && (
          <button className="result-again-btn" onClick={onPlayAgain}>
            🔄 Play Again
          </button>
        )}
      </div>
    </div>
  );
}
