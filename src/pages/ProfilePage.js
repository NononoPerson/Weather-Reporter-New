import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

export default function ProfilePage({ setUserTrigger }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Load existing user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setCity(user.city || "");
      setStateName(user.state || "");
      setDistrict(user.district || "");
      setCountry(user.country || "");
      setProfileImage(user.profileImage || null);
    }
  }, []);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setProfileImage(imageSrc);
      setShowCamera(false); // close camera overlay
    }
  };

  const handleUpdateProfile = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return;
    }

    const updatedUser = { email, name, city, state: stateName, district, country, profileImage };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Trigger weather refresh
    if (setUserTrigger) setUserTrigger(prev => prev + 1);

    alert("Profile updated successfully!");
    navigate("/weather"); // redirect to weather page
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "100px auto",
        padding: "30px",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        textAlign: "center",
      }}
    >
      {/* Profile picture circle */}
      <div
        onClick={() => setShowCamera(true)}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          margin: "0 auto 15px",
          cursor: "pointer",
          border: "3px solid #fff",
          backgroundImage: profileImage ? `url(${profileImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2em",
          color: "white",
        }}
      >
        {!profileImage && "📷"}
      </div>

      {/* Camera overlay modal */}
      {showCamera && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "10px",
            }}
          />
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={captureImage}
              style={{
                padding: "12px 20px",
                fontSize: "1em",
                borderRadius: "8px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Capture
            </button>
            <button
              onClick={() => setShowCamera(false)}
              style={{
                padding: "12px 20px",
                fontSize: "1em",
                borderRadius: "8px",
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: "10px" }}>Your Account</h2>
      <p style={{ marginBottom: "30px", color: "#555" }}>
        Update your profile information below.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", fontSize: "1em", borderRadius: "5px" }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", fontSize: "1em", borderRadius: "5px" }}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ padding: "10px", fontSize: "1em", borderRadius: "5px" }}
        />
        <input
          type="text"
          placeholder="State"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          style={{ padding: "10px", fontSize: "1em", borderRadius: "5px" }}
        />
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          style={{ padding: "10px", fontSize: "1em", borderRadius: "5px" }}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: "10px", fontSize: "1em", borderRadius: "5px" }}
        />

        <button
          onClick={handleUpdateProfile}
          style={{
            padding: "12px",
            fontSize: "1em",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.background = "#007bff")}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
