import './LessonPath.css';

const OFFSETS = ['', 'step-offset-left', '', 'step-offset-right', ''];

const MOCK_UNITS = [
  {
    id: 1, title: 'Unit 1 – Foundations',
    steps: [
      { id: 1, icon: '⭐', label: 'Intro', state: 'completed' },
      { id: 2, icon: '🔤', label: 'Basics', state: 'completed' },
      { id: 3, icon: '👋', label: 'Greetings', state: 'completed' },
      { id: 4, icon: '🔢', label: 'Practice', state: 'current' },
      { id: 5, icon: '🏅', label: 'Quiz', state: 'locked' },
    ],
  },
];

export default function LessonPath({ skill, onBack, onStartQuiz }) {
const handleStepClick = (step) => {
  if (step.state === 'locked') return;

  if (typeof onStartQuiz !== 'function') {
    console.error('onStartQuiz is missing!');
    return;
  }

  onStartQuiz(skill, step);
};
  return (
    <div>

      {/* Header */}
      <div className="lesson-path-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div>
          <div className="header-skill-icon">
            {skill.icon} {skill.name}
          </div>
          <div className="header-skill-sub">
            Lesson Path – conquer every level!
          </div>
        </div>
      </div>

      {/* Path */}
      <div className="path-container">
        {MOCK_UNITS.map((unit, ui) => (
          <div key={unit.id} className="path-unit">
            <div className="unit-header">{unit.title}</div>

            <div className="path-steps">
              {unit.steps.map((step, si) => {
                const offset = OFFSETS[si % OFFSETS.length];
                const isComp = step.state === 'completed';
                const isCurr = step.state === 'current';

                return (
                  <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

                    {si > 0 && (
                      <div
                        className={`path-connector ${isComp || isCurr ? 'completed' : ''}`}
                        style={{ height: 32 }}
                      />
                    )}

                    <div className={`step-wrap ${offset}`}>
                      <div
                        className={`step-node ${step.state}`}
                        onClick={() => handleStepClick(step)}
                        style={{
                          cursor: step.state === 'locked' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {step.state === 'locked' ? '🔒' : step.icon}
                        {isComp && <span className="star-badge">⭐</span>}
                      </div>

                      <div className={`step-label ${isCurr ? 'active' : ''}`}>
                        {isCurr ? '▶ ' : ''}{step.label}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}