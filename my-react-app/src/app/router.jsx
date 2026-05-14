import { Routes, Route, Navigate } from 'react-router-dom';
import ProgressView from '../features/UserSkillProgress/Components/ProgressView';
import ErrorsView from '../features/UserAnswer/Components/ErrorsView';
import ProfileView from '../features/User/Components/ProfileView';
import ChatView from '../features/Chat/Components/ChatView';
import HomeView from '../Pages/HomeView';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      
      <Route path="/progress" element={<ProgressView />} />
      <Route path="/errors" element={<ErrorsView />} />
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/chat" element={<ChatView />} />

      <Route path="/settings" element={<PlaceholderPage icon="⚙️" title="Settings" />} />
      <Route path="/help" element={<PlaceholderPage icon="❓" title="Help & Support" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const PlaceholderPage = ({ icon, title }) => (
  <div className="page" style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 12, minHeight: '60vh',
  }}>
    <div style={{ fontSize: 56 }}>{icon}</div>
    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: 'var(--text)' }}>
      {title}
    </div>
    <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Coming soon! 🚀</div>
  </div>
);

export default AppRouter;