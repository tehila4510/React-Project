import { useState } from 'react';
import LessonPath from './LessonPath';
import QuizPage from '../Quiz/Components/QuizPage';

export default function LessonContainer({ skill, onBack }) {
  const [screen, setScreen] = useState('path'); // path | quiz
  const [selectedStep, setSelectedStep] = useState(null);

  return (
    <>
      {screen === 'path' && (
        <LessonPath
          skill={skill}
          onBack={onBack}
          onStartQuiz={(skill, step) => {
            setSelectedStep(step);
            setScreen('quiz');
          }}
        />
      )}

      {screen === 'quiz' && (
        <QuizPage
          skill={skill}
          step={selectedStep} // אם תרצי להשתמש בעתיד
          onClose={() => setScreen('path')}
        />
      )}
    </>
  );
}