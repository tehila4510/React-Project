import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../features/User/Redux/api";
import { setUser, updateCurrentUser } from "../features/User/Redux/userSlice";
import LoginTab from "./LoginForm";
import RegisterTab from "./RegisterForm";
import PlacementTest from "./PlacementTest";
import LevelPicker from "./LevelPicker";
import "./auth.css";

export default function AuthPage({ onAuthSuccess }) {
  const dispatch = useDispatch();

  // ניהול מצבי התצוגה
  const [tab, setTab] = useState("login"); // 'login' או 'register'
  const [step, setStep] = useState("form"); // 'form', 'level', או 'test'
  const [alert, setAlert] = useState(null);

  // מוטציות מה-API
  const [registerUser, { isLoading: registering }] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleRegisterNext = async (formData) => {
    setAlert(null);
    try {
      const dataToSend = new FormData();

      dataToSend.append("Name", formData.name);
      dataToSend.append("Email", formData.email);
      dataToSend.append("PasswordHash", formData.password);

      const result = await registerUser(dataToSend).unwrap();

      dispatch(
        setUser({
          token: result.token || result.Token,
          user: result.user || result.User,
        }),
      );

      setStep("level");
    } catch (err) {
      console.error("Registration error:", err);
      setAlert({
        type: "error",
        msg: err?.data?.errors
          ? Object.values(err.data.errors).flat().join(", ")
          : err?.data?.message || "Registration failed. Please try again.",
      });
    }
  };

  const handleLevelFinalize = async (formData) => {
    setAlert(null);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const userId = savedUser?.id;

      if (!userId) throw new Error("User ID not found");

      const dataToSend = new FormData();

      dataToSend.append("currentLevel", formData.levelId);

      const result= await updateUser(dataToSend).unwrap();
      dispatch(updateCurrentUser({ currentLevel: result.CurrentLevel }));

      onAuthSuccess();
    } catch (err) {
      console.error("Update level error:", err);
      onAuthSuccess();
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-owl">🦉</span>
          <div className="auth-brand">GLOTTIE</div>
        </div>

        {step === "form" && (
          <>
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => setTab("login")}
              >
                🔐 Login
              </button>
              <button
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
              >
                ✨ Sign Up
              </button>
            </div>

            {alert && <div className={`alert ${alert.type}`}>{alert.msg}</div>}

            {tab === "login" ? (
              <LoginTab
                onAuthSuccess={onAuthSuccess}
                setAlert={setAlert}
                setTab={setTab}
              />
            ) : (
              <RegisterTab onNextStep={handleRegisterNext} setTab={setTab} />
            )}
          </>
        )}

        {step === "level" && (
          <LevelPicker
            onSelectLevel={handleLevelFinalize}
            onStartTest={() => setStep("test")}
          />
        )}

        {step === "test" && (
          <PlacementTest
            onComplete={handleLevelFinalize}
            onBack={() => setStep("level")}
          />
        )}
      </div>
    </div>
  );
}
