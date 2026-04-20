import './auth.css';

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="auth-bg">
      <div className="blob" style={{ width:400, height:400, background:'#B09EFF', top:-100, right:-100 }} />
      <div className="blob" style={{ width:300, height:300, background:'#93C5FD', bottom:-80, left:-80 }} />

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-owl">🦉</span>
          <div className="auth-brand">GLOTTIE</div>
          <div className="auth-subtitle">{subtitle}</div>
        </div>

        {children}
      </div>
    </div>
  );
}