
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  useStartSessionMutation,
  useEndSessionMutation,
  useLazyGetNextQuestionQuery,
  useSubmitAnswerMutation,
} from '../Redux/api';

import QuizProgress   from './QuizProgress';
import QuestionCard   from './QuestionCard';
import AnswerFeedback from './AnswerFeedback';
import QuizResult     from './QuizResult';
import quizStyles     from '../quizStyles';

const MAX_QUESTIONS = 10; 
export default function QuizPage({ skill, onClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const userId           = currentUser?.userId;

  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase]               = useState('loading');  // loading | question | feedback | result
  const [sessionId, setSessionId]       = useState(null);
  const [question, setQuestion]         = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);   // { optionId, optionText }
  const [feedback, setFeedback]         = useState(null);       // QuestionReviewDto
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount]   = useState(0);
  const [sessionResult, setSessionResult] = useState(null);     // SessionDto
  const [submitError, setSubmitError]   = useState(null);

  // ── RTK Query ──────────────────────────────────────────────────────────────
  const [startSession]            = useStartSessionMutation();
  const [endSession]              = useEndSessionMutation();
  const [fetchNextQuestion]       = useLazyGetNextQuestionQuery();
  const [submitAnswer, { isLoading: submitting }] = useSubmitAnswerMutation();

  // ── Start on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    initSession();
    // eslint-disable-next-line
  }, []); 

  const initSession = async () => {
    try {
      setPhase('loading');
      // 1. פתח סשן
      const sid = await startSession(userId).unwrap();
      setSessionId(sid);
      // 2. שלוף שאלה ראשונה
      await loadNextQuestion(sid, 0);
    } catch (err) {
      console.error('Failed to start session', err);
      setSubmitError('Could not start quiz. Please try again.');
      setPhase('question');
    }
  };

  const loadNextQuestion = async (sid, count) => {
    setPhase('loading');
    setFeedback(null);
    setSelectedOption(null);
    setSubmitError(null);

    try {
      const q = await fetchNextQuestion({
        userId,
        sessionId: sid || sessionId,
        skillId: skill?.skillId || null,
      }).unwrap();

      if (!q) {
        await finishSession(sid || sessionId);
        return;
      }

      setQuestion(q);
      setQuestionCount(count + 1);
      setPhase('question');
    } catch (err) {
      console.error('Failed to load question', err);

      await finishSession(sid || sessionId);
    }
  };

  // ── Submit answer ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedOption || !question) return;
    setSubmitError(null);

    try {
      const dto = {
        answerRecordId: question.answerRecordId,   
        userId,
        questionId:     question.questionId,
        sessionId,
        userAnswerText: selectedOption.optionText,
        selectedOptionId: selectedOption.optionId,
      };

      const review = await submitAnswer({ userId, answerDto: dto }).unwrap();

      setFeedback(review);
      if (review.isCorrect) setCorrectCount((c) => c + 1);
      setPhase('feedback');
    } catch (err) {
      console.error('Submit failed', err);
      setSubmitError('Failed to submit answer. Please try again.');
    }
  };

  // ── Next question ───────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (questionCount >= MAX_QUESTIONS) {
      await finishSession(sessionId);
    } else {
      await loadNextQuestion(sessionId, questionCount);
    }
  };

  // ── End session ─────────────────────────────────────────────────────────────
  const finishSession = async (sid) => {
    setPhase('loading');
    try {
      const result = await endSession(sid || sessionId).unwrap();
      setSessionResult(result);
      setPhase('result');
    } catch (err) {
      console.error('End session failed', err);

      setSessionResult({ score: 0, xp: 0 });
      setPhase('result');
    }
  };

  // ── Play again ──────────────────────────────────────────────────────────────
  const handlePlayAgain = () => {
    setSessionResult(null);
    setQuestionCount(0);
    setCorrectCount(0);
    initSession();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{quizStyles}</style>

      <div className="quiz-wrapper">

        {/* ── Result ── */}
        {phase === 'result' && (
          <>
            <QuizProgress
              current={questionCount}
              total={questionCount}
              skillName={skill?.name}
              skillIcon={skill?.icon}
              onClose={onClose}
            />
            <QuizResult
              result={sessionResult}
              correctCount={correctCount}
              totalQuestions={questionCount}
              onHome={onClose}
              onPlayAgain={handlePlayAgain}
            />
          </>
        )}

        {/* ── Loading ── */}
        {phase === 'loading' && (
          <>
            <QuizProgress
              current={questionCount}
              total={MAX_QUESTIONS}
              skillName={skill?.name}
              skillIcon={skill?.icon}
              onClose={onClose}
            />
            <div className="quiz-loading">
              <div className="quiz-spinner" />
              Loading next question...
            </div>
          </>
        )}

        {/* ── Question + Feedback ── */}
        {(phase === 'question' || phase === 'feedback') && (
          <>
            {/* Progress */}
            <QuizProgress
              current={questionCount}
              total={MAX_QUESTIONS}
              skillName={skill?.name}
              skillIcon={skill?.icon}
              onClose={onClose}
            />

            {/* שאלה */}
            <QuestionCard
              question={question}
              selectedOption={selectedOption?.optionId}
              onSelect={setSelectedOption}
              feedback={feedback}
              submitted={phase === 'feedback'}
            />

            {/* שגיאה */}
            {submitError && (
              <div style={{
                width: '100%', maxWidth: 680,
                background: '#FFEEF2', color: '#FF5C7A',
                border: '1.5px solid #FFCCD6',
                borderRadius: 14, padding: '12px 16px',
                marginTop: 12, fontWeight: 700, fontSize: 13,
              }}>
                ⚠️ {submitError}
              </div>
            )}

            {/* לפני שליחה — כפתור Submit */}
            {phase === 'question' && (
              <button
                className="quiz-submit-btn"
                style={{ width: '100%', maxWidth: 680, marginTop: 16 }}
                disabled={!selectedOption || submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Checking...' : '✅ Submit Answer'}
              </button>
            )}

            {/* אחרי שליחה — פידבק + Next */}
            {phase === 'feedback' && (
              <AnswerFeedback
                feedback={feedback}
                onNext={handleNext}
                isLastQuestion={questionCount >= MAX_QUESTIONS}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
