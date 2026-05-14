import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// קומפוננטות
import Sidebar       from './Sidebar';
import UserAvatar from '../features/User/Components/UserAvatar';
// סגנונות
import '../styles/variables.css';
import AppRouter from './router';

import home from "../../public/home.png";
import progress from "../../public/progress.png";
import errors from "../../public/errors.png";
import chat from "../../public/chat.png";
import profile from "../../public/profile.png";
import settings from "../../public/settings.png";
import help from "../../public/help.png";

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
  '/':         <span> <img src={home} alt="logo" width="30px" />  Home</span>
,
  '/progress': <span> <img src={progress} alt="logo" width="30px" />  Progress</span>,
  '/errors': <span> <img src={errors} alt="logo" width="30px" />  My Mistakes</span>,
  '/profile': <span> <img src={profile} alt="logo" width="30px" />  Profile</span>,
  '/chat': <span> <img src={chat} alt="logo" width="30px" />  Glottie Teacher</span>,
  '/settings': <span> <img src={settings} alt="logo" width="30px" />  Settings</span>,
  '/help': <span> <img src={help} alt="logo" width="30px" />  Help</span> ,
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
          <div className="topbar-title">{TITLES[location.pathname] ||  <span> <img src={home} alt="logo" width="30px" />  home</span>}</div>
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
