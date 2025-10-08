import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuizDifficulty() {
  const navigate = useNavigate();

  const difficulties = ["Easy", "Medium", "Hard", "Impossible"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "2.5em", textAlign: "center" }}>
        Select Quiz Difficulty - 4 modes available
      </h1>
<h1 style={{ marginBottom: "50px", fontSize: "2.0em", textAlign: "center" }}>
        (Mostly Weather Trivia Questions and clothing recommendations based on weather.)
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "center" }}>
        {difficulties.map((level) => (
          <button
            key={level}
            onClick={() => {
              // Navigate to QuizCards.js and pass the difficulty as state
              navigate("/quiz-cards", { state: { difficulty: level } });
            }}
            style={{
              padding: "20px 50px",
              fontSize: "1.4em",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "2px solid #007bff",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
              minWidth: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#007bff";
              e.target.style.borderColor = "#007bff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.color = "white";
              e.target.style.borderColor = "#007bff";
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
