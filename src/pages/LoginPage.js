import "../styles.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import emailjs from "emailjs-com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!validateEmail(email)) { alert("Invalid email"); return; }
    if (email === storedUser.email && password === storedUser.password) {
      alert("Login successful");
      navigate("/weather");
      return;
    }
    alert("Invalid email or password");
  };

  const handleForgot = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (email !== storedUser.email) {
      alert("Email not registered");
      return;
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("verificationCode", code); // temporary storage

    const templateParams = {
      to_name: storedUser.email,
      code: String(code),
    };

    try {
      await emailjs.send("service_maibj9f", "template_aplrjgd", templateParams);
      alert("Verification code sent to your registered email");
      navigate("/verification-page");
    } catch (err) {
      alert("Failed to send verification code");
      console.error("EmailJS Error:", err);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>
        <button onClick={handleForgot}>Forgot Password?</button>
      </p>

      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}
