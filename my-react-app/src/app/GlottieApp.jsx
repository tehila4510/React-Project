import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// קומפוננטות
import Sidebar       from './Sidebar';

// import HomeView      from '../features/UserSkillProgress/Components/HomeView';
// import ProgressView  from '../features/UserSkillProgress/Components/ProgressView';
// import ErrorsView    from '../features/UserAnswer/Components/ErrorsView';
// import ProfileView   from '../features/User/Components/ProfileView';
// import ChatView      from '../features/Chat/Components/ChatView';

import UserAvatar from '../features/User/Components/UserAvatar';
// סגנונות
import '../styles/variables.css';
import AppRouter from './router';

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
  '/': '🏠 Home',
  '/progress': '📊 Progress',
  '/errors': '❌ My Mistakes',
  '/profile': '👤 Profile',
  '/chat': '🦉 Glottie Teacher',
  '/settings': '⚙️ Settings',
  '/help': '❓ Help',
};

export default function GlottieApp() {
  const { currentUser }           = useSelector((state) => state.user);
  const location = useLocation(); // מקבל את הנתיב הנוכחי

  return (
    <>
      <Particles />
      <div className="app">
        <Sidebar /> {/* הורדנו את ה-Props של ה-view */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{TITLES[location.pathname] || '🏠 Home'}</div>
          <div className="topbar-stats">
             <div className="topbar-streak">🔥 {currentUser?.streak || 0}</div>
             <div className="topbar-xp">⚡ {currentUser?.xp || 0} XP</div>
             <UserAvatar size={38} />
          </div>
        </div>

        <div className="scroll-area" style={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
          <AppRouter /> {/* כאן הראוטר מחליט מה להציג */}
        </div>
      </main>
      </div>
    </>
  );
}
