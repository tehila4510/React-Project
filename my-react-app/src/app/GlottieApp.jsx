import { useState } from 'react';
import { useSelector } from 'react-redux';

// קומפוננטות
import Sidebar       from './Sidebar';
import HomeView      from '../features/UserSkillProgress/Components/HomeView';
import ProgressView  from '../features/UserSkillProgress/Components/ProgressView';
import ErrorsView    from '../features/UserAnswer/Components/ErrorsView';
import ProfileView   from '../features/User/Components/ProfileView';

import UserAvatar from '../features/User/Components/UserAvatar';
// סגנונות
import '../styles/variables.css';

// פרטיקלים
function Particles() {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id:    i,
    // eslint-disable-next-line react-hooks/purity
    left:  `${Math.random() * 100}%`,
    size:  `${4 + Math.random() * 8}px`,
    dur:   `${9 + Math.random() * 12}s`,
    delay: `${Math.random() * 12}s`,
    color: ['var(--purple)', 'var(--blue)', 'var(--yellow)', 'var(--green)'][i % 4],
  }));
  return (
    <div className="particles">
      {items.map((p) => (
        <div key={p.id} className="particle" style={{
          left: p.left, width: p.size, height: p.size,
          background: p.color, animationDuration: p.dur, animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

const TITLES = {
  home:     '🏠 Home',
  progress: '📊 Progress',
  errors:   '❌ My Mistakes',
  profile:  '👤 Profile',
  settings: '⚙️ Settings',
  help:     '❓ Help',
};

export default function GlottieApp() {
  const [view, setView]           = useState('home');
  const { currentUser }           = useSelector((state) => state.user);

  const xp      = currentUser?.xp       || 0;
  const streak  = currentUser?.streak || 0;

  return (
    <>
      <Particles />
      <div className="app">

        {/* Sidebar */}
        <Sidebar view={view} setView={setView} />

        {/* תוכן ראשי */}
        <main className="main">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-title">{TITLES[view] || '🏠 Home'}</div>
            <div className="topbar-stats">
              <div className="topbar-streak">🔥 {streak}</div>
              <div className="topbar-xp">⚡ {xp} XP</div>
             <UserAvatar size={38} />
            </div>
          </div>

          {/* דפים */}
          <div className="scroll-area" style={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
            {view === 'home'     && <HomeView />}
            {view === 'progress' && <ProgressView />}
            {view === 'errors'   && <ErrorsView />}
            {view === 'profile'  && <ProfileView />}

            {(view === 'settings' || view === 'help') && (
              <div className="page" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12, minHeight: '60vh',
              }}>
                <div style={{ fontSize: 56 }}>{view === 'settings' ? '⚙️' : '❓'}</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: 'var(--text)' }}>
                  {view === 'settings' ? 'Settings' : 'Help & Support'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Coming soon! 🚀</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
