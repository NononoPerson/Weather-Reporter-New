import "../styles.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";

export default function ChatBotSignup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [signupMsg, setSignupMsg] = useState("");
  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !password || !dob) {
      setSignupError("All fields are required");
      setSignupMsg("");
      return;
    }

    // Save user data in localStorage
    const userData = { name, password, dob };
    localStorage.setItem("user", JSON.stringify(userData));

    setSignupMsg("Signup successful!");
    setSignupError("");
    setTimeout(() => navigate("/chatbot-login"), 1500); // Redirect to login after signup
  };

  return (
    <Layout>
      {/* Center the box vertically */}
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
        {/* Container box */}
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
          <h1 style={{ marginBottom: "20px" }}>Chatbot Signup</h1>

          <form
            onSubmit={handleSignup}
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
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1em",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
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
                cursor: "pointer",
              }}
            >
              Signup
            </button>
          </form>

          {/* Success or Error messages */}
          {signupMsg && (
            <p style={{ color: "green", fontSize: "0.95em", marginTop: "10px" }}>
              {signupMsg}
            </p>
          )}
          {signupError && (
            <p style={{ color: "red", fontSize: "0.95em", marginTop: "10px" }}>
              {signupError}
            </p>
          )}

          <p style={{ marginTop: "15px" }}>
            Already have an account? <Link to="/chatbot-login">Login</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
