import React, { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    searchEngineIndexing: false,
    dataSharing: true,
    locationTracking: false,
    activityStatus: true
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const buttons = [
    { key: "profileVisibility", label: "Profile Visibility" },
    { key: "searchEngineIndexing", label: "Search Engine Indexing" },
    { key: "dataSharing", label: "Data Sharing" },
    { key: "locationTracking", label: "Location Tracking" },
    { key: "activityStatus", label: "Activity Status" }
  ];

  useEffect(() => {
    localStorage.setItem("privacy", JSON.stringify(settings));
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
      <h1>Privacy Settings</h1>
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
