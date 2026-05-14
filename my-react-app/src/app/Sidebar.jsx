import { useSelector, useDispatch } from 'react-redux';
import UserAvatar from '../features/User/Components/UserAvatar';
import logo from "../../public/logo2.png"
import {NavLink,useNavigate} from 'react-router-dom';
import home from "../../public/home.png";
import progress from "../../public/progress.png";
import errors from "../../public/errors.png";
import chat from "../../public/chat.png";
import profile from "../../public/profile.png";
import settings from "../../public/settings.png";
import logoutIcon from "../../public/logout.png";
import { logout } from '../features/User/Redux/userSlice';


const NAV = [
  { id: 'home',     icon: <span> <img src={home} alt="home" width="30px" /></span>
, label: 'Home' },
  { id: 'progress', icon:        <span> <img src={progress} alt="logo" width="30px" /></span>
, label: 'My Progress' },
  { id: 'errors',   icon:        <span> <img src={errors} alt="logo" width="30px" /></span>
, label: 'My Mistakes', badge: true },
  { id: 'chat',     icon:        <span> <img src={chat} alt="logo" width="30px" /></span>
, label: 'Glottie Teacher' },
  { id: 'profile',  icon:        <span> <img src={profile} alt="logo" width="30px" /></span>
, label: 'Profile' },
  { id: 'settings', icon:        <span> <img src={settings} alt="logo" width="30px" /></span>
, label: 'Settings' },
];

export default function Sidebar({ errorCount }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const xp    = currentUser?.xp       || 0;
  const maxXp = currentUser?.maxXp    || 100;
  const xpPct = Math.min((xp / maxXp) * 100, 100);

  const handleLogout = () => {
    dispatch(logout());
  };
return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <span> <img src={logo} alt="logo" width="30px" /></span>
        <span className="logo-text">GLOTTIE</span>
      </div>

      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        
        {NAV.map((n) => (
          <NavLink 
            key={n.id} 
            to={n.id === 'home' ? '/' : `/${n.id}`} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge && errorCount > 0 && (
              <span className="nav-badge">{errorCount}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-item" onClick={handleLogout} style={{ marginTop: 8, color: 'var(--red)', cursor: 'pointer' }}>
          <span className="nav-icon"><span> <img src={logoutIcon} alt="logo" width="30px" /></span></span>
          <span>Logout</span>
        </div>
      </div>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => `sidebar-profile ${isActive ? 'active' : ''}`}
        style={{ marginTop: 'auto', textDecoration: 'none', color: 'inherit' }}
      >
        <div className="profile-mini">
          <div className="avatar">      
            <UserAvatar size={38} />
          </div>
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
      </NavLink>
    </aside>
  );
}