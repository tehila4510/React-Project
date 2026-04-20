import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/User/Redux/userSlice';
import UserAvatar from '../features/User/Components/UserAvatar';

const NAV = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'progress', icon: '📊', label: 'My Progress' },
  { id: 'errors',   icon: '❌', label: 'My Mistakes', badge: true },
  { id: 'profile',  icon: '👤', label: 'Profile' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ view, setView, errorCount }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // חישוב XP - מה שיש על המשתמש
  const xp    = currentUser?.xp       || 0;
  const maxXp = currentUser?.maxXp    || 2000;
  const xpPct = Math.min((xp / maxXp) * 100, 100);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="sidebar">
      {/* לוגו */}
      <div className="sidebar-logo" onClick={() => setView('home')}>
        <UserAvatar size={32} />
        <span className="logo-text">GLOTTIE</span>
      </div>

      {/* ניווט */}
      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        {NAV.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${view === n.id ? 'active' : ''}`}
            onClick={() => setView(n.id)}
          >
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge && errorCount > 0 && (
              <span className="nav-badge">{errorCount}</span>
            )}
          </div>
        ))}

        {/* כפתור התנתקות */}
        <div className="nav-item" onClick={handleLogout} style={{ marginTop: 8, color: 'var(--red)' }}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>

      {/* פרופיל קטן בתחתית */}
      <div
        className="sidebar-profile"
        style={{ marginTop: 'auto' }}
        onClick={() => setView('profile')}
      >
        <div className="profile-mini">
          <div className="avatar">🦉</div>
          <div>
            <div className="profile-name">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div className="profile-level">
              ⭐ Level {currentUser?.currentLevel || 1}
            </div>
          </div>
        </div>
        <div className="xp-mini">
          <div className="xp-bar-bg">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="xp-label">{xp} / {maxXp} XP</div>
        </div>
      </div>
    </aside>
  );
}
