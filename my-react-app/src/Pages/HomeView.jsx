import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllSkillsQuery } from '../features/Skill/Redux/api';
import { useGetAllUserSkillProgressQuery } from '../features/UserSkillProgress/Redux/api';
import { useNavigate } from 'react-router-dom';
import LessonPath from '../features/Lesson/LessonPath';
import QuizPage from '../features/Quiz/Components/QuizPage';

import logo from "../../public/logo.png";
import './HomeView.css';

import vocabulary from "../../public/vocabulary.png";
import grammar from "../../public/grammar.png";
import verbs from "../../public/verbs.png";
import listening from "../../public/listening.png";
import reading from "../../public/reading.png";
import writing from "../../public/writing.png";
import pronunciation from "../../public/pronun.png";
import phrases from "../../public/phrases.png";
import chat from "../../public/chat2.png";
import streak from "../../public/streak.png";
import xp from "../../public/xp.png";
import level from "../../public/level.png";


const SKILL_ICONS = {
  Vocabulary: { icon: <img src={vocabulary} alt="v" />, color: '#3B8FFF' },
  Grammar: { icon: <img src={grammar} alt="g"  />, color: '#7B5EFF' },
  Verbs: { icon: <img src={verbs} alt="v"  />, color: '#FFB800' },
  Listening: { icon: <img src={listening} alt="l"  />, color: '#FF5C7A' },
  Reading: { icon: <img src={reading} alt="r"  />, color: '#22C67A' },
  Writing: { icon: <img src={writing} alt="w"  />, color: '#FF8C42' },
  Pronunciation: { icon: <img src={pronunciation} alt="p"  />, color: '#5B8AFF' },
  Phrases: { icon: <img src={phrases} alt="p"  />, color: '#C084FC' },
  chat: { icon: <img src={chat} alt="c"  />, color: '#6b29d6' },
};

export default function HomeView() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showPath, setShowPath] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const { data: skills, isLoading: loadingSkills, isError: errorSkills } = useGetAllSkillsQuery();
  const { data: progressList, isLoading: loadingProgress } = useGetAllUserSkillProgressQuery(currentUser?.userId);

  const skillsWithStatus = skills?.map((skill) => {
    const userProgress = progressList?.find((p) => p.skillId === skill.skillId);
    const meta = SKILL_ICONS[skill.name] || SKILL_ICONS.chat;
    return {
      ...skill,
      icon: meta.icon,
      color: meta.color,
      unlocked: (currentUser?.currentLevel || 1) >= skill.recommendedLevelId,
      progress: userProgress?.progressPercent || 0,
    };
  });

  if (loadingSkills || loadingProgress) return <div className="page"><div className="loading-state"><div className="loading-spinner" /></div></div>;
  if (errorSkills) return <div className="page"><div className="error-state">⚠️ Could not load skills.</div></div>;

  if (showPath && selectedSkill) {
    return (
      <div className="page">
        <LessonPath
          skill={selectedSkill}
          onBack={() => setShowPath(false)}
          onStartQuiz={() => {
            setShowPath(false);
            setShowQuiz(true);
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
      <div className="g-blob g-blob-1" />
      <div className="g-blob g-blob-2" />

      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-greeting">Welcome back, {currentUser?.name}!</div>
          <div className="hero-title">Ready to conquer <span>Glottie</span>?</div>
          <div className="hero-sub">Pick a skill, unlock levels, and become a language master!</div>
          <div className="stats-row">
            <div className="stat-chip"><span> <img src={streak} alt="logo" width="25px" /></span> {currentUser?.streak || 0}-day streak</div>
            <div className="stat-chip"><span> <img src={xp} alt="logo" width="25px" /></span>  {currentUser?.xp || 0} XP</div>
            <div className="stat-chip"><span> <img src={level} alt="logo" width="25px" /></span>  Level {currentUser?.currentLevel || 1}</div>
          </div>
        </div>
        <div className="hero-owl">
          <img src={logo} alt="logo" width="90px" />
        </div>
      </div>

      <div className="section-title">Choose a Skill</div>

      <div className="skills-grid">
        {skillsWithStatus?.map((skill) => (
          <div
            key={skill.skillId}
            className={`skill-card-home ${!skill.unlocked ? 'locked' : ''} ${selectedSkill?.skillId === skill.skillId ? 'selected' : ''}`}
            style={{ '--card-color': skill.color }}
            onClick={() => skill.unlocked && setSelectedSkill(skill)}
          >
            {!skill.unlocked && <span className="skill-lock-icon">🔒</span>}
            <div className="skill-icon-home">{skill.icon}</div>
            <div className="skill-name-home">{skill.name}</div>
            <div className="skill-progress-text-home">
              {skill.unlocked ? `${skill.progress}%` : `Level ${skill.recommendedLevelId} required`}
            </div>
            <div className="skill-bar-home">
              <div className="skill-bar-fill" style={{ width: `${skill.progress}%`, background: skill.color }} />
            </div>
          </div>
        ))}
      </div>

      {selectedSkill && (
        <div className="cta-wrapper">
          <button 
            className="btn-primary" 
            onClick={() => {
              if (selectedSkill.name === 'Chat with Glottie ') {
                navigate('/chat');
              } else {
                navigate(`/quiz/${selectedSkill.skillId}`);
              }
            }}
          >
            🚀 Start {selectedSkill.name}!
          </button>
        </div>
      )}
    </div>
  );
}