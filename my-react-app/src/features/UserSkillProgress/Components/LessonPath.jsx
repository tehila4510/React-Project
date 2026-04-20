
const OFFSETS = ['', 'step-offset-left', '', 'step-offset-right', ''];

// TODO: להחליף בקריאת API של Sessions לפי skillId
const MOCK_UNITS = [
  {
    id: 1, title: 'Unit 1 – Foundations',
    steps: [
      { id: 1, icon: '⭐', label: 'Intro',     state: 'completed' },
      { id: 2, icon: '🔤', label: 'Basics',    state: 'completed' },
      { id: 3, icon: '👋', label: 'Greetings', state: 'completed' },
      { id: 4, icon: '🔢', label: 'Practice',  state: 'current'   },
      { id: 5, icon: '🏅', label: 'Quiz',      state: 'locked'    },
    ],
  },
  {
    id: 2, title: 'Unit 2 – Intermediate',
    steps: [
      { id: 6,  icon: '📖', label: 'Reading',  state: 'locked' },
      { id: 7,  icon: '✍️',  label: 'Writing',  state: 'locked' },
      { id: 8,  icon: '🎧', label: 'Listening',state: 'locked' },
      { id: 9,  icon: '💬', label: 'Speaking', state: 'locked' },
      { id: 10, icon: '🏅', label: 'Quiz',     state: 'locked' },
    ],
  },
  {
    id: 3, title: 'Unit 3 – Advanced',
    steps: [
      { id: 11, icon: '🚀', label: 'Challenge', state: 'locked' },
      { id: 12, icon: '🌟', label: 'Mastery',   state: 'locked' },
      { id: 13, icon: '🏆', label: 'Final',     state: 'locked' },
    ],
  },
];

export default function LessonPath({ skill, onBack }) {
  return (
    <div>
      {/* Header */}
      <div className="lesson-path-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: 'var(--text)' }}>
            {skill.icon} {skill.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
            Lesson Path – conquer every level!
          </div>
        </div>
      </div>

      {/* מסלול */}
      <div className="path-container">
        {MOCK_UNITS.map((unit, ui) => (
          <div key={unit.id} className="path-unit">
            <div className="unit-header">{unit.title}</div>

            <div className="path-steps">
              {unit.steps.map((step, si) => {
                const offset  = OFFSETS[si % OFFSETS.length];
                const isComp  = step.state === 'completed';
                const isCurr  = step.state === 'current';

                return (
                  <div
                    key={step.id}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
                  >
                    {si > 0 && (
                      <div
                        className={`path-connector ${isComp || isCurr ? 'completed' : ''}`}
                        style={{ height: 32 }}
                      />
                    )}
                    <div className={`step-wrap ${offset}`}>
                      <div
                        className={`step-node ${step.state}`}
                        title={step.state === 'locked' ? 'Not unlocked yet' : `Lesson: ${step.label}`}
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

            {ui < MOCK_UNITS.length - 1 && (
              <div className="path-connector" style={{ height: 42, marginTop: 8, marginBottom: 8 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
