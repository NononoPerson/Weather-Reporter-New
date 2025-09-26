import React, { useState, useEffect } from "react";

export default function SecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    loginAlerts: false,
    passwordChangeReminder: true,
    trustedDevices: false,
    encryption: true
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const buttons = [
    { key: "twoFactorAuth", label: "Two Factor Auth" },
    { key: "loginAlerts", label: "Login Alerts" },
    { key: "passwordChangeReminder", label: "Password Change Reminder" },
    { key: "trustedDevices", label: "Trusted Devices" },
    { key: "encryption", label: "Encryption" }
  ];

  useEffect(() => {
    localStorage.setItem("security", JSON.stringify(settings));
  }, [settings]);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "100px auto",
        padding: "20px",
        backgroundColor: "#6bbcffff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h1>Security Settings</h1>
      {buttons.map((btn, idx) => (
        <div
          key={idx}
          onClick={() => toggleSetting(btn.key)}
          style={{
            padding: "12px 20px",
            margin: "10px 0",
            borderRadius: "8px",
            backgroundColor: settings[btn.key] ? "#147ffaff" : "rgba(83, 83, 83, 1)",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#000000ff"
          }}
        >
          {btn.label}
        </div>
      ))}
    </div>
  );
}
