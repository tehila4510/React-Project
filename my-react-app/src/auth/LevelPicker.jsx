// LevelPicker.jsx
import React, { useState } from 'react';
import { LEVELS } from './data';

export default function LevelPicker({ onSelectLevel, onStartTest }) {
    const [selected, setSelected] = useState(null);

    return (
        <div className="level-section">
            <div className="level-section-title">🎯 What's your English level?</div>
            <div className="level-options">
                {LEVELS.map((lv) => (
                    <div 
                        key={lv.id} 
                        className={`level-card ${selected === lv.id ? 'selected' : ''}`}
                        onClick={() => setSelected(lv.id)}
                    >
                        <div className="level-badge" style={{ background: lv.color }}>{lv.emoji}</div>
                        <div className="level-info">
                            <div className="level-name">Level {lv.id}</div>
                            <div className="level-desc">{lv.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-main" disabled={!selected} onClick={() => onSelectLevel(selected)}>
                ✅ Start at Level {selected || '?'}
            </button>
            <div className="divider">or</div>
            <div className="test-card" onClick={onStartTest}>
                <span>🧠 Take Placement Test</span>
            </div>
        </div>
    );
}