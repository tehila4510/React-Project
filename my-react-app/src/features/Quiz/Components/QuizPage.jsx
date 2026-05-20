import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/quizStyles.css";
import { 
  useStartSessionMutation, useEndSessionMutation, 
  useLazyGetNextQuestionQuery, useSubmitAnswerMutation, useLoseHeartMutation 
} from "../Redux/api";

import QuizProgress from "./QuizProgress";
import AnswerFeedback from "./AnswerFeedback";
import QuizResult from "./QuizResult";
import GameOverDialog from "./GameOverDialog"; // פיצול חדש
import QuestionFactory from "./QuestionFactory"; // בלי /Types/ באמצע!
const MAX_QUESTIONS = 10;

export default function QuizPage({ skill, onClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const [phase, setPhase] = useState("loading");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userTypedAnswer, setUserTypedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [hearts, setHearts] = useState(currentUser?.hearts ?? 5);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);

  const [startSession] = useStartSessionMutation();
  const [endSession] = useEndSessionMutation();
  const [fetchNext] = useLazyGetNextQuestionQuery();
  const [submitAnswer, { isLoading: submitting }] = useSubmitAnswerMutation();
  const [loseHeart] = useLoseHeartMutation();

  const isTextMode = question?.options?.length === 1;

  const loadNextQuestion = async (sid, count) => {
    setPhase("loading");
    setFeedback(null); setSelectedOption(null); setUserTypedAnswer("");
    try {
      const q = await fetchNext({ sessionId: sid || sessionId, skillId: skill?.skillId }).unwrap();
      if (!q) return finishSession(sid || sessionId);
      setQuestion(q);
      setQuestionCount(count + 1);
      setPhase("question");
    } catch (err) { finishSession(sid || sessionId); }
  };
const handleSubmit = async () => {
  // זיהוי סוג השאלה הנוכחית לפי המסיכה
  const mask = question.questionTypeMask;
  const isText = (mask & 2) || (mask & 512);
  const isOrdering = (mask & 8);

  let userAnswerText = "";
  let selectedOptionId = question.options?.[0]?.optionId || 0;

  if (isText) {
    userAnswerText = userTypedAnswer;
  } else if (isOrdering) {
    userAnswerText = selectedOption?.optionText || "";
    selectedOptionId = 999; 
  } else {
    userAnswerText = selectedOption?.optionText || "";
    selectedOptionId = selectedOption?.optionId || selectedOptionId;
  }

  const dto = {
    answerRecordId: question.answerRecordId,
    userId: currentUser.userId,
    questionId: question.questionId,
    sessionId,
    userAnswerText,
    selectedOptionId,
  };

  try {
    const review = await submitAnswer({ answerDto: dto }).unwrap();
    setFeedback(review);
    setPhase("feedback");
    
    if (review.isCorrect) {
      setCorrectCount(c => c + 1);
    } else {
      const { hasHearts } = await loseHeart().unwrap();
      setHearts(prev => Math.max(0, prev - 1));
      if (!hasHearts) setIsGameOverOpen(true);
    }
  } catch (err) { 
    console.error("Error submitting answer:", err); 
  }
};
  const finishSession = async (sid) => {
    setPhase("loading");
    const result = await endSession(sid || sessionId).unwrap();
    setSessionResult(result);
    setPhase("result");
  };

  useEffect(() => { 
    const init = async () => {
      const sid = await startSession().unwrap();
      setSessionId(sid);
      loadNextQuestion(sid, 0);
    };
    init();
  }, []);

  if (phase === "result") return <QuizResult result={sessionResult} correctCount={correctCount} totalQuestions={questionCount} onHome={onClose} onPlayAgain={() => window.location.reload()} />;

  return (
    <div className="quiz-wrapper">
      <QuizProgress current={questionCount} total={MAX_QUESTIONS} hearts={hearts} onClose={onClose} />

      {phase === "loading" ? (
        <div className="quiz-loading"><div className="quiz-spinner" /></div>
      ) : (
        <>
         <QuestionFactory 
    question={question} 
    selectedOption={selectedOption}
    onSelect={setSelectedOption}
    userTypedAnswer={userTypedAnswer}
    onType={setUserTypedAnswer}
    submitted={phase === "feedback"}
    feedback={feedback}
  />

          {phase === "question" && (
            <button className="quiz-submit-btn" disabled={submitting || (!selectedOption && !userTypedAnswer)} onClick={handleSubmit}>
              {submitting ? "Checking..." : "✅ Submit Answer"}
            </button>
          )}

          {phase === "feedback" && <AnswerFeedback feedback={feedback} onNext={() => questionCount >= MAX_QUESTIONS ? finishSession() : loadNextQuestion(sessionId, questionCount)} />}
        </>
      )}

      <GameOverDialog open={isGameOverOpen} onConfirm={() => finishSession()} />
    </div>
  );
}