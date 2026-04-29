import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllSkillsQuery } from '../../Skill/Redux/api';
import { useGetAllUserSkillProgressQuery } from '../Redux/api';
import LessonPath from '../../Lesson/LessonPath';
import QuizPage from '../../Quiz/Components/QuizPage';
import logo from "../../../../public/logo3.png";
import './HomeView.css';

const SKILL_ICONS = {
  Vocabulary:    { icon: '📚', color: '#3B8FFF' },
  Grammar:       { icon: '📝', color: '#7B5EFF' },
  Verbs:         { icon: '⚡', color: '#FFB800' },
  Listening:     { icon: '🎧', color: '#FF5C7A' },
  Reading:       { icon: '📖', color: '#22C67A' },
  Writing:       { icon: '✏️',  color: '#FF8C42' },
  Pronunciation: { icon: '🗣️',  color: '#5B8AFF' },
  Phrases:       { icon: '💬', color: '#C084FC' },
  chat:          { icon: '💬', color: '#6b29d6' },
};

const STARS = ['✨', '⭐', '🌟', '💫', '✦', '★'];

export default function HomeView() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showPath, setShowPath]           = useState(false);

  const { currentUser } = useSelector((state) => state.user);
const [showQuiz, setShowQuiz] = useState(false);
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
    const userProgress = progressList?.find((p) => p.skillId === skill.skillId);
    const meta = SKILL_ICONS[skill.name] || { icon: '📘', color: '#7B5EFF' };
    return {
      ...skill,
      icon:     meta.icon,
      color:    meta.color,
      unlocked: (currentUser?.currentLevel || 1) >= skill.recommendedLevelId,
      progress: userProgress?.progressPercent || 0,
    };
  });

  if (loadingSkills || loadingProgress) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          Loading your skills… 
        </div>
      </div>
    );
  }

  if (errorSkills) {
    return (
      <div className="page">
        <div className="error-state">
          ⚠️ Could not load skills. Is the server running?
        </div>
      </div>
    );
  }
if (showPath && selectedSkill) {
  return (
    <div className="page">
      <LessonPath
        skill={selectedSkill}
        onBack={() => setShowPath(false)}
        onStartQuiz={(skill, step) => {
          console.log('start quiz', skill, step);

          // מעבר לבוחן
          setShowPath(false);

          // כאן תצטרכי state לבוחן:
          setShowQuiz(true); // אם יש לך
        }}
      />
    </div>
  );
}
if (showQuiz && selectedSkill) {
  return (
    <QuizPage
      skill={selectedSkill}
      onClose={() => {
        setShowQuiz(false);
        setShowPath(true);
      }}
    />
  );
}
  return (
    <div className="page">

      {/* Decorative blobs */}
      <div className="g-blob g-blob-1" />
      <div className="g-blob g-blob-2" />
      <div className="g-blob g-blob-3" />

      {/* Floating stars */}
      <div className="g-stars">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="g-star"
            style={{
              left:              `${10 + i * 16}%`,
              animationDuration: `${8 + i * 2.5}s`,
              animationDelay:    `${i * 1.8}s`,
              fontSize:          `${12 + (i % 3) * 6}px`,
            }}
          >
            {star}
          </span>
        ))}
      </div>

      {/* Hero */}
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-greeting"> Welcome back, {currentUser?.name}!</div>
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
        <div className="hero-owl"> <span > <img src={logo} alt="logo" width="130px" /></span>
</div>
      </div>

      {/* Skills */}
      <div className="section-title">
        🎯 Choose a Skill
        <span className="section-badge">{skillsWithStatus?.length || 0} skills</span>
      </div>

      <div className="skills-grid">
        {skillsWithStatus?.map((skill) => (
          <div
            key={skill.skillId}
            className={`skill-card${!skill.unlocked ? ' locked' : ''}${selectedSkill?.skillId === skill.skillId ? ' selected' : ''}`}
            style={{ '--card-color': skill.color }}
            onClick={() => skill.unlocked && setSelectedSkill(skill)}
            title={!skill.unlocked ? `Requires Level ${skill.recommendedLevelId}` : skill.description}
          >
            {!skill.unlocked && <span className="skill-lock-icon">🔒</span>}
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
                  width:      `${skill.progress}%`,
                  background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedSkill && (
        <div className="cta-wrapper">
          <button className="btn-primary" onClick={() => setShowPath(true)}>
            🚀 Start {selectedSkill.name}!
          </button>
        </div>
      )}
    </div>
  );
}
