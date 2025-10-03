// LogoutPage.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page after 2 seconds
    const timer = setTimeout(() => {
      navigate("/landingPage");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6bbcffff, #4a90e2ff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
        textAlign: "center",
        borderRadius: "15px",
        width: "auto",
        height: "auto",
        padding: "60px 80px", // <-- increased padding to make the box bigger
      }}
    >
      <h1 style={{ fontSize: "2em", marginBottom: "20px" }}>
        You have been logged out
      </h1>
      <p style={{ fontSize: "1em", marginBottom: "40px" }}>
        Redirecting to the homepage...
      </p>

      {/* Spinner */}
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid white",
          borderTop: "5px solid transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
