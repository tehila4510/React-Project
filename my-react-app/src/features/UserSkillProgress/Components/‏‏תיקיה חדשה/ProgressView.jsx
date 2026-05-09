import { useSelector } from 'react-redux';
import { useGetAllUserSkillProgressQuery } from '../Redux/api';
import { useRef } from 'react';
import './ProgressView.css';

const SKILL_META = {
  Vocabulary:    { icon: '📚', color: '#3B8FFF' },
  Grammar:       { icon: '📝', color: '#7B5EFF' },
  Verbs:         { icon: '⚡', color: '#FFB800' },
  Listening:     { icon: '🎧', color: '#FF5C7A' },
  Reading:       { icon: '📖', color: '#22C67A' },
  Writing:       { icon: '✏️',  color: '#FF8C42' },
  Pronunciation: { icon: '🗣️',  color: '#5B8AFF' },
  Phrases:       { icon: '💬', color: '#C084FC' },
};

function genHeatmap() {
  return Array.from({ length: 35 }, () => {
    const r = Math.random();
    return r < 0.3 ? '' : r < 0.55 ? 'l1' : r < 0.75 ? 'l2' : r < 0.9 ? 'l3' : 'l4';
  });
}

/* ── Ring chart component ── */
function RingChart({ pct, color, label }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="circle-stat">
      <svg width="86" height="86" viewBox="0 0 86 86" style={{ transform: 'rotate(-90deg)' }}>
        <circle className="ring-track" cx="43" cy="43" r={r} />
        <circle
          className="ring-fill"
          cx="43" cy="43" r={r}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
        <text x="43" y="43" className="ring-text">{pct}%</text>
      </svg>
      <span>{label}</span>
    </div>
  );
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ProgressView() {
  const { currentUser } = useSelector((state) => state.user);
  const heatmap = useRef(genHeatmap()).current;

  const { data: progressList, isLoading, isError } =
    useGetAllUserSkillProgressQuery();

  /* ── loading ── */
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

  /* ── error ── */
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

  return (
    <div className="page">

      <div className="progress-title">📊 My Progress</div>

      {/* ── TOP CHARTS ── */}
      <div className="charts-grid">

        {/* Weekly XP */}
        <div className="chart-card">
          <div className="chart-title">⚡ Weekly XP</div>
          <div className="chart-sub">Points earned this week</div>
          <div className="bar-chart-wrap">
            {DAY_LABELS.map((lbl, i) => (
              <div key={lbl} className="bar-col">
                <div
                  className={`bar-fill${i === 6 ? ' today' : ''}`}
                  style={{ height: `${((weeklyXp[i] || 0) / maxBar) * 100}%` }}
                />
                <div className="bar-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance rings */}
        <div className="chart-card">
          <div className="chart-title">🎯 Performance</div>
          <div className="chart-sub">Average by category</div>
          <div className="rings-wrap">
            <RingChart pct={avgAccuracy}                          color="#22C67A" label="Accuracy"   />
            <RingChart pct={avgCompletion}                        color="#7B5EFF" label="Completion" />
            <RingChart pct={currentUser?.currentLevel * 20 || 0} color="#FFB800" label="Level"      />
          </div>
        </div>
      </div>

      {/* ── ACTIVITY HEATMAP ── */}
      <div className="chart-card heatmap-card">
        <div className="chart-title">🗓️ Activity Map</div>
        <div className="chart-sub">Last 5 weeks of learning days</div>

        <div className="heatmap-day-labels">
          {DAY_LABELS.map((d) => (
            <div key={d} className="heatmap-day-lbl">{d}</div>
          ))}
        </div>

        <div className="heatmap">
          {heatmap.map((cls, i) => (
            <div key={`${cls}-${i}`} className={`heat-cell ${cls}`} />
          ))}
        </div>

        {/* legend */}
        <div className="heatmap-legend">
          <span>Less</span>
          {['', 'l1', 'l2', 'l3', 'l4'].map((l) => (
            <div key={l} className={`legend-cell heat-cell ${l}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* ── SKILLS BREAKDOWN ── */}
      <div className="chart-card skills-breakdown-card">
        <div className="chart-title">📚 Skills Breakdown</div>
        <div className="chart-sub">Your progress per skill</div>

        <div style={{ marginTop: 16 }}>
          {progressList?.map((p) => {
            const meta = SKILL_META[p.skillName] || { icon: '📘', color: '#7B5EFF' };
            return (
              <div key={p.userSkillProgressId} className="skill-row">
                <div className="skill-row-icon">{meta.icon}</div>
                <div className="skill-row-name">{p.skillName}</div>
                <div className="skill-row-bar-bg">
                  <div
                    className="skill-row-bar-fill"
                    style={{
                      width:      `${p.progressPercent || 0}%`,
                      background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)`,
                    }}
                  />
                </div>
                <div className="skill-row-pct">{p.progressPercent || 0}%</div>
              </div>
            );
          })}

          {(!progressList || progressList.length === 0) && (
            <div className="progress-empty">
              No progress yet. Start a skill! 🚀
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
