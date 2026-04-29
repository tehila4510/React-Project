import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';


export default function RegisterTab({ onNextStep, setTab }) {
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors]   = useState({});
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const e = {};
    if (!regForm.name.trim()) e.name = 'Required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regForm.email.trim().toLowerCase())) e.email = 'Invalid email';

    if (regForm.password.length < 8)             e.password = 'Min 8 characters';
    else if (!/[A-Z]/.test(regForm.password))    e.password = 'Must include uppercase';
    else if (!/[a-z]/.test(regForm.password))    e.password = 'Must include lowercase';
    else if (!/\d/.test(regForm.password))       e.password = 'Must include number';
    else if (!/[@$!%*?&]/.test(regForm.password)) e.password = 'Must include special char';

    if (regForm.password !== regForm.confirmPassword) e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // ❌ לא קוראים ל-registerUser כאן
    // ✅ מעבירים את הנתונים ל-AuthPage — הוא ימשיך לבחירת רמה ואז ישלח ל-API
    onNextStep({
      name:     regForm.name,
      email:    regForm.email,
      password: regForm.password,
      file,
    });
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IconButton component="label">
              <PhotoCameraIcon />
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </IconButton>
          }
        >
          <Avatar
            src={preview}
            sx={{ width: 90, height: 90, boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
          />
        </Badge>
      </div>

      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="John Doe"
          value={regForm.name}
          onChange={(e) => setRegForm((p) => ({ ...p, name: e.target.value }))}
        />
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className={`form-input ${errors.email ? 'error' : ''}`}
          type="email"
          placeholder="you@example.com"
          value={regForm.email}
          onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))}
        />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className={`form-input ${errors.password ? 'error' : ''}`}
            type="password"
            placeholder="Min 8 chars"
            value={regForm.password}
            onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            type="password"
            placeholder="Repeat password"
            value={regForm.confirmPassword}
            onChange={(e) => setRegForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          />
          {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
        </div>
      </div>

      <button className="btn-main" type="submit">
        ✨ Continue →
      </button>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
        Already have an account?{' '}
        <span style={{ color: 'var(--purple)', cursor: 'pointer' }} onClick={() => setTab('login')}>
          Login →
        </span>
      </p>
    </form>
  );
}