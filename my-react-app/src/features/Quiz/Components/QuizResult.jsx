import { useEffect, useState } from 'react';
import home from "../../../../public/home.png";
import xp from "../../../../public/xp.png";
import '../styles/quizResult.css'; 

function ScoreRing({ score }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100);

  const color = 
    pct >= 80 ? '#10b981' : 
    pct >= 60 ? '#f59e0b' : 
    '#f43f5e';

  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle fill="none" stroke="#f1f5f9" strokeWidth="10" cx="70" cy="70" r={r} />
        <circle
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          cx="70" cy="70" r={r}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <text x="70" y="65" textAnchor="middle" dominantBaseline="middle" className="score-ring-label"
          style={{ fontSize: 28, fill: '#0f172a', fontWeight: 900, fontFamily: 'Inter' }}>
          {pct}%
        </text>
        <text x="70" y="90" textAnchor="middle"
          style={{ fontSize: 10, fill: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Final Score
        </text>
      </svg>
    </div>
  );
}


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
  const score = result?.score || 0;
  const xpGained = result?.xp || 0;
  const duration = result?.durationInMinutes ? `${Math.round(result.durationInMinutes)} min` : '—';

  useEffect(() => {
    const timer = setTimeout(() => setXpAnimated(xpGained), 300);
    return () => clearTimeout(timer);
  }, [xpGained]);

  const isGood = score >= 70;
  const isPerfect = score >= 90;

  return (
    <div className="result-wrapper">
      {(isPerfect || isGood) && <Confetti />}

      <div className="result-card">
        <span className="result-owl">{isPerfect ? '🥇' : '🎉'}</span>
        <div className="result-title">
          {isPerfect ? 'Outstanding!' : isGood ? 'Great Job!' : 'Keep it up!'}
        </div>
        <div className="result-subtitle">
          {isPerfect ? "You've mastered this lesson!" : "You're making great progress!"}
        </div>

        <ScoreRing score={score} />

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
            <div className="r-lbl">Time</div>
          </div>
        </div>

        <div className="xp-gained-wrap">
          <div className="xp-gained-label">
            <span><img src={xp} alt="xp" width="18px" /> XP Earned</span>
            <span style={{ color: '#4f46e5' }}>+{xpGained} XP</span>
          </div>
          <div className="xp-bar-outer">
            <div className="xp-bar-inner" style={{ width: `${Math.min((xpAnimated / 50) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="result-actions">
          <button className="result-home-btn" onClick={onHome}>
            <img src={home} alt="home" width="20px" style={{filter: 'invert(1)'}} /> Back to Home
          </button>
          {onPlayAgain && (
            <button className="result-again-btn" onClick={onPlayAgain}>
              🔄 Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
