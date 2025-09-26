import React, { useState, useEffect } from "react";

export default function AccountPage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [activeButton, setActiveButton] = useState(null);

  const handleAction = (action) => {
    setActiveButton(action);
    const updatedUser = { ...user };

    switch (action) {
      case "Update Name":
        const newName = prompt("Enter new name:", user.name || "");
        if (newName) updatedUser.name = newName;
        break;
      case "Update Email":
        const newEmail = prompt("Enter new email:", user.email || "");
        if (newEmail) updatedUser.email = newEmail;
        break;
      case "Update City":
        const newCity = prompt("Enter new city:", user.city || "");
        if (newCity) updatedUser.city = newCity;
        break;
      case "Change Password":
        const newPassword = prompt("Enter new password:");
        if (newPassword) updatedUser.password = newPassword;
        break;
      case "Delete Account":
        if (window.confirm("Are you sure you want to delete your account?")) {
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
        break;
      default:
        break;
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setTimeout(() => setActiveButton(null), 1000);
  };

  const buttons = ["Update Name", "Update Email", "Update City", "Change Password", "Delete Account"];

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
      <h1>Account Settings</h1>
      {buttons.map((btn, idx) => (
        <div
          key={idx}
          onClick={() => handleAction(btn)}
          style={{
            padding: "12px 20px",
            margin: "10px 0",
            borderRadius: "8px",
            backgroundColor: activeButton === btn ? "#147ffaff" : "rgba(83, 83, 83, 1)",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#000000ff"
          }}
        >
          {btn}
        </div>
      ))}
    </div>
  );
}
