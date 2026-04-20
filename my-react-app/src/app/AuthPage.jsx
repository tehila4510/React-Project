import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation, useRegisterUserMutation } from '../features/User/Redux/api';
import { setUser } from '../features/User/Redux/userSlice';

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --purple:#7B5EFF; --purple-dark:#5B3FD9; --purple-light:#B09EFF;
    --blue:#3B8FFF; --yellow:#FFB800; --orange:#FF8C42;
    --green:#22C67A; --red:#FF5C7A;
    --bg:#F5F4FF; --bg3:#EEEAFF;
    --border:rgba(123,94,255,0.15);
    --shadow:0 4px 24px rgba(123,94,255,0.12);
    --shadow-lg:0 12px 40px rgba(123,94,255,0.22);
    --text:#1A1440; --text-muted:#7B72A0;
  }
  html,body,#root { width:100%; min-height:100%; }
  body { background:var(--bg); font-family:'Nunito',sans-serif; color:var(--text); overflow-x:hidden; }

  /* ─── BG BLOBS ─── */
  .auth-bg {
    min-height:100vh; width:100%;
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden; padding:24px;
    background: linear-gradient(135deg,#EDE9FF 0%,#E8F0FF 50%,#E3FDF0 100%);
  }
  .blob {
    position:absolute; border-radius:50%; filter:blur(60px); opacity:0.35; pointer-events:none;
    animation:blobFloat 8s ease-in-out infinite;
  }
  @keyframes blobFloat {
    0%,100%{transform:translateY(0) scale(1)}
    50%{transform:translateY(-30px) scale(1.06)}
  }

  /* ─── CARD ─── */
  .auth-card {
    background:#fff; border-radius:28px; padding:40px 44px;
    width:100%; max-width:480px; position:relative; z-index:1;
    box-shadow:var(--shadow-lg); border:1.5px solid var(--border);
    animation:cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes cardIn {
    from{opacity:0;transform:translateY(30px) scale(0.96)}
    to{opacity:1;transform:translateY(0) scale(1)}
  }

  /* ─── LOGO ─── */
  .auth-logo { text-align:center; margin-bottom:28px; }
  .auth-owl  { font-size:52px; display:block; animation:owlBob 3s ease-in-out infinite; filter:drop-shadow(0 4px 12px rgba(123,94,255,0.3)); }
  @keyframes owlBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  .auth-brand { font-family:'Fredoka One',cursive; font-size:32px; background:linear-gradient(135deg,var(--yellow),var(--orange),var(--blue)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:2px; margin-top:4px; }
  .auth-subtitle { font-size:13px; color:var(--text-muted); font-weight:600; margin-top:4px; }

  /* ─── TABS ─── */
  .auth-tabs { display:flex; background:var(--bg3); border-radius:16px; padding:4px; margin-bottom:28px; }
  .auth-tab  { flex:1; padding:10px; border:none; border-radius:12px; background:transparent; font-family:'Nunito',sans-serif; font-weight:800; font-size:14px; color:var(--text-muted); cursor:pointer; transition:all 0.2s; }
  .auth-tab.active { background:#fff; color:var(--purple); box-shadow:0 2px 12px rgba(123,94,255,0.15); }

  /* ─── FORM ─── */
  .form-group { margin-bottom:16px; }
  .form-label { display:block; font-size:11px; font-weight:800; color:var(--text-muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
  .form-input {
    width:100%; padding:12px 16px; border-radius:14px;
    border:1.5px solid var(--border); background:var(--bg3);
    font-size:14px; font-family:'Nunito',sans-serif; font-weight:600;
    color:var(--text); outline:none; transition:all 0.2s;
  }
  .form-input:focus { border-color:var(--purple); background:#fff; box-shadow:0 0 0 3px rgba(123,94,255,0.1); }
  .form-input.error { border-color:var(--red); background:#FFF5F7; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .field-error { font-size:11px; color:var(--red); font-weight:700; margin-top:4px; }

  /* ─── BUTTONS ─── */
  .btn-main {
    width:100%; padding:14px; border:none; border-radius:30px;
    background:linear-gradient(135deg,var(--purple-dark),var(--blue));
    color:#fff; font-family:'Fredoka One',cursive; font-size:17px;
    letter-spacing:1px; cursor:pointer; transition:all 0.2s;
    box-shadow:0 6px 20px rgba(91,63,217,0.3); margin-top:8px;
  }
  .btn-main:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(91,63,217,0.4); }
  .btn-main:disabled { opacity:0.6; cursor:not-allowed; }
  .btn-outline {
    width:100%; padding:12px; border:1.5px solid var(--border); border-radius:30px;
    background:#fff; color:var(--text-muted); font-family:'Nunito',sans-serif;
    font-weight:800; font-size:14px; cursor:pointer; transition:all 0.2s; margin-top:8px;
  }
  .btn-outline:hover { border-color:var(--purple); color:var(--purple); }

  /* ─── ALERT ─── */
  .alert { padding:12px 16px; border-radius:12px; font-size:13px; font-weight:700; margin-bottom:16px; }
  .alert.error   { background:#FFEEF2; color:var(--red);   border:1.5px solid #FFCCD6; }
  .alert.success { background:#E3FDF0; color:#16A362;      border:1.5px solid #A3F5D0; }

  /* ─── LEVEL PICKER ─── */
  .level-section { margin-top:8px; }
  .level-section-title { font-family:'Fredoka One',cursive; font-size:18px; color:var(--text); margin-bottom:6px; }
  .level-section-sub   { font-size:12px; color:var(--text-muted); font-weight:600; margin-bottom:18px; line-height:1.5; }

  .level-options { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
  .level-card {
    display:flex; align-items:center; gap:14px;
    padding:14px 16px; border-radius:16px;
    border:2px solid var(--border); background:#fff;
    cursor:pointer; transition:all 0.2s;
  }
  .level-card:hover   { border-color:var(--purple); background:var(--bg3); }
  .level-card.selected { border-color:var(--purple); background:linear-gradient(120deg,#EDE9FF,#E8F0FF); box-shadow:0 0 0 3px rgba(123,94,255,0.1); }
  .level-badge { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:900; color:#fff; flex-shrink:0; font-family:'Fredoka One',cursive; }
  .level-info .level-name { font-weight:800; font-size:14px; color:var(--text); }
  .level-info .level-desc { font-size:11px; color:var(--text-muted); font-weight:600; }
  .level-check { margin-left:auto; font-size:18px; }

  .divider { display:flex; align-items:center; gap:12px; margin:16px 0; color:var(--text-muted); font-size:12px; font-weight:700; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ─── TEST OPTION ─── */
  .test-card {
    display:flex; align-items:center; gap:14px;
    padding:16px; border-radius:16px;
    border:2px dashed var(--purple-light);
    background:linear-gradient(120deg,#F8F6FF,#EDF4FF);
    cursor:pointer; transition:all 0.2s;
  }
  .test-card:hover { border-color:var(--purple); box-shadow:var(--shadow); }
  .test-icon { font-size:32px; }
  .test-info .test-title { font-weight:800; font-size:14px; color:var(--purple); }
  .test-info .test-desc  { font-size:11px; color:var(--text-muted); font-weight:600; }

  /* ─── PLACEMENT TEST ─── */
  .test-header { text-align:center; margin-bottom:24px; }
  .test-progress-bar { height:6px; background:var(--bg3); border-radius:6px; overflow:hidden; margin-bottom:6px; }
  .test-progress-fill { height:100%; background:linear-gradient(90deg,var(--purple),var(--blue)); border-radius:6px; transition:width 0.4s; }
  .test-counter { font-size:12px; color:var(--text-muted); font-weight:700; }

  .question-card { background:var(--bg3); border-radius:20px; padding:22px; margin-bottom:20px; }
  .question-text { font-family:'Fredoka One',cursive; font-size:17px; color:var(--text); line-height:1.4; }

  .answers-grid { display:flex; flex-direction:column; gap:10px; }
  .answer-btn {
    padding:13px 18px; border-radius:14px; border:2px solid var(--border);
    background:#fff; font-family:'Nunito',sans-serif; font-weight:700;
    font-size:14px; color:var(--text); cursor:pointer; transition:all 0.2s; text-align:left;
  }
  .answer-btn:hover:not(:disabled)    { border-color:var(--purple); background:var(--bg3); }
  .answer-btn.correct  { border-color:var(--green); background:#E3FDF0; color:var(--green); }
  .answer-btn.wrong    { border-color:var(--red);   background:#FFEEF2; color:var(--red);   }
  .answer-btn:disabled { cursor:not-allowed; }

  /* ─── RESULT ─── */
  .result-card { text-align:center; padding:10px 0; }
  .result-owl  { font-size:64px; margin-bottom:12px; animation:owlBob 2s ease-in-out infinite; }
  .result-title { font-family:'Fredoka One',cursive; font-size:26px; color:var(--text); margin-bottom:8px; }
  .result-level { display:inline-block; padding:8px 24px; border-radius:30px; font-family:'Fredoka One',cursive; font-size:20px; color:#fff; background:linear-gradient(135deg,var(--purple-dark),var(--blue)); margin-bottom:12px; box-shadow:0 4px 16px rgba(91,63,217,0.3); }
  .result-sub   { font-size:13px; color:var(--text-muted); font-weight:600; line-height:1.6; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const LEVELS = [
  { id:1, emoji:'🌱', name:'Beginner',      desc:'I know almost no English',                    color:'#22C67A' },
  { id:2, emoji:'📗', name:'Elementary',    desc:'I know basic words and simple sentences',     color:'#3B8FFF' },
  { id:3, emoji:'📘', name:'Intermediate',  desc:'I can hold a basic conversation',             color:'#7B5EFF' },
  { id:4, emoji:'📙', name:'Upper-Intermediate', desc:'I understand most everyday English',     color:'#FFB800' },
  { id:5, emoji:'📕', name:'Advanced',      desc:'I speak fluently with minor mistakes',        color:'#FF8C42' },
  { id:6, emoji:'🏆', name:'Proficient',    desc:'I speak English at near-native level',        color:'#FF5C7A' },
];

const PLACEMENT_QUESTIONS = [
  {
    id:1, level:1,
    text:'Choose the correct sentence:',
    answers:['She have a cat.','She has a cat.','She haves a cat.','She is have a cat.'],
    correct:1,
  },
  {
    id:2, level:2,
    text:'What is the past tense of "go"?',
    answers:['Goed','Goes','Went','Gone'],
    correct:2,
  },
  {
    id:3, level:3,
    text:'Complete: "If I ___ rich, I would travel the world."',
    answers:['am','was','were','be'],
    correct:2,
  },
  {
    id:4, level:4,
    text:'"The report needs to be submitted by Friday." What does "submitted" mean here?',
    answers:['Read carefully','Handed in / delivered','Corrected','Printed'],
    correct:1,
  },
  {
    id:5, level:5,
    text:'Which sentence uses the subjunctive mood correctly?',
    answers:[
      'I suggest that he goes home.',
      'I suggest that he go home.',
      'I suggest that he will go home.',
      'I suggest that he should goes home.',
    ],
    correct:1,
  },
  {
    id:6, level:6,
    text:'"The legislation was lambasted by critics." What does "lambasted" mean?',
    answers:['Praised','Ignored','Harshly criticized','Quickly passed'],
    correct:2,
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function PlacementTest({ onComplete, onBack }) {
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);

  const q       = PLACEMENT_QUESTIONS[current];
  const total   = PLACEMENT_QUESTIONS.length;
  const pct     = Math.round(((current) / total) * 100);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 < total) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setDone(true);
      }
    }, 900);
  };

  // חישוב רמה לפי ציון
  const calcLevel = () => {
    if (score <= 1) return 1;
    if (score === 2) return 2;
    if (score === 3) return 3;
    if (score === 4) return 4;
    if (score === 5) return 5;
    return 6;
  };

  if (done) {
    const level = calcLevel();
    const lv    = LEVELS[level - 1];
    return (
      <div className="result-card">
        <div className="result-owl">🦉</div>
        <div className="result-title">Test Complete! 🎉</div>
        <p style={{ fontSize:13, color:'var(--text-muted)', fontWeight:700, marginBottom:16 }}>
          You answered {score} out of {total} correctly
        </p>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>
            Your recommended level:
          </div>
          <div className="result-level">{lv.emoji} Level {level} — {lv.name}</div>
        </div>
        <div className="result-sub" style={{ marginBottom:24 }}>
          {lv.desc}.<br />You can always change your level later in Settings.
        </div>
        <button className="btn-main" onClick={() => onComplete(level)}>
          🚀 Start Learning!
        </button>
        <button className="btn-outline" onClick={onBack}>
          ← Choose level manually instead
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="test-header">
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, color:'var(--text)', marginBottom:12 }}>
          🧠 Placement Test
        </div>
        <div className="test-progress-bar">
          <div className="test-progress-fill" style={{ width:`${pct}%` }} />
        </div>
        <div className="test-counter">Question {current + 1} of {total}</div>
      </div>

      <div className="question-card">
        <div className="question-text">{q.text}</div>
      </div>

      <div className="answers-grid">
        {q.answers.map((ans, idx) => {
          let cls = 'answer-btn';
          if (answered) {
            if (idx === q.correct)  cls += ' correct';
            else if (idx === selected) cls += ' wrong';
          }
          return (
            <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={answered}>
              <span style={{ marginRight:10, opacity:0.5 }}>
                {['A','B','C','D'][idx]}.
              </span>
              {ans}
            </button>
          );
        })}
      </div>

      <button className="btn-outline" style={{ marginTop:16 }} onClick={onBack}>
        ← Back to level selection
      </button>
    </div>
  );
}

function LevelPicker({ onSelectLevel, onStartTest }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="level-section">
      <div className="level-section-title">🎯 What's your English level?</div>
      <div className="level-section-sub">
        Choose the level that best describes your English. Don't worry — you can change it later!
      </div>

      <div className="level-options">
        {LEVELS.map((lv) => (
          <div
            key={lv.id}
            className={`level-card ${selected === lv.id ? 'selected' : ''}`}
            onClick={() => setSelected(lv.id)}
          >
            <div className="level-badge" style={{ background: lv.color }}>
              {lv.emoji}
            </div>
            <div className="level-info">
              <div className="level-name">Level {lv.id} — {lv.name}</div>
              <div className="level-desc">{lv.desc}</div>
            </div>
            {selected === lv.id && <div className="level-check">✅</div>}
          </div>
        ))}
      </div>

      <button
        className="btn-main"
        disabled={!selected}
        onClick={() => onSelectLevel(selected)}
      >
        ✅ Start at Level {selected || '?'}
      </button>

      <div className="divider">or</div>

      <div className="test-card" onClick={onStartTest}>
        <div className="test-icon">🧠</div>
        <div className="test-info">
          <div className="test-title">Take the Glottie Placement Test</div>
          <div className="test-desc">6 quick questions · ~2 minutes · We'll find your perfect level!</div>
        </div>
        <div style={{ marginLeft:'auto', fontSize:20 }}>→</div>
      </div>
    </div>
  );
}

// ─── MAIN AUTH ─────────────────────────────────────────────────────────────────

export default function AuthPage({ onAuthSuccess }) {
  const dispatch = useDispatch();

  const [tab, setTab]         = useState('login');   // 'login' | 'register'
  const [step, setStep]       = useState('form');    // 'form' | 'level' | 'test'
  const [alert, setAlert]     = useState(null);      // { type, msg }
  const [regData, setRegData] = useState(null);      // נתוני רישום זמניים

  // ── Login form state ──
  const [loginForm, setLoginForm] = useState({ email:'', password:'' });

  // ── Register form state ──
  const [regForm, setRegForm] = useState({
    firstName:'', lastName:'', email:'', password:'', confirmPassword:'',
  });
  const [errors, setErrors] = useState({});

  // ── RTK Query ──
  const [loginUser,    { isLoading: loggingIn  }] = useLoginUserMutation();
  const [registerUser, { isLoading: registering }] = useRegisterUserMutation();

  // ── Validation ──
  const validateRegister = () => {
    const e = {};
    if (!regForm.firstName.trim()) e.firstName = 'Required';
    if (!regForm.lastName.trim())  e.lastName  = 'Required';
    if (!regForm.email.includes('@')) e.email  = 'Invalid email';
    if (regForm.password.length < 6)  e.password = 'Min 6 characters';
    if (regForm.password !== regForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setAlert(null);
    try {
      const result = await loginUser(loginForm).unwrap();
      // שמור ב-Redux + localStorage
      dispatch(setUser({ token: result.token, user: result.user }));
      onAuthSuccess();
    } catch (err) {
      setAlert({ type:'error', msg: err?.data?.message || 'Invalid email or password.' });
    }
  };

  // ── Register step 1 — form ──
  const handleRegisterNext = (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    // שמור נתונים זמנית, עבור לבחירת רמה
    setRegData(regForm);
    setStep('level');
  };

  // ── Register step 2 — user chose level manually ──
  const handleSelectLevel = async (levelId) => {
    await submitRegister(levelId);
  };

  // ── Register step 2 — user finished test ──
  const handleTestComplete = async (levelId) => {
    await submitRegister(levelId);
  };

  // ── שליחת הרישום עם הרמה ──
  const submitRegister = async (levelId) => {
    setAlert(null);
    try {
      const payload = {
        firstName:    regData.firstName,
        lastName:     regData.lastName,
        email:        regData.email,
        password:     regData.password,
        currentLevel: levelId,
      };
      const result = await registerUser(payload).unwrap();
      // שמור ב-Redux + localStorage
      dispatch(setUser({ token: result.token, user: result.user }));
      onAuthSuccess();
    } catch (err) {
      setAlert({ type:'error', msg: err?.data?.message || 'Registration failed. Please try again.' });
      setStep('form'); // חזור לטופס
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-bg">
        {/* בלובים ברקע */}
        <div className="blob" style={{ width:400, height:400, background:'#B09EFF', top:-100, right:-100, animationDelay:'0s' }} />
        <div className="blob" style={{ width:300, height:300, background:'#93C5FD', bottom:-80, left:-80,  animationDelay:'2s' }} />
        <div className="blob" style={{ width:200, height:200, background:'#6EE7B7', top:'40%', left:'10%', animationDelay:'4s' }} />

        <div className="auth-card">

          {/* לוגו */}
          <div className="auth-logo">
            <span className="auth-owl">🦉</span>
            <div className="auth-brand">GLOTTIE</div>
            <div className="auth-subtitle">
              {step === 'form'  ? 'Your personal language learning journey' : ''}
              {step === 'level' ? 'Almost there! Just one more step 🎯'      : ''}
              {step === 'test'  ? 'Let\'s find your perfect level 🧠'         : ''}
            </div>
          </div>

          {/* ─── Step: FORM (login / register) ─── */}
          {step === 'form' && (
            <>
              <div className="auth-tabs">
                <button className={`auth-tab ${tab === 'login'    ? 'active' : ''}`} onClick={() => { setTab('login');    setAlert(null); }}>
                  🔐 Login
                </button>
                <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setAlert(null); }}>
                  ✨ Sign Up
                </button>
              </div>

              {alert && (
                <div className={`alert ${alert.type}`}>
                  {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
                </div>
              )}

              {/* ── LOGIN ── */}
              {tab === 'login' && (
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email" placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password" placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                  </div>
                  <button className="btn-main" type="submit" disabled={loggingIn}>
                    {loggingIn ? 'Logging in...' : '🚀 Login to Glottie'}
                  </button>
                  <p style={{ textAlign:'center', marginTop:16, fontSize:13, color:'var(--text-muted)', fontWeight:700 }}>
                    New to Glottie?{' '}
                    <span style={{ color:'var(--purple)', cursor:'pointer' }} onClick={() => setTab('register')}>
                      Create an account →
                    </span>
                  </p>
                </form>
              )}

              {/* ── REGISTER ── */}
              {tab === 'register' && (
                <form onSubmit={handleRegisterNext}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        placeholder="Alex"
                        value={regForm.firstName}
                        onChange={(e) => setRegForm((p) => ({ ...p, firstName: e.target.value }))}
                      />
                      {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                        placeholder="Johnson"
                        value={regForm.lastName}
                        onChange={(e) => setRegForm((p) => ({ ...p, lastName: e.target.value }))}
                      />
                      {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      type="email" placeholder="you@example.com"
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
                        type="password" placeholder="Min 6 chars"
                        value={regForm.password}
                        onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))}
                      />
                      {errors.password && <div className="field-error">{errors.password}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        type="password" placeholder="Repeat password"
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      />
                      {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  <button className="btn-main" type="submit" disabled={registering}>
                    {registering ? 'Creating account...' : '✨ Continue →'}
                  </button>
                  <p style={{ textAlign:'center', marginTop:16, fontSize:13, color:'var(--text-muted)', fontWeight:700 }}>
                    Already have an account?{' '}
                    <span style={{ color:'var(--purple)', cursor:'pointer' }} onClick={() => setTab('login')}>
                      Login →
                    </span>
                  </p>
                </form>
              )}
            </>
          )}

          {/* ─── Step: LEVEL PICKER ─── */}
          {step === 'level' && (
            <>
              {alert && (
                <div className={`alert ${alert.type}`}>⚠️ {alert.msg}</div>
              )}
              <LevelPicker
                onSelectLevel={handleSelectLevel}
                onStartTest={() => setStep('test')}
              />
            </>
          )}

          {/* ─── Step: PLACEMENT TEST ─── */}
          {step === 'test' && (
            <PlacementTest
              onComplete={handleTestComplete}
              onBack={() => setStep('level')}
            />
          )}
        </div>
      </div>
    </>
  );
}
