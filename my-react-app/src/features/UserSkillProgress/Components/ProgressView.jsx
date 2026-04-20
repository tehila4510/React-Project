import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserSkillProgressByIdQuery } from '../Redux/api';


const SKILL_META = {
  Vocabulary:    { icon: '📚', color: '#3B8FFF' },
  Grammar:       { icon: '📝', color: '#7B5EFF' },
  Verbs:         { icon: '⚡', color: '#FFB800' },
  Listening:     { icon: '🎧', color: '#FF5C7A' },
  Reading:       { icon: '📖', color: '#22C67A' },
  Writing:       { icon: '✏️',  color: '#FF8C42' },
  Pronunciation: { icon: '🗣️',  color: '#5B8AFF' },
  Phrases:       { icon: '💬', color: '#C9A7FF' },
};

function genHeatmap() {
  return Array.from({ length: 35 }, () => {
    const r = Math.random();
    return r < 0.3 ? '' : r < 0.55 ? 'l1' : r < 0.75 ? 'l2' : r < 0.9 ? 'l3' : 'l4';
  });
}

function RingChart({ pct, color, label }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="circle-stat">
      <svg width="86" height="86" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 86 86">
        <circle fill="none" stroke="var(--bg3)" strokeWidth="8" cx="43" cy="43" r={r} />
        <circle
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          cx="43" cy="43" r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <text
          x="43" y="43"
          style={{ transform: 'rotate(90deg)', fontFamily: "'Fredoka One',cursive", fontSize: 16, fill: 'var(--text)' }}
          dominantBaseline="middle" textAnchor="middle"
        >
          {pct}%
        </text>
      </svg>
      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

export default function ProgressView() {
  const { currentUser } = useSelector((state) => state.user);
  const heatmap = useRef(genHeatmap()).current;

  const {
    data: progressList,
    isLoading,
    isError,
  } = useGetUserSkillProgressByIdQuery(1);

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          Loading progress...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <div className="error-state">⚠️ Could not load progress.</div>
      </div>
    );
  }

  const avgAccuracy = progressList?.length
    ? Math.round(progressList.reduce((s, p) => s + (p.accuracy || 0), 0) / progressList.length)
    : 0;

  const avgCompletion = progressList?.length
    ? Math.round(progressList.reduce((s, p) => s + (p.progressPercent || 0), 0) / progressList.length)
    : 0;

  const weeklyXp = progressList?.slice(0, 7).map((p) => p.weeklyXp || 0) || [];
  const maxBar   = Math.max(...weeklyXp, 1);
  const LABELS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="page">
      <div className="section-title" style={{ marginBottom: 20 }}>📊 My Progress</div>

      <div className="charts-grid">

        {/* XP שבועי */}
        <div className="chart-card">
          <div className="chart-title">⚡ Weekly XP</div>
          <div className="chart-sub">Points earned this week</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 105 }}>
            {LABELS.map((lbl, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <div style={{
                  width: '100%',
                  height: `${((weeklyXp[i] || 0) / maxBar) * 100}%`,
                  minHeight: 4,
                  borderRadius: '8px 8px 0 0',
                  background: 'linear-gradient(180deg, var(--purple), var(--blue))',
                  opacity: i === 6 ? 1 : 0.7,
                  transition: 'height 1.2s',
                }} />
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ביצועים */}
        <div className="chart-card">
          <div className="chart-title">🎯 Performance</div>
          <div className="chart-sub">Average by category</div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <RingChart pct={avgAccuracy}   color="var(--green)"  label="Accuracy"   />
            <RingChart pct={avgCompletion} color="var(--purple)" label="Completion" />
            <RingChart pct={currentUser?.currentLevel * 20 || 0} color="var(--yellow)" label="Level" />
          </div>
        </div>
      </div>

      {/* מפת פעילות */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-title">🗓️ Activity Map</div>
        <div className="chart-sub">Last 5 weeks of learning days</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {LABELS.map((d) => (
            <div key={d} style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, width: 'calc(14.28% - 4px)', textAlign: 'center' }}>
              {d}
            </div>
          ))}
        </div>
        <div className="heatmap">
          {heatmap.map((cls, i) => (
            <div key={i} className={`heat-cell ${cls}`} />
          ))}
        </div>
      </div>

      {/* פירוט לפי מיומנות */}
      <div className="chart-card">
        <div className="chart-title">📚 Skills Breakdown</div>
        <div className="chart-sub">Your progress per skill</div>
        <div style={{ marginTop: 16 }}>
          {progressList?.map((p) => {
            const meta = SKILL_META[p.skillName] || { icon: '📘', color: '#7B5EFF' };
            return (
              <div key={p.skillProgressId} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 11 }}>
                <div style={{ fontSize: 20, width: 26, textAlign: 'center' }}>{meta.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, width: 110, color: 'var(--text)' }}>{p.skillName}</div>
                <div style={{ flex: 1, height: 9, background: 'var(--bg3)', borderRadius: 9, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 9,
                    width: `${p.progressPercent || 0}%`,
                    background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)`,
                    transition: 'width 1.5s',
                  }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', width: 36, textAlign: 'right' }}>
                  {p.progressPercent || 0}%
                </div>
              </div>
            );
          })}

          {(!progressList || progressList.length === 0) && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700, padding: '20px 0' }}>
              No progress yet. Start a skill! 🚀
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
