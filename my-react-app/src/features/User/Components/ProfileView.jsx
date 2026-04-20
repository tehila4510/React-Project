import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserMutation } from '../Redux/api';
import { updateCurrentUser } from '../Redux/userSlice';
import UserAvatar from './UserAvatar';

export default function ProfileView() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser({
        id: currentUser.userId,
        data: form,
      }).unwrap();

      dispatch(updateCurrentUser(form));

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Update failed: ' + (err?.data?.message || 'Unknown error'));
    }
  };

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

  const xp = currentUser.xp || 0;
  const maxXp = currentUser.maxXp || 2000;

  return (
    <div className="page">

      {/* HERO */}
      <div className="profile-hero">

        <div className="profile-avatar-big" style={{ position: "relative" }}>

          <UserAvatar size={90} />

          <div className="profile-avatar-badge">
            ✏️
          </div>

        </div>

        <div className="profile-details">
          <h2>
            {currentUser.firstName} {currentUser.lastName} 👋
          </h2>

          <p>{currentUser.email}</p>

          <div className="profile-badges">
            <span className="badge-chip">
              🔥 {currentUser.streakDays || 0}-day streak
            </span>

            <span className="badge-chip">
              ⭐ Level {currentUser.currentLevel || 1}
            </span>

            <span className="badge-chip">
              💎 {xp} XP
            </span>
          </div>
        </div>

      </div>

      {/* STATS */}
      <div className="profile-stats-grid">
        {[
          { val: currentUser.currentLevel || 1, lbl: 'Current Level' },
          { val: currentUser.streakDays || 0, lbl: 'Day Streak' },
          { val: xp, lbl: 'XP Points' },
          { val: `${maxXp - xp}`, lbl: 'XP to Next Level' },
        ].map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="val">{s.val}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* EDIT FORM */}
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
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              className="form-input"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
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
            />
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading
            ? 'Saving...'
            : saved
            ? '✅ Saved!'
            : '💾 Save Changes'}
        </button>

      </div>
    </div>
  );
}