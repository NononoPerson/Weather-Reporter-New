import "../styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerificationPage() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    const storedCode = localStorage.getItem("verificationCode");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (parseInt(code) !== parseInt(storedCode)) {
      alert("Verification failed");
      return;
    }

    // Update password
    storedUser.password = newPassword;
    localStorage.setItem("user", JSON.stringify(storedUser));
    localStorage.removeItem("verificationCode");

    alert("Password updated successfully");
    navigate("/login");
  };

  return (
    <div className="login">
      <h1>Verification Page</h1>
      <input type="text" placeholder="Verification Code" value={code} onChange={e=>setCode(e.target.value)} required/>
      <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/>
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
