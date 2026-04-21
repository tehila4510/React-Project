// ─── STYLES ───────────────────────────────────────────────────────────────────
export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');

  .chat-page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 65px);
    padding: 0;
    position: relative;
    background: var(--bg);
    overflow: hidden;
  }

  /* ─── HEADER ─── */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 28px;
    background: #fff;
    border-bottom: 1.5px solid var(--border);
    box-shadow: 0 2px 12px rgba(123,94,255,0.06);
    flex-shrink: 0;
  }
  .chat-teacher-avatar {
    width: 48px; height: 48px;
    border-radius: 16px;
    background: linear-gradient(135deg, #7B5EFF, #3B8FFF);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(123,94,255,0.3);
    flex-shrink: 0;
    animation: owlBob 3s ease-in-out infinite;
  }
  @keyframes owlBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  .chat-teacher-info .teacher-name {
    font-family: 'Fredoka One', cursive;
    font-size: 17px; color: var(--text);
  }
  .chat-teacher-info .teacher-status {
    font-size: 12px; font-weight: 700;
    color: #22C67A;
    display: flex; align-items: center; gap: 5px;
  }
  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%; background: #22C67A;
    animation: statusPulse 2s ease-in-out infinite;
  }
  @keyframes statusPulse {
    0%,100%{opacity:1;transform:scale(1)}
    50%{opacity:0.6;transform:scale(0.8)}
  }
  .chat-clear-btn {
    margin-left: auto;
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text-muted);
    padding: 7px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .chat-clear-btn:hover { border-color: var(--red); color: var(--red); }

  /* ─── MESSAGES AREA ─── */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .chat-messages::-webkit-scrollbar { width: 5px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 5px; }

  /* ─── WELCOME ─── */
  .chat-welcome {
    text-align: center;
    padding: 32px 20px;
    max-width: 480px;
    margin: 0 auto;
  }
  .chat-welcome-owl { font-size: 64px; display: block; margin-bottom: 12px; animation: owlBob 3s ease-in-out infinite; }
  .chat-welcome-title {
    font-family: 'Fredoka One', cursive;
    font-size: 24px; color: var(--text); margin-bottom: 8px;
  }
  .chat-welcome-sub {
    font-size: 13px; color: var(--text-muted); font-weight: 600;
    line-height: 1.65; margin-bottom: 20px;
  }
  .chat-suggestions {
    display: flex; flex-wrap: wrap; gap: 8px;
    justify-content: center;
  }
  .chat-suggestion {
    background: #fff;
    border: 1.5px solid var(--border);
    padding: 8px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 700; color: var(--purple);
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(123,94,255,0.08);
  }
  .chat-suggestion:hover {
    background: #EDE9FF; border-color: var(--purple);
    transform: translateY(-2px);
  }

  /* ─── MESSAGE BUBBLE ─── */
  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    animation: msgIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .msg-row.user  { flex-direction: row-reverse; }
  .msg-row.model { flex-direction: row; }

  .msg-avatar {
    width: 34px; height: 34px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }
  .msg-avatar.model { background: linear-gradient(135deg, #7B5EFF, #3B8FFF); box-shadow: 0 2px 8px rgba(123,94,255,0.3); }
  .msg-avatar.user  { background: linear-gradient(135deg, #FFB800, #FF8C42); box-shadow: 0 2px 8px rgba(255,184,0,0.3);  }

  .msg-bubble {
    max-width: 68%;
    padding: 13px 17px;
    border-radius: 20px;
    font-size: 14px; font-weight: 600; line-height: 1.65;
    position: relative;
  }
  .msg-bubble.model {
    background: #fff;
    border: 1.5px solid var(--border);
    border-bottom-left-radius: 5px;
    color: var(--text);
    box-shadow: 0 2px 12px rgba(123,94,255,0.08);
  }
  .msg-bubble.user {
    background: linear-gradient(135deg, #7B5EFF, #3B8FFF);
    color: #fff;
    border-bottom-right-radius: 5px;
    box-shadow: 0 2px 12px rgba(123,94,255,0.3);
  }

  .msg-time {
    font-size: 10px; font-weight: 700;
    color: var(--text-muted);
    margin-top: 4px;
    text-align: right;
  }
  .msg-row.model .msg-time { text-align: left; }

  /* Bold corrections from AI */
  .msg-bubble.model strong {
    color: #5B3FD9;
    font-weight: 900;
  }
  .msg-bubble.model em {
    color: #22C67A;
    font-style: normal;
    font-weight: 800;
  }

  /* ─── TYPING INDICATOR ─── */
  .typing-row {
    display: flex; align-items: flex-end; gap: 10px;
    animation: msgIn 0.3s ease;
  }
  .typing-bubble {
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 20px; border-bottom-left-radius: 5px;
    padding: 14px 18px;
    display: flex; gap: 5px; align-items: center;
    box-shadow: 0 2px 12px rgba(123,94,255,0.08);
  }
  .typing-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--purple-light);
    animation: typingBounce 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%,60%,100%{ transform: translateY(0);    opacity: 0.5; }
    30%         { transform: translateY(-8px); opacity: 1;   }
  }

  /* ─── INPUT AREA ─── */
  .chat-input-area {
    padding: 16px 24px 20px;
    background: #fff;
    border-top: 1.5px solid var(--border);
    flex-shrink: 0;
  }
  .chat-input-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--bg3);
    border: 2px solid var(--border);
    border-radius: 20px;
    padding: 8px 8px 8px 16px;
    transition: border-color 0.2s;
  }
  .chat-input-row:focus-within {
    border-color: var(--purple);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(123,94,255,0.1);
  }
  .chat-textarea {
    flex: 1;
    border: none;
    background: transparent;
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 600;
    color: var(--text);
    resize: none;
    outline: none;
    min-height: 22px;
    max-height: 120px;
    line-height: 1.5;
    padding: 4px 0;
  }
  .chat-textarea::placeholder { color: var(--text-muted); }
  .chat-send-btn {
    width: 42px; height: 42px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #5B3FD9, #3B8FFF);
    color: #fff; font-size: 18px;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(91,63,217,0.35);
  }
  .chat-send-btn:hover:not(:disabled) {
    transform: scale(1.08);
    box-shadow: 0 6px 18px rgba(91,63,217,0.45);
  }
  .chat-send-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .chat-hint {
    text-align: center;
    font-size: 11px; color: var(--text-muted); font-weight: 700;
    margin-top: 10px;
  }
  .chat-hint kbd {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 5px; padding: 1px 5px;
    font-size: 10px; font-family: inherit;
  }

  /* ─── ERROR ─── */
  .chat-error {
    background: #FFEEF2;
    border: 1.5px solid #FFCCD6;
    border-radius: 14px;
    padding: 11px 16px;
    font-size: 13px; font-weight: 700; color: #FF5C7A;
    display: flex; align-items: center; gap: 8px;
  }
`;
