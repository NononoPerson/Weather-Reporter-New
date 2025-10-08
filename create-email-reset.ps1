# create-email-reset.ps1
# Run this in the root of your project (where package.json normally lives).
# It will create server.js, src/pages/LoginPage.js, src/pages/VerificationPage.js and .env.example.
# It will also init npm if necessary and install server dependencies.

# Helper: write file with UTF8
function Write-UTF8File($Path, $Content) {
    $dir = Split-Path $Path -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $Content | Out-File -FilePath $Path -Encoding utf8 -Force
}

Write-Host "Creating server and frontend page files..."

# 1) server.js
$server = @'
/**
 * server.js
 * Simple Express server to send verification emails and verify codes.
 * Uses environment variables:
 *   EMAIL_USER - sending email (Gmail or SMTP)
 *   EMAIL_PASS - app password or SMTP password
 *
 * Endpoints:
 *  POST /send-code    { email }
 *  POST /verify-code  { code }
 *
 * NOTE: verification codes are stored in memory (verificationCodes object).
 *       For production use persistent storage and stronger security.
 */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory storage for verification codes: { email: { code, expiresAt } }
const verificationCodes = {};

// nodemailer transporter (example using Gmail)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility: generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /send-code
// Body: { email }
// Sends a 6-digit code to the email if provided.
app.post("/send-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const code = generateCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // code valid 5 minutes
    verificationCodes[email] = { code, expiresAt };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}\nThis code expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Sent code to:", email, "code:", code);
    return res.json({ success: true, message: "Code sent" });
  } catch (err) {
    console.error("Error in /send-code:", err);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// POST /verify-code
// Body: { email, code }
// Verifies code, responds success: true if valid; removes code after successful verify.
app.post("/verify-code", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: "Email and code required" });

    const entry = verificationCodes[email];
    if (!entry) return res.status(400).json({ success: false, message: "No code requested for this email" });

    // Check expiry
    if (Date.now() > entry.expiresAt) {
      delete verificationCodes[email];
      return res.status(400).json({ success: false, message: "Code expired" });
    }

    if (entry.code !== String(code)) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // success: remove stored code
    delete verificationCodes[email];
    return res.json({ success: true, message: "Verification successful" });
  } catch (err) {
    console.error("Error in /verify-code:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log("Ensure you have .env with EMAIL_USER and EMAIL_PASS set.");
});
'@

Write-UTF8File -Path ".\server.js" -Content $server
Write-Host "Wrote server.js"

# 2) src/pages/LoginPage.js
$loginPage = @'
import "../styles.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loginError, setLoginError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalBlockedTime, setTotalBlockedTime] = useState(0);
  const cooldownRef = useRef(null);
  const navigate = useNavigate();

  // Progressive lock times
  const lockTimes = [0, 30, 60, 120, 300, 600];

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

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

    if (!validateEmail(email)) {
      setLoginError("❌ Invalid email format.");
      setLoginMsg("");
      return;
    }

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

    if (email === storedUser.email && password === storedUser.password) {
      let totalMinutes = Math.floor(totalBlockedTime / 60);
      let totalSeconds = totalBlockedTime % 60;
      let warningMsg = attempts > 0 ? `⚠️ Someone tried to log in to your account for ${totalMinutes} minutes and ${totalSeconds} seconds.` : "";
      setLoginMsg(`Login successful! ${warningMsg}`);
      setLoginError("");
      setAttempts(0);
      setTotalBlockedTime(0);
      setTimeout(() => navigate("/weather"), 500);
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
      `❌ Invalid email or password${newCooldown > 0 ? `. Account locked for ${newCooldown} seconds.` : ""}`
    );
    setLoginMsg("");
  };

  // Forgot Password: check localStorage for registered email, then ask backend to send code
  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email to reset password.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser.email || storedUser.email !== email) {
      alert("Email not registered.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        alert("A verification code has been sent to your registered email.");
        navigate("/verification-page");
      } else {
        alert("Failed to send verification code: " + (data.message || "unknown error"));
      }
    } catch (err) {
      console.error("Error sending code:", err);
      alert("Server error while sending verification code.");
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
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={cooldown > 0}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={cooldown > 0}
        />
        <p
          style={{ textAlign: "right", margin: "6px 0", cursor: "pointer", color: "#007bff" }}
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
        <button type="submit" disabled={cooldown > 0}>Login</button>
      </form>

      {loginMsg && <p style={{ color: "green", fontSize: "0.95em", marginTop: "10px" }}>{loginMsg}</p>}
      {loginError && <p style={{ color: "red", fontSize: "0.95em", marginTop: "10px" }}>{loginError}</p>}

      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}
'@

Write-UTF8File -Path ".\src\pages\LoginPage.js" -Content $loginPage
Write-Host "Wrote src/pages/LoginPage.js"

# 3) src/pages/VerificationPage.js
$verificationPage = @'
import "../styles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VerificationPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Attempt to get the registered email from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const email = storedUser.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setMessage("Please fill both code and new password.");
      return;
    }
    if (!email) {
      setMessage("Registered email not found in localStorage.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (data.success) {
        // Update password in localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.email === email) {
          user.password = newPassword;
          localStorage.setItem("user", JSON.stringify(user));
          alert("Password updated successfully. Please login with new password.");
          navigate("/login");
        } else {
          setMessage("Local user email mismatch.");
        }
      } else {
        setMessage(data.message || "Verification failed.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setMessage("Server error while verifying code.");
    }
  };

  return (
    <div className="login">
      <h1>Verification Page</h1>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
'@

Write-UTF8File -Path ".\src\pages\VerificationPage.js" -Content $verificationPage
Write-Host "Wrote src/pages/VerificationPage.js"

# 4) .env.example
$envExample = @"
# .env.example
# Copy to .env and fill with your email credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
# Optional: EMAIL_SERVICE (defaults to gmail)
# EMAIL_SERVICE=gmail
"@

Write-UTF8File -Path ".\.env.example" -Content $envExample
Write-Host "Wrote .env.example"

# 5) npm init if necessary and install node dependencies
if (!(Test-Path .\package.json)) {
    Write-Host "No package.json found. Initializing npm..."
    npm init -y | Out-Null
} else {
    Write-Host "package.json found, skipping npm init."
}

Write-Host "Installing server dependencies: express, nodemailer, cors, body-parser, dotenv..."
npm install express nodemailer cors body-parser dotenv | Out-Null
Write-Host "Dependencies installed."

Write-Host ""
Write-Host "DONE."
Write-Host " - Edit .env (or set env vars) with your EMAIL_USER and EMAIL_PASS."
Write-Host " - Start server with: node server.js"
Write-Host " - Run your React app separately (npm start in your client project)."
