// src/pages/SettingsPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const settingsOptions = [
    { name: "Account", path: "/account" },
    { name: "Notifications", path: "/notifications" },
    { name: "Privacy", path: "/privacy" },
    { name: "Security", path: "/security" },
    { name: "Preferences", path: "/preferences" }
  ];

  const handleSave = () => {
    alert("Settings have been updated!");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "500px auto",
        padding: "20px",
        backgroundColor: "#6bbcffff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h1 style={{ marginBottom: "15px" }}>Settings</h1>
      <p style={{ marginBottom: "20px", fontSize: "1.05em", color: "#000000ff" }}>
        Change your account preferences here.
      </p>

      {settingsOptions.map((option, idx) => (
        <div
          key={idx}
          onClick={() => navigate(option.path)}
          style={{
            padding: "12px 20px",
            margin: "10px 0",
            borderRadius: "8px",
            backgroundColor: "rgba(83, 83, 83, 1)",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#000000ff"
          }}
        >
          {option.name}
        </div>
      ))}

      {/* Save Settings Button */}
      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#147ffaff",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Save Settings
      </button>
    </div>
  );
}
