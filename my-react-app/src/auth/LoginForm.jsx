import { useState } from 'react';
import { useLoginUserMutation } from '../features/User/Redux/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/User/Redux/userSlice';

export default function LoginTab({ onAuthSuccess, setAlert, setTab }) {
  const dispatch = useDispatch();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlert(null);
    try {
      const result = await loginUser(loginForm).unwrap();
      dispatch(setUser({ token: result.token, user: result.user }));
      onAuthSuccess();
      
      console.log("הצליח")
    } catch (err) {
      setAlert({ type: 'error', msg: err?.data?.message || 'Invalid email or password.' });
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