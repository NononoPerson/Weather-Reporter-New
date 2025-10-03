import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

export default function ChatBotLandingPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your Mystical Chatbot. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [violationCount, setViolationCount] = useState(
    Number(localStorage.getItem('chat_violation_count') || 0)
  );
  const [cooldownUntil, setCooldownUntil] = useState(
    Number(localStorage.getItem('chat_cooldown_until') || 0)
  ); // timestamp ms
  const [isBlocked, setIsBlocked] = useState(() => Date.now() < Number(localStorage.getItem('chat_cooldown_until') || 0));
  const [remaining, setRemaining] = useState(0);
  const [lastViolationTs, setLastViolationTs] = useState(
    Number(localStorage.getItem('chat_last_violation') || 0)
  );
  const [devMode, setDevMode] = useState(false); // toggled by key combo
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  // Cooldown durations in seconds (escalating)
  const cooldownSeq = [30, 120, 300, 600, 900, 1800, 3600];

  // Utility: get account identifier safely (non-sensitive)
  const getAccountId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user?.username || user?.name || "guest";
    } catch {
      return "guest";
    }
  };

  // Per-account keys
  const accountId = getAccountId();
  const key_violation = `chat_violation_count_${accountId}`;
  const key_cooldown = `chat_cooldown_until_${accountId}`;
  const key_lastViolation = `chat_last_violation_${accountId}`;

  // Persist helpers (per-account)
  const persistViolationCount = (count) => {
    setViolationCount(count);
    try { localStorage.setItem(key_violation, String(count)); } catch {}
  };
  const persistCooldownUntil = (ts) => {
    setCooldownUntil(ts);
    try { localStorage.setItem(key_cooldown, String(ts)); } catch {}
  };
  const persistLastViolation = (ts) => {
    setLastViolationTs(ts);
    try { localStorage.setItem(key_lastViolation, String(ts)); } catch {}
  };

  // Initialize remaining & blocked on mount
  useEffect(() => {
    const now = Date.now();
    const stored = Number(localStorage.getItem(key_cooldown) || 0);
    if (stored && stored > now) {
      setIsBlocked(true);
      setCooldownUntil(stored);
      setRemaining(Math.ceil((stored - now) / 1000));
      startTimer(stored);
    } else {
      setIsBlocked(false);
      setRemaining(0);
      persistCooldownUntil(0);
    }
    // restore violation count & last violation ts
    const storedCount = Number(localStorage.getItem(key_violation) || 0);
    if (storedCount) setViolationCount(storedCount);  
    const storedLast = Number(localStorage.getItem(key_lastViolation) || 0);
    if (storedLast) setLastViolationTs(storedLast);

    // developer mode key listener (Ctrl+Alt+D toggles)
    const keyHandler = (e) => {
      if (e.ctrlKey && e.altKey && (e.key === "d" || e.key === "D")) {
        setDevMode((v) => !v);
      }
    };
    window.addEventListener("keydown", keyHandler);

    return () => {
      stopTimer();
      window.removeEventListener("keydown", keyHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start a countdown interval that updates remaining seconds and unblocks when time passes
  const startTimer = (untilTs) => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      if (untilTs <= now) {
        stopTimer();
        setIsBlocked(false);
        setRemaining(0);
        persistCooldownUntil(0);
      } else {
        setRemaining(Math.ceil((untilTs - now) / 1000));
        setIsBlocked(true);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Helper: compute cooldown duration in seconds for a given violationCount (>=3)
  const getCooldownSecondsForCount = (count) => {
    const idx = Math.min(Math.max(count - 3, 0), cooldownSeq.length - 1);
    return cooldownSeq[idx];
  };

  // Allowed categories function
  const isAllowedMessage = (msgLower) => {
    if (!msgLower) return false;
    const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
    if (greetings.some(g => msgLower.includes(g))) return true;
    if (msgLower.includes("weather")) return true;
    if (msgLower.includes("cloth") || msgLower.includes("clothes") || msgLower.includes("outfit") || msgLower.includes("recommendation")) return true;
    if (msgLower.includes("issue") || msgLower.includes("problem") || msgLower.includes("bug") || msgLower.includes("error")) return true;
    if (msgLower.includes("app") && (msgLower.includes("problem") || msgLower.includes("issue"))) return true;
    if (msgLower.includes("question") || msgLower.includes("?")) return true;
    return false;
  };

  const secondsToHuman = (s) => {
    if (s <= 0) return "0s";
    if (s < 60) return `${s}s`;
    if (s < 3600) {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return sec === 0 ? `${m}m` : `${m}m ${sec}s`;
    }
    const h = Math.floor(s / 3600);
    const rem = s % 3600;
    const m = Math.floor(rem / 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  const formatTs = (ts) => {
    if (!ts) return "never";
    try {
      const d = new Date(Number(ts));
      return d.toLocaleString();
    } catch {
      return "unknown";
    }
  };

  const handleSend = () => {
    const raw = input;
    if (!raw || !raw.trim()) return;

    const now = Date.now();
    const storedUntil = Number(localStorage.getItem(key_cooldown) || cooldownUntil || 0);
    if (storedUntil && storedUntil > now) {
      const rem = Math.ceil((storedUntil - now) / 1000);
      setMessages(prev => [...prev, { sender: "user", text: raw }, { sender: "bot", text: `Chatbot locked. Please wait ${secondsToHuman(rem)} before trying again.` }]);
      setInput("");
      setIsBlocked(true);
      setRemaining(rem);
      startTimer(storedUntil);
      return;
    }

    const userMessage = raw.toLowerCase();
    setMessages(prev => [...prev, { sender: "user", text: raw }]);
    setInput("");

    setTimeout(() => {
      const allowed = isAllowedMessage(userMessage);

      if (allowed) {
        let botResponse = "";
        if (userMessage.includes("weather")) {
          botResponse = "You can update your profile here to see your desired place weather -- https://weather-reporter-new-latest-2.vercel.app/profile";
        } else if (userMessage.includes("cloth") || userMessage.includes("clothes") || userMessage.includes("outfit") || userMessage.includes("recommendation")) {
          botResponse = "I can suggest mystical outfits based on weather soon!";
        } else if (userMessage.includes("issue") || userMessage.includes("problem") || userMessage.includes("bug") || userMessage.includes("error") || (userMessage.includes("app") && (userMessage.includes("problem") || userMessage.includes("issue")))) {
          botResponse = "Please describe your issue or app problem in detail.";
        } else if (userMessage.includes("question") || userMessage.includes("?")) {
          botResponse = "I’ll try my best to answer your questions!";
        } else {
          botResponse = "Hello, Currently, I can chat, give mystical weather advice, and answer your questions!";
        }
        setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
        return;
      }

      // Not allowed -> unusual activity
      const prevCount = Number(localStorage.getItem(key_violation) || violationCount || 0);
      const newCount = prevCount + 1;
      persistViolationCount(newCount);

      const ts = Date.now();
      persistLastViolation(ts);

      if (newCount === 1) {
        setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Unusual activity detected on this account." }]);
        setTimeout(() => {
          alert("Please be careful! Do not use this chatbot for irrelevant things (allowed: weather, clothing recommendations, issues, app problems, questions). Continued misuse may cause restrictions.");
        }, 300);
      } else if (newCount === 2) {
        setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Unusual activity detected twice. Please stop using the chatbot for unrelated things." }]);
        setTimeout(() => {
          alert("Please be careful! Do not use this chatbot for irrelevant things (allowed: weather, clothing recommendations, issues, app problems, questions). Continued misuse may cause restrictions.");
        }, 300);
      } else {
        // newCount >= 3 => apply escalating cooldown
        const secs = getCooldownSecondsForCount(newCount);
        const untilTs = Date.now() + secs * 1000;
        persistCooldownUntil(untilTs);
        setIsBlocked(true);
        setRemaining(secs);
        startTimer(untilTs);

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: `⚠️ Repeated unusual activity detected. You are blocked for ${secondsToHuman(secs)}. This restriction will persist across refresh/login.` },
        ]);

        setTimeout(() => {
          alert(`You have been temporarily blocked for ${secondsToHuman(secs)} due to repeated unusual activity. Do not use the chatbot for unrelated things.`);
        }, 300);
      }
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Developer reset function (only exposed when devMode true)
  const devReset = () => {
    persistViolationCount(0);
    persistCooldownUntil(0);
    persistLastViolation(0);
    setIsBlocked(false);
    setRemaining(0);
    stopTimer();
    setMessages(prev => [...prev, { sender: "bot", text: "✅ Developer reset performed: violations and cooldown cleared." }]);
    // also clear general fallback keys if present
    try {
      localStorage.removeItem('chat_violation_count');
      localStorage.removeItem('chat_cooldown_until');
      localStorage.removeItem('chat_last_violation');
    } catch {}
  };

  // Generate floating circles data (for background)
  const circles = Array.from({ length: 30 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() > 0.5 ? 20 : 15,
    delay: `${Math.random() * 10}s`,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(135deg, #6bbcffff, #4a90e2ff)",
        color: "white",
        textAlign: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Floating circles */}
      <div className="floating-circles">
        {circles.map((circle, i) => (
          <div
            key={i}
            className="circle"
            style={{
              top: circle.top,
              left: circle.left,
              width: circle.size,
              height: circle.size,
              animationDelay: circle.delay,
            }}
          />
        ))}
      </div>

      {/* Top-right small indicator: violation count & last violation */}
      <div style={{
        position: "fixed",
        top: 12,
        right: 12,
        background: "rgba(0,0,0,0.45)",
        color: "white",
        padding: "8px 12px",
        borderRadius: 10,
        fontSize: "0.85em",
        zIndex: 2000,
        textAlign: "left",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
      }}>
        <div><strong>Violations:</strong> {violationCount}</div>
        <div style={{ marginTop: 6 }}><strong>Last:</strong> {formatTs(lastViolationTs)}</div>
        {devMode && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={devReset}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: "#28a745",
                color: "white",
                fontSize: "0.85em"
              }}
            >
              DEV RESET
            </button>
          </div>
        )}
      </div>

      <h1 style={{ fontSize: "3em", marginBottom: "15px", fontWeight: "bold", zIndex: 1 }}>
        Mystical Chatbot
      </h1>
      <p style={{ fontSize: "1.5em", marginBottom: "30px", fontStyle: "italic", zIndex: 1 }}>
        Your magical guide through conversations and weather mysteries
      </p>

      {/* Chat container */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: "20px",
          borderRadius: "15px",
          width: "90%",
          maxWidth: "500px",
          marginBottom: "50px",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  backgroundColor: msg.sender === "user" ? "#007bff" : "#6c757d",
                  color: "white",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* If blocked, show contact support link */}
        {isBlocked && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: "#fff700ff", marginBottom: 6 }}>
              Your account is temporarily blocked. Remaining: {secondsToHuman(remaining)}
            </div>
            <div>
              <a
                href="mailto:support@example.com?subject=Chatbot account blocked"
                style={{ color: "#ffd", textDecoration: "underline" }}
                onClick={(e) => { /* no-op, normal mailto */ }}
              >
                Contact Support
              </a>
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={input}
            placeholder={isBlocked ? `Blocked: wait ${secondsToHuman(remaining)}` : "Type your message..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBlocked}
            style={{
              flexGrow: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1em",
            }}
          />
          <button
            onClick={handleSend}
            disabled={isBlocked}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: isBlocked ? "gray" : "#2b00ff",
              color: "white",
              cursor: isBlocked ? "not-allowed" : "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        .floating-circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          animation: float 10s linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-200px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
