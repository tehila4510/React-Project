import { useState } from 'react';
import { useLoginUserMutation } from '../features/User/Redux/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/User/Redux/userSlice';

export default function LoginTab({ onAuthSuccess, setAlert, setTab }) {
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginUser, { isLoading }] = useLoginUserMutation();
const getErrorMessage = (err) => {
  // אם השרת החזיר ולידציה של שדות (למשל סיסמה קצרה מדי)
  if (err?.data?.errors) {
    return Object.values(err.data.errors).flat().join(", ");
  }
  // אם השרת החזיר הודעה פשוטה
  if (err?.data?.message) {
    return err.data.message;
  }
  // אם השרת נפל או אין אינטרנט
  if (err?.status === 'FETCH_ERROR') {
    return "לא ניתן ליצור קשר עם השרת. וודא שהוא מופעל.";
  }
  // ברירת מחדל לכל מקרה אחר
  return "משהו השתבש, נסה שוב מאוחר יותר.";
};
const validateLogin = () => {
  const e = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(loginForm.email.trim().toLowerCase())) {
    e.email = "Invalid email";
  }

  if (!loginForm.password) {
    e.password = "Password is required";
  }

  return e;
};
 const handleLogin = async (e) => {
  e.preventDefault();
  setAlert(null);

  const errors = validateLogin();
  if (Object.keys(errors).length > 0) {
    setAlert({ type: "error", msg: Object.values(errors).join(", ") });
    return;
  }

  try {
    const result = await loginUser(loginForm).unwrap();
    dispatch(setUser({ token: result.token, user: result.user }));
    onAuthSuccess();
  } catch (err) {
    setAlert({ type: "error", msg: getErrorMessage(err) });
  }
};

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="you@example.com"
          value={loginForm.email}
          onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={loginForm.password}
          onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
          required
        />
      </div>
      <button className="btn-main" type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : '🚀 Login to Glottie'}
      </button>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>
        New to Glottie?{' '}
        <span style={{ color: 'var(--purple)', cursor: 'pointer' }} onClick={() => setTab('register')}>
          Create an account →
        </span>
      </p>
    </form>
  );
}