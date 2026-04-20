
const quizStyles = `
  /* ─── QUIZ WRAPPER ─── */
  .quiz-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #F5F4FF 0%, #EDE9FF 50%, #E8F0FF 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px 48px;
    position: relative;
  }

  /* ─── HEADER ─── */
  .quiz-header {
    width: 100%;
    max-width: 680px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
  }
  .quiz-close-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(123,94,255,0.2);
    background: #fff;
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(123,94,255,0.1);
  }
  .quiz-close-btn:hover {
    border-color: var(--red);
    color: var(--red);
    transform: scale(1.1);
  }
  .quiz-skill-badge {
    display: flex; align-items: center; gap: 8px;
    background: #fff;
    border: 1.5px solid rgba(123,94,255,0.2);
    padding: 8px 16px;
    border-radius: 30px;
    font-weight: 800; font-size: 13px; color: #7B5EFF;
    box-shadow: 0 2px 8px rgba(123,94,255,0.1);
  }

  /* ─── PROGRESS BAR ─── */
  .quiz-progress-wrap {
    flex: 1;
    display: flex; flex-direction: column; gap: 6px;
  }
  .quiz-progress-bar {
    height: 10px;
    background: rgba(123,94,255,0.12);
    border-radius: 10px;
    overflow: hidden;
  }
  .quiz-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7B5EFF, #3B8FFF);
    border-radius: 10px;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .quiz-progress-text {
    font-size: 11px; font-weight: 800;
    color: #7B72A0;
    display: flex; justify-content: space-between;
  }

  /* ─── QUESTION CARD ─── */
  .quiz-card {
    width: 100%; max-width: 680px;
    background: #fff;
    border-radius: 28px;
    padding: 36px 40px;
    box-shadow: 0 8px 40px rgba(123,94,255,0.14);
    border: 1.5px solid rgba(123,94,255,0.12);
    animation: cardSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .quiz-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7B5EFF, #3B8FFF);
  }

  .question-level-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #EDE9FF;
    color: #7B5EFF; font-size: 11px; font-weight: 800;
    padding: 4px 12px; border-radius: 20px;
    margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
  }

  .question-title {
    font-family: 'Fredoka One', cursive;
    font-size: 15px; color: #7B72A0;
    margin-bottom: 10px;
  }
  .question-text {
    font-family: 'Fredoka One', cursive;
    font-size: 22px; line-height: 1.4;
    color: #1A1440;
    margin-bottom: 28px;
  }

  /* ─── OPTIONS ─── */
  .options-grid {
    display: flex; flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
  .option-btn {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px;
    border-radius: 16px;
    border: 2px solid rgba(123,94,255,0.15);
    background: #FAFAFE;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700;
    color: #1A1440;
    position: relative;
    overflow: hidden;
  }
  .option-btn:hover:not(:disabled):not(.selected) {
    border-color: #7B5EFF;
    background: #EDE9FF;
    transform: translateX(4px);
  }
  .option-btn.selected {
    border-color: #7B5EFF;
    background: linear-gradient(120deg, #EDE9FF, #E8F0FF);
    box-shadow: 0 0 0 3px rgba(123,94,255,0.12);
  }
  .option-btn:disabled { cursor: not-allowed; }

  /* אחרי שליחה */
  .option-btn.correct {
    border-color: #22C67A;
    background: linear-gradient(120deg, #E3FDF0, #F0FFF8);
    color: #16A362;
    animation: correctPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .option-btn.wrong {
    border-color: #FF5C7A;
    background: linear-gradient(120deg, #FFEEF2, #FFF5F7);
    color: #FF5C7A;
  }
  .option-btn.reveal-correct {
    border-color: #22C67A;
    background: linear-gradient(120deg, #E3FDF0, #F0FFF8);
    color: #16A362;
    opacity: 0.8;
  }
  @keyframes correctPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .option-letter {
    width: 32px; height: 32px;
    border-radius: 10px;
    background: rgba(123,94,255,0.1);
    color: #7B5EFF;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 13px;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .option-btn.selected   .option-letter { background: #7B5EFF; color: #fff; }
  .option-btn.correct    .option-letter { background: #22C67A; color: #fff; }
  .option-btn.wrong      .option-letter { background: #FF5C7A; color: #fff; }
  .option-btn.reveal-correct .option-letter { background: #22C67A; color: #fff; }

  .option-icon { margin-left: auto; font-size: 18px; }

  /* ─── SUBMIT BUTTON ─── */
  .quiz-submit-btn {
    width: 100%;
    padding: 16px;
    border: none; border-radius: 30px;
    background: linear-gradient(135deg, #5B3FD9, #3B8FFF);
    color: #fff;
    font-family: 'Fredoka One', cursive;
    font-size: 18px; letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(91,63,217,0.3);
  }
  .quiz-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(91,63,217,0.4);
  }
  .quiz-submit-btn:disabled {
    opacity: 0.5; cursor: not-allowed; transform: none;
  }

  /* ─── FEEDBACK PANEL ─── */
  .feedback-panel {
    width: 100%; max-width: 680px;
    margin-top: 16px;
    border-radius: 20px;
    padding: 20px 24px;
    display: flex; align-items: flex-start; gap: 16px;
    animation: feedbackIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid transparent;
  }
  @keyframes feedbackIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .feedback-panel.correct {
    background: linear-gradient(120deg, #E3FDF0, #F0FFF8);
    border-color: #A3F5D0;
  }
  .feedback-panel.wrong {
    background: linear-gradient(120deg, #FFEEF2, #FFF5F7);
    border-color: #FFCCD6;
  }
  .feedback-emoji { font-size: 36px; flex-shrink: 0; }
  .feedback-content {}
  .feedback-title {
    font-family: 'Fredoka One', cursive;
    font-size: 18px; margin-bottom: 4px;
  }
  .feedback-panel.correct .feedback-title { color: #16A362; }
  .feedback-panel.wrong   .feedback-title { color: #FF5C7A; }
  .feedback-msg { font-size: 13px; font-weight: 700; color: #7B72A0; line-height: 1.5; }
  .feedback-correct-answer {
    margin-top: 8px; font-size: 13px; font-weight: 800;
    color: #1A1440;
  }
  .feedback-correct-answer span { color: #22C67A; }

  /* ─── NEXT BUTTON ─── */
  .quiz-next-btn {
    width: 100%; max-width: 680px;
    margin-top: 12px;
    padding: 16px;
    border: none; border-radius: 30px;
    font-family: 'Fredoka One', cursive;
    font-size: 18px; letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .quiz-next-btn.correct {
    background: linear-gradient(135deg, #16A362, #22C67A);
    color: #fff;
    box-shadow: 0 6px 20px rgba(22,163,98,0.35);
  }
  .quiz-next-btn.wrong {
    background: linear-gradient(135deg, #5B3FD9, #3B8FFF);
    color: #fff;
    box-shadow: 0 6px 20px rgba(91,63,217,0.3);
  }
  .quiz-next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.2);
  }

  /* ─── LOADING ─── */
  .quiz-loading {
    display: flex; flex-direction: column;
    align-items: center; gap: 16px;
    padding: 60px 0;
    color: #7B72A0; font-weight: 700; font-size: 15px;
  }
  .quiz-spinner {
    width: 48px; height: 48px;
    border: 4px solid #EDE9FF;
    border-top-color: #7B5EFF;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── RESULT ─── */
  .result-wrapper {
    width: 100%; max-width: 680px;
    animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .result-card {
    background: #fff;
    border-radius: 28px;
    padding: 44px 40px;
    box-shadow: 0 8px 40px rgba(123,94,255,0.14);
    border: 1.5px solid rgba(123,94,255,0.12);
    text-align: center;
    margin-bottom: 16px;
    position: relative; overflow: hidden;
  }
  .result-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 6px;
    background: linear-gradient(90deg, #7B5EFF, #3B8FFF, #22C67A);
  }
  .result-owl {
    font-size: 72px;
    display: block; margin-bottom: 16px;
    animation: owlBob 2s ease-in-out infinite;
  }
  @keyframes owlBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

  .result-title {
    font-family: 'Fredoka One', cursive;
    font-size: 30px; color: #1A1440;
    margin-bottom: 8px;
  }
  .result-subtitle { font-size: 14px; color: #7B72A0; font-weight: 700; margin-bottom: 32px; }

  .result-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-bottom: 32px;
  }
  .result-stat {
    background: #F5F4FF;
    border-radius: 18px; padding: 20px 12px;
    border: 1.5px solid rgba(123,94,255,0.12);
  }
  .result-stat .r-val {
    font-family: 'Fredoka One', cursive;
    font-size: 32px;
    background: linear-gradient(135deg, #FFB800, #FF8C42);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .result-stat .r-lbl {
    font-size: 11px; font-weight: 800;
    color: #7B72A0; margin-top: 4px;
    text-transform: uppercase; letter-spacing: 1px;
  }

  /* XP bar */
  .xp-gained-wrap { margin-bottom: 28px; }
  .xp-gained-label {
    font-size: 13px; font-weight: 800; color: #7B72A0;
    margin-bottom: 8px; display: flex; justify-content: space-between;
  }
  .xp-bar-outer {
    height: 14px; background: #EDE9FF;
    border-radius: 14px; overflow: hidden;
  }
  .xp-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, #7B5EFF, #3B8FFF);
    border-radius: 14px;
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }
  .xp-bar-inner::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%);  }
  }

  /* Score ring */
  .score-ring-wrap {
    display: flex; justify-content: center; margin-bottom: 28px;
  }
  .score-ring-label {
    font-family: 'Fredoka One', cursive; font-size: 22px;
    fill: #1A1440;
  }
  .score-ring-sub { font-size: 11px; fill: #7B72A0; }

  /* Result buttons */
  .result-home-btn {
    width: 100%; padding: 16px;
    border: none; border-radius: 30px;
    background: linear-gradient(135deg, #5B3FD9, #3B8FFF);
    color: #fff; font-family: 'Fredoka One', cursive;
    font-size: 18px; letter-spacing: 1px;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(91,63,217,0.3);
  }
  .result-home-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(91,63,217,0.4);
  }
  .result-again-btn {
    width: 100%; padding: 14px; margin-top: 10px;
    border: 2px solid rgba(123,94,255,0.2); border-radius: 30px;
    background: #fff; color: #7B72A0;
    font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 15px;
    cursor: pointer; transition: all 0.2s;
  }
  .result-again-btn:hover { border-color: #7B5EFF; color: #7B5EFF; }

  /* ─── CONFETTI DOTS ─── */
  .confetti-dot {
    position: fixed;
    width: 10px; height: 10px;
    border-radius: 50%;
    pointer-events: none;
    animation: confettiFall linear forwards;
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
`;

export default quizStyles;
