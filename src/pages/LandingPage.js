import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "40px",
          borderRadius: "15px",
          backgroundColor: "white",
          fontSize: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3em", marginBottom: "10px" }}>🌤️ MysticSkies</h1>
        <p style={{ fontSize: "1.2em", marginBottom: "20px", color: "#333" }}>
          Where the Weather Whispers Its Secrets
        </p>
        <p style={{ fontSize: "1em", marginBottom: "40px", color: "#555" }}>
          “Instant forecasts matched with outfit recommendations tailored to your location.”
        </p>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "12px 40px",
            fontSize: "1em",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
