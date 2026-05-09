import { useSelector } from 'react-redux';
import { useGetAllUserSkillProgressQuery } from '../Redux/api';
import { useRef } from 'react';
import './ProgressView.css';

const ALL_SKILLS = ['Vocabulary', 'Grammar', 'Verbs', 'Listening', 'Reading', 'Writing', 'Pronunciation', 'Phrases'];

const SKILL_META = {
  Vocabulary:    { icon: '📚', color: '#3B8FFF' },
  Grammar:       { icon: '📝', color: '#7B5EFF' },
  Verbs:         { icon: '⚡', color: '#FFB800' },
  Listening:     { icon: '🎧', color: '#FF5C7A' },
  Reading:       { icon: '📖', color: '#22C67A' },
  Writing:       { icon: '✏️', color: '#FF8C42' },
  Pronunciation: { icon: '🗣️', color: '#5B8AFF' },
  Phrases:       { icon: '💬', color: '#C084FC' },
};

function RingChart({ pct, color, label }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-chart">
      <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" />
      </svg>
      <div className="ring-pct">{pct}%</div>
      <div className="ring-label">{label}</div>
    </div>
  );
}

export default function ProgressView() {
  const { currentUser } = useSelector((state) => state.user);
  const { data: progressList = [], isLoading } = useGetAllUserSkillProgressQuery();
  const heatmap = useRef(Array.from({ length: 35 }, () => (Math.random() > 0.5 ? 'l1' : ''))).current;

  if (isLoading) return <div className="loading">Loading...</div>;

  const avgAccuracy = progressList.length ? Math.round(progressList.reduce((s, p) => s + (p.accuracy || 0), 0) / progressList.length) : 0;
  const avgCompletion = progressList.length ? Math.round(progressList.reduce((s, p) => s + (p.progressPercent || 0), 0) / progressList.length) : 0;
  const weeklyXp = progressList.slice(0, 7).map((p) => p.weeklyXp || 0);

  return (
    <div className="bento-dashboard">
      <header className="dash-header">
        <h1>My Progress</h1>
      </header>

      <div className="bento-grid">
        {/* Weekly XP */}
        <div className="card span-2">
          <h3>Weekly XP</h3>
          <div className="bar-chart">
             {Array.from({length: 7}).map((_, i) => (
                <div key={i} className="bar-col">
                  <div className="bar" style={{ height: `${(weeklyXp[i] || 0) / 10}%` }} />
                  <span>{['M','T','W','T','F','S','S'][i]}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Performance Rings */}
        <div className="card span-2">
          <h3>Performance</h3>
          <div className="rings-container">
            <RingChart pct={avgAccuracy} color="#22C67A" label="Accuracy" />
            <RingChart pct={avgCompletion} color="#7B5EFF" label="Completion" />
            <RingChart pct={(currentUser?.currentLevel || 1) * 10} color="#FFB800" label="Level" />
          </div>
        </div>

        {/* Skills Breakdown - THE MASTER LIST */}
        <div className="card span-4">
          <h3>Skills Breakdown</h3>
          <div className="skills-grid-list">
            {ALL_SKILLS.map((skillName) => {
              const p = progressList.find(item => item.skillName === skillName);
              const percent = p?.progressPercent || 0;
              const meta = SKILL_META[skillName] || { icon: '📘', color: '#ccc' };
              return (
                <div key={skillName} className="skill-row">
                  <div className="skill-icon" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>{meta.icon}</div>
                  <div className="skill-info">
                    <div className="skill-header"><span>{skillName}</span><span>{percent}%</span></div>
                    <div className="bar-bg"><div className="bar-fill" style={{ width: `${percent}%`, backgroundColor: meta.color }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="card span-4">
            <h3>Activity Heatmap</h3>
            <div className="heatmap">
                {heatmap.map((cls, i) => <div key={i} className={`heat-cell ${cls}`} />)}
            </div>
        </div>

      </div>
    </div>
  );
}