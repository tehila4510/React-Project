// PlacementTest.jsx
import React, { useState } from 'react';
import { PLACEMENT_QUESTIONS, LEVELS } from './data';

export default function PlacementTest({ onComplete, onBack }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const q = PLACEMENT_QUESTIONS[current];
    const total = PLACEMENT_QUESTIONS.length;
    const pct = Math.round((current / total) * 100);

    const handleAnswer = (idx) => {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === q.correct) setScore((s) => s + 1);
        
        setTimeout(() => {
            if (current + 1 < total) {
                setCurrent((c) => c + 1);
                setSelected(null);
                setAnswered(false);
            } else {
                setDone(true);
            }
        }, 900);
    };

    const calcLevel = () => Math.min(Math.max(score, 1), 6);

    if (done) {
        const level = calcLevel();
        const lv = LEVELS[level - 1];
        return (
            <div className="result-card">
                <div className="result-owl">🦉</div>
                <div className="result-title">Test Complete! 🎉</div>
                <p>You answered {score} out of {total} correctly</p>
                <div className="result-level">{lv.emoji} Level {level} — {lv.name}</div>
                <button className="btn-main" onClick={() => onComplete(level)}>🚀 Start Learning!</button>
                <button className="btn-outline" onClick={onBack}>← Back</button>
            </div>
        );
    }

    return (
        <div>
            <div className="test-header">
                <div className="test-progress-bar">
                    <div className="test-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="test-counter">Question {current + 1} of {total}</div>
            </div>
            <div className="question-card">
                <div className="question-text">{q.text}</div>
            </div>
            <div className="answers-grid">
                {q.answers.map((ans, idx) => (
                    <button 
                        key={idx} 
                        className={`answer-btn ${answered ? (idx === q.correct ? 'correct' : (idx === selected ? 'wrong' : '')) : ''}`}
                        onClick={() => handleAnswer(idx)}
                        disabled={answered}
                    >
                        {ans}
                    </button>
                ))}
            </div>
        </div>
    );
}