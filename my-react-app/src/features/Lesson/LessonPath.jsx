import './LessonPath.css';
const MOCK_UNITS = [
  {
    id: 1, 
    title: 'Foundations',
    steps: [
      { id: 1, icon: '🎯', label: 'Introduction', state: 'completed' },
      { id: 2, icon: '📝', label: 'Basic Rules', state: 'completed' },
      { id: 3, icon: '💡', label: 'Common Use', state: 'current' },
      { id: 4, icon: '🎓', label: 'Final Test', state: 'locked' },
    ],
  },
];

export default function LessonPath({ skill, onBack, onStartQuiz }) {
  
  const handleStepClick = (step) => {
    if (step.state === 'locked') return;
    onStartQuiz(skill, step);
  };

  return (
    <div className="lesson-path-container">
      <div className="lesson-path-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="header-skill-info">
          <h3>{skill.name}</h3>
          <div className="header-skill-sub">Your learning journey</div>
        </div>
        <div style={{width: '60px'}}></div> {/* לאיזון ויזואלי */}
      </div>

      {/* Path */}
      <div className="path-unit">
        <div className="unit-title">Level 1</div>
        
        {MOCK_UNITS[0].steps.map((step, index) => {
          const isComp = step.state === 'completed';
          const isCurr = step.state === 'current';
          const isLast = index === MOCK_UNITS[0].steps.length - 1;

          return (
            <div key={step.id} className="step-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <div className="step-wrap">
                <div 
                  className={`step-node ${step.state}`}
                  onClick={() => handleStepClick(step)}
                >
                  {step.state === 'locked' ? '🔒' : step.icon}
                </div>
                <div className={`step-label ${isCurr ? 'active' : ''}`}>
                  {step.label}
                </div>
              </div>

              {!isLast && (
                <div className={`path-connector ${isComp ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}