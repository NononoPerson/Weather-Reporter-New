// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Route to send verification code
app.post("/send-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ success: false, message: "Email and code required" });

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    };

    await sgMail.send(msg);
    console.log("✅ Sent code to:", email);

    res.json({ success: true, message: "Verification code sent" });
  } catch (err) {
    console.error("❌ SendGrid error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
