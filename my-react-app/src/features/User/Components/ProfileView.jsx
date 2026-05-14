import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserMutation } from '../Redux/api';
import { updateCurrentUser } from '../Redux/userSlice';
import UserAvatar from './UserAvatar';
import level from "../../../../public/level.png";
import streak from "../../../../public/streak.png";
import './ProfileView.css';

export default function ProfileView() {
  const dispatch = useDispatch();
  const avatarRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const handleProfileSave = async () => {
    try {
      await updateUser({ id: currentUser.userId, data: profileForm }).unwrap();
      dispatch(updateCurrentUser(profileForm));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await updateUser({ id: currentUser.userId, data: formData }).unwrap();
      dispatch(updateCurrentUser({ avatarUpdated: Date.now() }));
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!currentUser) return <div className="loading-state">Loading...</div>;

  const xpPct = Math.min(100, Math.round(((currentUser.xp || 0) / (currentUser.maxXp || 100)) * 100));

  return (
    <div className="page">
      {/* HERO SECTION */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-big">
            {avatarUploading ? "⏳" : <UserAvatar size={100} />}
          </div>
          <input ref={avatarRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleAvatarChange} />
          <div className="profile-avatar-badge" onClick={() => avatarRef.current?.click()}>📸</div>
        </div>

        <div className="profile-details">
          <h2>{currentUser.name}</h2>
          <p>{currentUser.email}</p>
          <div className="profile-badges">
            <span className="badge-chip"><span> <img src={streak} alt="logo" width="20px" /></span> {currentUser.streakDays || 0} Streak</span>
            <span className="badge-chip"><span> <img src={level} alt="logo" width="20px" /></span>   Level {currentUser.currentLevel || 1}</span>
          </div>
        </div>
      </div>


      <div className="profile-stats-grid">
        {[
          { val: currentUser.currentLevel || 1, lbl: 'Level' },
          { val: currentUser.streakDays || 0, lbl: 'Streak' },
          { val: currentUser.xp || 0, lbl: 'Total XP' },
          { val: (currentUser.maxXp || 100) - (currentUser.xp || 0), lbl: 'Next Level' },
        ].map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="val">{s.val}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* XP PROGRESS */}
      <div className="xp-progress-wrap">
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'13px', fontWeight:'600'}}>
          <span>Level Progress</span>
          <span>{xpPct}%</span>
        </div>
        <div className="xp-bar-bg">
          <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* FORMS SECTION */}
      <div className="edit-form-container">
        {/* Profile Form */}
        <div className="edit-form">
          <div className="form-title">General Info</div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} />
          </div>
          <button className={`btn-primary ${saved ? 'saved' : ''}`} onClick={handleProfileSave}>
            {saved ? 'Changes Saved' : 'Save Profile'}
          </button>
        </div>

        {/* Password Form */}
        <div className="edit-form">
          <div className="form-title">Security</div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <button className="btn-primary" style={{background: '#0f172a'}}>Update Password</button>
        </div>
      </div>
    </div>
  );
}