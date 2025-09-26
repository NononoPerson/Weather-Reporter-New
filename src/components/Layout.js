import React from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const ribbonOptions = ["Home", "Forecast", "Settings", "Profile", "Help"];

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Ribbon with top heading and navigation buttons */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          backgroundColor: "#007bff",
          color: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        {/* Top line: mystical heading */}
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5em",
            fontWeight: "bold",
            padding: "8px 0",
          }}
        >
          ⛅ MysticSkies - Where the Weather Whispers Its Secrets
        </div>

        {/* Second line: navigation buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            padding: "10px 0",
          }}
        >
          {ribbonOptions.map((option, idx) => (
            <button
              key={idx}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1.1em",
                padding: "6px 20px",
                borderRadius: "8px",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
              onClick={() => {
                if (option === "Home") navigate("/weather");
                else if (option === "Forecast") navigate("/forecast");
                else if (option === "Settings") navigate("/settings");
                else if (option === "Profile") navigate("/profile");
                else if (option === "Help") navigate("/help");
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Push content below the ribbon */}
      <div style={{ marginTop: "90px" }}>{children}</div>
    </div>
  );
}
