import "../styles.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";

export default function ChatBotLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // email state
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loginError, setLoginError] = useState("");
  const [cooldown, setCooldown] = useState(0); // lockout timer
  const [attempts, setAttempts] = useState(0); // wrong attempts counter
  const [totalBlockedTime, setTotalBlockedTime] = useState(0); // total blocked time
  const cooldownRef = useRef(null);
  const navigate = useNavigate();

  // Progressive lock times in seconds (1st wrong = no lock)
  const lockTimes = [0, 30, 60, 120, 300, 600]; // index = attempt count

  // Pre-fill name and email from localStorage if user exists
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.name) setName(storedUser.name);
    if (storedUser.email) setEmail(storedUser.email);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownRef.current);
  }, [cooldown]);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (cooldown > 0) {
      setLoginError(`⏳ Account locked. Please wait ${cooldown} seconds.`);
      setLoginMsg("");
      return;
    }

    if (attempts >= 6) {
      setLoginError("🚫 Account temporarily blocked for 10 minutes due to multiple failed attempts.");
      setLoginMsg("");
      setCooldown(600);
      return;
    }

    if ((name === storedUser.name || email === storedUser.email) && password === storedUser.password) {
      let totalMinutes = Math.floor(totalBlockedTime / 60);
      let totalSeconds = totalBlockedTime % 60;
      let warningMsg = "";
      if (attempts > 0) {
        warningMsg = `⚠️ Someone tried to log in to your account for ${totalMinutes} minutes and ${totalSeconds} seconds.`;
      }
      setLoginMsg(`Login successful! ${warningMsg}`);
      setLoginError("");
      setAttempts(0);
      setTotalBlockedTime(0);
      navigate("/chatbot-landing");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const newCooldown = lockTimes[newAttempts] || 600;

    if (newCooldown > 0) {
      setCooldown(newCooldown);
      setTotalBlockedTime(prev => prev + newCooldown);
    }

    setLoginError(
      `❌ Invalid username/email or password${newCooldown > 0 ? `. Account locked for ${newCooldown} seconds.` : ""}`
    );
    setLoginMsg("");
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 350px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 1)",
            padding: "40px 50px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "300px",
            maxWidth: "400px",
            width: "90%",
            marginBottom: "100px",
          }}
        >
          <h1 style={{ marginBottom: "20px" }}>Chatbot Login</h1>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1em",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              disabled={cooldown > 0}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1em",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              disabled={cooldown > 0}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1em",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              disabled={cooldown > 0}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1em",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#007bff",
                color: "white",
                cursor: cooldown > 0 ? "not-allowed" : "pointer",
              }}
              disabled={cooldown > 0}
            >
              Login
            </button>
          </form>

          {loginMsg && (
            <p style={{ color: "green", fontSize: "0.95em", marginTop: "10px" }}>
              {loginMsg}
            </p>
          )}
          {loginError && (
            <p style={{ color: "red", fontSize: "0.95em", marginTop: "10px" }}>
              {loginError}
            </p>
          )}

          <p style={{ marginTop: "15px" }}>
            Don't have an account? <Link to="/chatbot-signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
