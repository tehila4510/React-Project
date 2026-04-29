import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { STYLES } from "../style.js";
import { askChatTeacher } from "../Redux/api";
import teacherAI from "../../../../public/teacherAI.png";
import teacherAI2 from "../../../../public/teacherAI2.PNG";
import teacherAI3 from "../../../../public/teacherAI3.PNG";
import UserAvatar from "../../User/Components/UserAvatar.jsx";

// ─── SUGGESTIONS ──────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Can you explain the difference between 'since' and 'for'?",
  "Correct this: 'I have went to school yesterday'",
  "How do I use the present perfect tense?",
  "Teach me 5 useful idioms 🎯",
  "Give me a speaking exercise! 🗣️",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Renders bold (**text**) from AI markdown
function renderMarkdown(text) {
  // ** → bold, * → em
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return <span key={i}>{part}</span>;
  });
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg-row ${msg.role}`}>
      <div className={`msg-avatar ${msg.role}`}>
        {isUser ? (
          <UserAvatar size={38} />
        ) : (
          <img src={teacherAI2} alt="logo" width="30px" />
        )}
      </div>
      <div>
        <div className={`msg-bubble ${msg.role}`}>
          {isUser ? msg.text : renderMarkdown(msg.text)}
        </div>
        <div className="msg-time">{formatTime(msg.time)}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-row">
      <img src={teacherAI2} alt="logo" width="30px" />
      <div className="msg-avatar model"></div>
      <div className="typing-bubble">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const BASE_URL = "https://localhost:7185/api";

export default function ChatView() {
  const { currentUser, token } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]); // { role, text, time }
  const [history, setHistory] = useState([]); // { role, text } — לשליחה לשרת
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  };
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", text: msg, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await askChatTeacher(msg, history, token);

      const botMsg = { role: "model", text: data.reply, time: new Date() };
      setMessages((prev) => [...prev, botMsg]);

      setHistory(
        data.updatedHistory.map((h) => ({
          role: h.role,
          text: h.text,
        })),
      );
    } catch (err) {
      console.error("Chat error:", err);
      setError("Could not reach the teacher. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setHistory([]);
    setError(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <div className="chat-page">
        {/* Header */}
        <div className="chat-header">
          <img src={teacherAI} alt="logo" width="70px" />
          <div className="chat-teacher-info">
            <div className="teacher-name">Glottie — AI English Teacher</div>
            <div className="teacher-status">
              <div className="status-dot" />
              Online · Always ready to help!
            </div>
          </div>
          {messages.length > 0 && (
            <button className="chat-clear-btn" onClick={handleClear}>
              🗑 Clear chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {/* Welcome screen */}
          {messages.length === 0 && !loading && (
            <div className="chat-welcome">
              <span className="chat-welcome-owl">
                {" "}
                <img src={teacherAI3} alt="logo" width="120px" />
              </span>
              <div className="chat-welcome-title">
                Hi {currentUser?.firstName || "there"}! I'm your English teacher
                👋
              </div>
              <div className="chat-welcome-sub">
                Ask me anything in English! I'll correct your mistakes, explain
                grammar, teach vocabulary, and always reply with a follow-up
                question to keep you practicing.
              </div>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="chat-suggestion"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {/* Typing */}
          {loading && <TypingIndicator />}

          {/* Error */}
          {error && <div className="chat-error">⚠️ {error}</div>}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-row">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Write in English... I'll help you!"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              title="Send message"
            >
              {loading ? (
                <span
                  style={{
                    fontSize: 14,
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                >
                  ⏳
                </span>
              ) : (
                "➤"
              )}
            </button>
          </div>
          <div className="chat-hint">
            Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>
    </>
  );
}
