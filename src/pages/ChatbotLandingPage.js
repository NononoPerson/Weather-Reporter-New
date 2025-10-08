import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function ChatBotLandingPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your Mystical Chatbot. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const MAX_MESSAGES = 250; // limit chat history

  const devReset = useCallback(() => {
    setMessages([{ sender: "bot", text: "Hello! I am your Mystical Chatbot. Ask me anything!" }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg].slice(-MAX_MESSAGES));
  };

  const handleSend = () => {
    const raw = input;
    if (!raw || !raw.trim()) return;

    // Handle /clearchat command
    if (raw.trim() === "/clearchat") {
      devReset();
      setInput("");
      return;
    }

    const userMessage = raw.toLowerCase();
    addMessage({ sender: "user", text: raw });
    setInput("");

    setTimeout(() => {
      // If the user asks about the bot's name, reply directly
      if (userMessage.includes("is your name")) {
        addMessage({ sender: "bot", text: "I am your Mystical Chatbot. Ask me anything!" });
        return;
      }

      // Otherwise, go to GPT API
      (async () => {
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: raw }],
            }),
          });
          const data = await res.json();
          const gptText = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
          addMessage({ sender: "bot", text: gptText });
        } catch (err) {
          console.error(err);
          addMessage({ sender: "bot", text: "Error connecting to GPT API." });
        }
      })();
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

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

      <h1 style={{ fontSize: "3em", marginBottom: "15px", fontWeight: "bold", zIndex: 1 }}>
        Mystical Chatbot
      </h1>
      <p style={{ fontSize: "1.5em", marginBottom: "30px", fontStyle: "italic", zIndex: 1 }}>
        Your magical guide through conversations and weather mysteries.
      </p>

      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: "20px",
          borderRadius: "15px",
          width: "90%",
          maxWidth: "500px",
          marginBottom: "90px", // leave space for fixed logout
          zIndex: 1,
          flexGrow: 1,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "8px" }}>
            <span style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: "15px",
              backgroundColor: msg.sender === "user" ? "#007bff" : "#6c757d",
              color: "white",
              maxWidth: "80%",
              wordBreak: "break-word",
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flexGrow: 1, padding: "10px", borderRadius: "10px", border: "none", fontSize: "1em" }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2b00ff",
              color: "white",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.target.style.background = "#2b00ff")}
          >
            Send
          </button>
        </div>
      </div>

      {/* Fixed Logout Button */}
      <button
        onClick={() => navigate("/logout")}
      
        style={{
          position: "fixed",
          bottom: "20px",
          width: "90%",
          maxWidth: "500px",
          padding: "10px 0",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#ff0000",
          color: "white",
          cursor: "pointer",
          fontSize: "1em",
          zIndex: 1000,
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#00bfffff";
              e.target.style.color = "white";
              e.target.style.borderColor = "#007bff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.color = "white";
              e.target.style.borderColor = "#007bff";
            }}
      >
        Logout
      </button>

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
