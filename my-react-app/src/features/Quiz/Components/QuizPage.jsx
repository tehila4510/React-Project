import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/quizStyles.css";
import {
  useStartSessionMutation,
  useEndSessionMutation,
  useLazyGetNextQuestionQuery,
  useSubmitAnswerMutation,
  useLoseHeartMutation,
} from "../Redux/api";

import QuizProgress from "./QuizProgress";
import QuestionCard from "./QuestionCard";
import AnswerFeedback from "./AnswerFeedback";
import QuizResult from "./QuizResult";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const MAX_QUESTIONS = 10;

export default function QuizPage({ skill, onClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?.userId;

  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState("loading");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [hearts, setHearts] = useState(currentUser?.hearts ?? 5);
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(false);

  // ── RTK Query ──────────────────────────────────────────────────────────────
  const [startSession] = useStartSessionMutation();
  const [endSession] = useEndSessionMutation();
  const [fetchNextQuestion] = useLazyGetNextQuestionQuery();
  const [submitAnswer, { isLoading: submitting }] = useSubmitAnswerMutation();
  const [loseHeart] = useLoseHeartMutation();

  // ── Logic Functions ────────────────────────────────────────────────────────

  const finishSession = async (sid) => {
    setPhase("loading");
    try {
      const result = await endSession(sid || sessionId).unwrap();
      setSessionResult(result);
      setPhase("result");
    } catch (err) {
      console.error("End session failed", err);
      setSessionResult({ score: 0, xp: 0 });
      setPhase("result");
    }
  };

  const loadNextQuestion = async (sid, count) => {
    setPhase("loading");
    setFeedback(null);
    setSelectedOption(null);
    setSubmitError(null);

    try {
      const q = await fetchNextQuestion({
        sessionId: sid || sessionId,
        skillId: skill?.skillId || null,
      }).unwrap();

      if (!q) {
        await finishSession(sid || sessionId);
        return;
      }

      setQuestion(q);
      setQuestionCount(count + 1);
      setPhase("question");
    } catch (err) {
      console.error("Failed to load question", err);
      await finishSession(sid || sessionId);
    }
  };

  const initSession = async () => {
    try {
      const sid = await startSession().unwrap();
      setSessionId(sid);
      await loadNextQuestion(sid, 0);
    } catch (err) {
      console.error("Failed to start session", err);
      setSubmitError("Could not start quiz. Please try again.");
      setPhase("question");
    }
  };

  // ── Event Handlers ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (selectedOption === null || !question) return;
    setSubmitError(null);

    try {
      const dto = {
        answerRecordId: question.answerRecordId,
        userId,
        questionId: question.questionId,
        sessionId,
        userAnswerText: selectedOption.optionText,
        selectedOptionId: selectedOption.optionId,
      };

      const review = await submitAnswer({ answerDto: dto }).unwrap();
      setFeedback(review);
      setPhase("feedback");

      if (review.isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        const { hasHearts } = await loseHeart().unwrap();
        setHearts((prev) => (prev > 0 ? prev - 1 : 0));
        if (!hasHearts) {
          setIsGameOverDialogOpen(true);
        }
      }
    } catch (err) {
      console.error("Submit failed", err);
      setSubmitError("Failed to submit answer. Please try again.");
    }
  };

  const handleConfirmGameOver = async () => {
    setIsGameOverDialogOpen(false);
    await finishSession(sessionId);
  };

  const handleNext = async () => {
    if (questionCount >= MAX_QUESTIONS) {
      await finishSession(sessionId);
    } else {
      await loadNextQuestion(sessionId, questionCount);
    }
  };

  const handlePlayAgain = () => {
    setSessionResult(null);
    setQuestionCount(0);
    setCorrectCount(0);
    setPhase("loading");
    initSession();
  };

  useEffect(() => {
    initSession();
    // eslint-disable-next-line
  }, []);
useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to log out? Your progress in this session will be deleted."; 
       return e.returnValue;
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);
  return (
    <>
      <div className="quiz-wrapper">
        {phase === "result" && (
          <QuizResult
            result={sessionResult}
            correctCount={correctCount}
            totalQuestions={questionCount}
            onHome={onClose}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {phase === "loading" && (
          <>
            <QuizProgress
              current={questionCount}
              total={MAX_QUESTIONS}
              hearts={hearts}
              skillName={skill?.name}
              skillIcon={skill?.icon}
              onClose={onClose}
            />
            <div className="quiz-loading">
              <div className="quiz-spinner" />
              Loading...
            </div>
          </>
        )}

        {(phase === "question" || phase === "feedback") && (
          <>
            <QuizProgress
              current={questionCount}
              total={MAX_QUESTIONS}
              hearts={hearts}
              onClose={onClose}
            />
            <QuestionCard
              question={question}
              selectedOption={selectedOption?.optionId}
              onSelect={setSelectedOption}
              feedback={feedback}
              submitted={phase === "feedback"}
            />
            {submitError && (
              <div
                style={{
                  width: "100%",
                  maxWidth: 680,
                  background: "#FFEEF2",
                  color: "#FF5C7A",
                  border: "1.5px solid #FFCCD6",
                  borderRadius: 14,
                  padding: "12px 16px",
                  marginTop: 12,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                ⚠️ {submitError}
              </div>
            )}
            {phase === "question" && (
              <button
                className="quiz-submit-btn"
                style={{ width: "100%", maxWidth: 680, marginTop: 16 }}
                disabled={!selectedOption || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Checking..." : "✅ Submit Answer"}
              </button>
            )}
            {phase === "feedback" && (
              <AnswerFeedback
                feedback={feedback}
                onNext={handleNext}
                isLastQuestion={questionCount >= MAX_QUESTIONS}
              />
            )}
          </>
        )}
      </div>

      <Dialog
        open={isGameOverDialogOpen}
        aria-labelledby="game-over-title"
        aria-describedby="game-over-description"
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          setIsGameOverDialogOpen(false);
        }}
        slotProps={{
          paper: {
            style: {
              borderRadius: 16,
              padding: 12,
              direction: "rtl",
              textAlign: "right",
            },
          },
        }}
      >
        <DialogTitle
          id="game-over-title"
          style={{ fontWeight: 700, color: "#1976d2" }}
        >
          End of session{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="game-over-description"
            style={{ fontSize: 16, color: "#333", marginTop: 8 }}
          >
            There are no hearts left available on the server for this session.
            Click the OK button to view the results summary.{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "flex-start",
            paddingRight: 24,
            paddingLeft: 24,
            paddingBottom: 16,
          }}
        >
          <Button
            onClick={handleConfirmGameOver}
            variant="contained"
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 8,
              padding: "6px 16px",
            }}
            autoFocus
          >
            Confirmation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
