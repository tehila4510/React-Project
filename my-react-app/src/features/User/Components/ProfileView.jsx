import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserMutation } from '../Redux/api';
import { updateCurrentUser } from '../Redux/userSlice';
import UserAvatar from './UserAvatar';
import './ProfileView.css';

export default function ProfileView() {
  const dispatch   = useDispatch();
  const avatarRef  = useRef(null);

  const { currentUser } = useSelector((state) => state.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [saved, setSaved]               = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        firstName: currentUser.firstName || '',
        lastName:  currentUser.lastName  || '',
        email:     currentUser.email     || '',
      });
    }
  }, [currentUser]);

  /* ── field change ── */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── save profile fields ── */
  const handleSave = async () => {
    try {
      await updateUser({ id: currentUser.userId, data: form }).unwrap();
      dispatch(updateCurrentUser(form));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Update failed: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  /* ── avatar upload ── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await updateUser({ id: currentUser.userId, data: formData }).unwrap();
      dispatch(updateCurrentUser({ avatarUpdated: Date.now() })); // trigger re-render
    } catch (err) {
      alert('Avatar upload failed: ' + (err?.data?.message || 'Unknown error'));
    } finally {
      setAvatarUploading(false);
      // reset so same file can be re-picked
      e.target.value = '';
    }
  };

  /* ── loading ── */
  if (!currentUser) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          Loading profile...
        </div>
      </div>
    );
  }

  const xp    = currentUser.xp    || 0;
  const maxXp = currentUser.maxXp || 2000;
  const xpPct = Math.min(100, Math.round((xp / maxXp) * 100));

  return (
    <div className="page">

      {/* ── HERO ── */}
      <div className="profile-hero">

        {/* avatar + edit */}
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-big">
            {avatarUploading
              ? <div className="avatar-uploading">⏳</div>
              : <UserAvatar size={90} />
            }
          </div>

          {/* hidden file input */}
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="avatar-file-input"
            onChange={handleAvatarChange}
          />

          {/* pencil badge triggers file picker */}
          <div
            className="profile-avatar-badge"
            onClick={() => !avatarUploading && avatarRef.current?.click()}
            title="Change profile picture"
          >
            ✏️
          </div>
        </div>

        {/* name + email + chips */}
        <div className="profile-details">
          <h2>{currentUser.firstName} {currentUser.lastName} 👋</h2>
          <p>{currentUser.email}</p>
          <div className="profile-badges">
            <span className="badge-chip">🔥 {currentUser.streakDays || 0}-day streak</span>
            <span className="badge-chip">⭐ Level {currentUser.currentLevel || 1}</span>
            <span className="badge-chip">💎 {xp} XP</span>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="profile-stats-grid">
        {[
          { val: currentUser.currentLevel || 1, lbl: 'Current Level' },
          { val: currentUser.streakDays   || 0, lbl: 'Day Streak'    },
          { val: xp,                            lbl: 'XP Points'     },
          { val: maxXp - xp,                    lbl: 'XP to Next Level' },
        ].map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="val">{s.val}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── XP PROGRESS ── */}
      <div className="xp-progress-wrap">
        <div className="xp-progress-label">
          <span>Progress to Level {(currentUser.currentLevel || 1) + 1}</span>
          <strong>{xpPct}%</strong>
        </div>
        <div className="xp-bar-bg">
          <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* ── EDIT FORM ── */}
      <div className="edit-form">
        <div className="form-title">✏️ Edit Profile</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              className="form-input"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <button
          className={`btn-primary${saved ? ' saved' : ''}`}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Saving...' : saved ? '✅ Saved!' : '💾 Save Changes'}
        </button>
      </div>

    </div>
  );
}
