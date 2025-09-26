import "../styles.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout"; // Ensure Layout is imported for the ribbon

export default function ChatBotLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState(""); // message state
  const [loginError, setLoginError] = useState(""); // error message state
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (name === storedUser.name && password === storedUser.password) {
      setLoginMsg("Chatbot Login successful!");
      setLoginError("");
      setTimeout(() => navigate("/help"), 1500); // redirect after 1.5s to help
    } else {
      setLoginError("Invalid username or password");
      setLoginMsg("");
    }
  };

  return (
    <Layout>
      <div className="login" style={{ marginTop: "100px" }}>
        <h1>Chatbot Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* Success or Error messages */}
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

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </Layout>
  );
}
