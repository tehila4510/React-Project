import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllSkillsQuery } from '../../Skill/Redux/api';
import { useGetAllUserSkillProgressQuery } from '../Redux/api';
import LessonPath from './LessonPath';

const SKILL_ICONS =  {
  Vocabulary:    { icon: '📚', color: '#3B8FFF' },
  Grammar:       { icon: '📝', color: '#7B5EFF' },
  Verbs:         { icon: '⚡', color: '#FFB800' },
  Listening:     { icon: '🎧', color: '#FF5C7A' },
  Reading:       { icon: '📖', color: '#22C67A' },
  Writing:       { icon: '✏️',  color: '#FF8C42' },
  Pronunciation: { icon: '🗣️',  color: '#5B8AFF' },
  Phrases:       { icon: '💬', color: '#C9A7FF' },
  chat:          {icon: '💬', color: '#6b29d6'}
};

export default function HomeView() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showPath, setShowPath]           = useState(false);
  const [showQuiz, setShowQuiz]           = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const {
    data: skills,
    isLoading: loadingSkills,
    isError: errorSkills,
  } = useGetAllSkillsQuery();

  const {
    data: progressList,
    isLoading: loadingProgress,
  } = useGetAllUserSkillProgressQuery(currentUser?.userId);

  const skillsWithStatus = skills?.map((skill) => {
    const userProgress = progressList?.find(
      (p) => p.skillId === skill.skillId
    );
    const meta = SKILL_ICONS[skill.name] || { icon: '📘', color: '#7B5EFF' };

    return {
      ...skill,
      icon:     meta.icon,
      color:    meta.color,
      // נועל אם רמת המשתמש נמוכה מהרמה הנדרשת
      unlocked: (currentUser?.currentLevel || 1) >= skill.recommendedLevelId,
      // אחוז התקדמות מהשרת, ברירת מחדל 0
      progress: userProgress?.progressPercent || 0,
    };
  });

  // ── Loading ──
  if (loadingSkills || loadingProgress) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          Loading skills...
        </div>
      </div>
    );
  }

  // ── Error ──
  if (errorSkills) {
    return (
      <div className="page">
        <div className="error-state">
          ⚠️ Could not load skills. Is the server running?
        </div>
      </div>
    );
  }

  // ── Lesson Path ──
  if (showQuiz && selectedSkill) {
    return <QuizPage skill={selectedSkill} onClose={() => { setShowQuiz(false); setSelectedSkill(null); }} />;
  }

  if (showPath && selectedSkill) {
    return (
      <div className="page">
        <LessonPath
          skill={selectedSkill}
          onBack={() => setShowPath(false)}
        />
      </div>
    );
  }

  return (
    <div className="page">

      {/* Hero */}
      <div className="home-hero">
        <div className="hero-circles">
          {/* <div className="hero-circle" style={{ width: 260, height: 260, top: -70, right: -50 }} />
          <div className="hero-circle" style={{ width: 150, height: 150, bottom: -35, left: 70, background: 'var(--blue)' }} /> */}
        </div>
        <div className="hero-content">
          <div className="hero-greeting">🦉 Welcome back, {currentUser?.name}!</div>
          <div className="hero-title">
            Ready to conquer <span>Glottie</span>? 
          </div>
          <div className="hero-sub">
            Pick a skill, unlock levels, and become a language master!
          </div>
          <div className="stats-row">
            <div className="stat-chip">🔥 <span>{currentUser?.streak || 0}-day streak</span></div>
            <div className="stat-chip">⚡ <span>{currentUser?.xp || 0} XP</span></div>
            <div className="stat-chip">🏆 <span>Level {currentUser?.currentLevel || 1}</span></div>
            <div className="stat-chip">✅ <span>{progressList?.length || 0} skills started</span></div>
          </div>
        </div>
      </div>

      {/* רשימת מיומנויות */}
      <div className="section-title">
        🎯 Choose a Skill
        <span className="section-badge">{skillsWithStatus?.length || 0} skills</span>
      </div>

      <div className="skills-grid">
        {skillsWithStatus?.map((skill) => (
          <div
            key={skill.skillId}
            className={`skill-card
              ${!skill.unlocked ? 'locked' : ''}
              ${selectedSkill?.skillId === skill.skillId ? 'selected' : ''}
            `}
            onClick={() => skill.unlocked && setSelectedSkill(skill)}
            title={!skill.unlocked ? `Requires Level ${skill.recommendedLevelId}` : skill.description}
            
          >
            {!skill.unlocked && (
              <span className="skill-lock-icon">🔒</span>
            )}
            <span className="skill-icon">{skill.icon}</span>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-progress-text">
              {skill.unlocked
                ? `${skill.progress}%`
                : `Level ${skill.recommendedLevelId} required`}
            </div>
            <div className="skill-bar">
              <div
                className="skill-bar-fill"
                style={{
                  width: `${skill.progress}%`,
                  background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* כפתור התחלה */}
      {selectedSkill && (
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <button
            className="btn-primary"
            onClick={() => setShowPath(true)}
            style={{
              padding: '13px 42px',
              fontSize: 15,
              fontFamily: "'Fredoka One', cursive",
              letterSpacing: 1,
              boxShadow: '0 6px 22px rgba(91,63,217,0.35)',
              animation: 'stepPulse 2s infinite',
            }}
          >
            🚀 Start {selectedSkill.name}!
          </button>
        </div>
      )}
    </div>
  );
}
