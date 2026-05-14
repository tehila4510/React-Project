import { useSelector } from 'react-redux';
import { useGetAllUserSkillProgressQuery } from '../Redux/api';
import { useGetAllSkillsQuery } from '../../Skill/Redux/api';
import './ProgressView.css';
import vocabulary    from "../../../../public/vocabulary.png";
import grammar       from "../../../../public/grammar.png";
import verbs         from "../../../../public/verbs.png";
import listening     from "../../../../public/listening.png";
import reading       from "../../../../public/reading.png";
import writing       from "../../../../public/writing.png";
import pronunciation from "../../../../public/pronun.png";
import phrases       from "../../../../public/phrases.png";

const SKILL_ICONS = {
  Vocabulary:    { icon: <span><img src={vocabulary}    alt="vocabulary"    /></span>, color: '#3B8FFF' },
  Grammar:       { icon: <span><img src={grammar}       alt="grammar"      /></span>, color: '#7B5EFF' },
  Verbs:         { icon: <span><img src={verbs}         alt="verbs"        /></span>, color: '#FFB800' },
  Listening:     { icon: <span><img src={listening}     alt="listening"    /></span>, color: '#FF5C7A' },
  Reading:       { icon: <span><img src={reading}       alt="reading"      /></span>, color: '#22C67A' },
  Writing:       { icon: <span><img src={writing}       alt="writing"      /></span>, color: '#FF8C42' },
  Pronunciation: { icon: <span><img src={pronunciation} alt="pronunciation"/></span>, color: '#5B8AFF' },
  Phrases:       { icon: <span><img src={phrases}       alt="phrases"      /></span>, color: '#C084FC' },
};

const DAYS_TO_SHOW = 25;

function buildHeatmap(progressList) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const practicedDates = new Set(
    progressList
      .filter(p => p.lastPracticed)
      .map(p => {
        const d = new Date(p.lastPracticed);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
  );

  return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - i));
    day.setHours(0, 0, 0, 0);
    return practicedDates.has(day.getTime()) ? 'l1' : '';
  });
}

function RingChart({ pct, color, label }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-chart">
      <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle
          cx="35" cy="35" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="ring-pct">{pct}%</div>
      <div className="ring-label">{label}</div>
    </div>
  );
}

export default function ProgressView() {
  const { currentUser } = useSelector((state) => state.user);

  const { data: skills = [],       isLoading: loadingSkills    } = useGetAllSkillsQuery();
  const { data: progressList = [], isLoading: loadingProgress  } = useGetAllUserSkillProgressQuery();

  if (loadingSkills || loadingProgress) return <div className="loading">Loading...</div>;

  const avgAccuracy   = progressList.length
    ? Math.round(progressList.reduce((s, p) => s + (p.accuracy || 0), 0) / progressList.length)
    : 0;

  const avgCompletion = progressList.length
    ? Math.round(progressList.reduce((s, p) => s + (p.progressPercent || 0), 0) / progressList.length)
    : 0;

  const weeklyXp = progressList.length
    ? progressList[0].weeklyXp ?? []
    : [];

// אם רוצים XP כולל מכל המיומניות:
// const weeklyXp = progressList.reduce((acc, p) => {
//   (p.weeklyXp || []).forEach((xp, i) => { acc[i] = (acc[i] || 0) + xp; });
//   return acc;
// }, Array(7).fill(0));

  const maxXp = Math.max(...weeklyXp, 1);

  const heatmap = buildHeatmap(progressList);

  return (
    <div className="bento-dashboard">
      <header className="dash-header">
        <h1>My Progress</h1>
      </header>

      <div className="bento-grid">

        <div className="card span-2">
          <h3>Weekly XP</h3>
          <div className="bar-chart">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bar-col">
                <div className="bar" style={{ height: `${((weeklyXp[i] || 0) / maxXp) * 100}%` }} />
                <span>{['S','M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Rings */}
        <div className="card span-2">
          <h3>Performance</h3>
          <div className="rings-container">
            <RingChart pct={avgAccuracy}   color="#22C67A" label="Accuracy"   />
            <RingChart pct={avgCompletion} color="#7B5EFF" label="Completion" />
            <RingChart pct={Math.min((currentUser?.currentLevel || 1) * 10, 100)} color="#FFB800" label="Level" />
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="card span-4">
          <h3>Skills Breakdown</h3>
          <div className="skills-grid-list">
            {skills.map((skill) => {
              const p       = progressList.find(item => item.skillId === skill.skillId);
              const percent = p?.progressPercent || 0;
              const meta    = SKILL_ICONS[skill.name] ;
              if(!meta) return null; // skip chat for now

              return (
                <div key={skill.skillId} className="skill-row">
                  <div className="skill-icon" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className="skill-info">
                    <div className="skill-header">
                      <span>{skill.name}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${percent}%`, backgroundColor: meta.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card span-4">
          <h3>Activity Heatmap</h3>
          <div className="heatmap">
            {heatmap.map((cls, i) => (
              <div key={i} className={`heat-cell ${cls}`} title={cls === 'l1' ? 'Practiced!' : ''} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}