import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ChatBotLogin from "./pages/ChatBotLogin";
import WeatherPage from "./pages/WeatherPage";
import ForecastPage from "./pages/ForecastPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AccountPage from "./pages/AccountPage";
import NotificationPage from "./pages/NotificationPage";
import PrivacyPage from "./pages/PrivacyPage";
import SecurityPage from "./pages/SecurityPage";
import PreferencesPage from "./pages/PreferencesPage";
import LandingPage from "./pages/LandingPage"; // ✅ added LandingPage
import Layout from "./components/Layout";
import { useState } from "react";

function App() {
  const [userTrigger, setUserTrigger] = useState(0); // trigger for weather/profile refresh

  return (
    <Router>
      <Routes>
        {/* Landing Page without ribbon */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages without ribbon */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Chatbot Login with ribbon */}
        <Route
          path="/chatbot-login"
          element={
            <Layout>
              <ChatBotLogin />
            </Layout>
          }
        />

        {/* Pages with ribbon */}
        <Route
          path="/weather"
          element={
            <Layout>
              <WeatherPage userTrigger={userTrigger} />
            </Layout>
          }
        />
        <Route
          path="/forecast"
          element={
            <Layout>
              <ForecastPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage setUserTrigger={setUserTrigger} />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <SettingsPage />
            </Layout>
          }
        />

        {/* Individual settings pages */}
        <Route
          path="/account"
          element={
            <Layout>
              <AccountPage />
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout>
              <NotificationPage />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPage />
            </Layout>
          }
        />
        <Route
          path="/security"
          element={
            <Layout>
              <SecurityPage />
            </Layout>
          }
        />
        <Route
          path="/preferences"
          element={
            <Layout>
              <PreferencesPage />
            </Layout>
          }
        />

        {/* Default fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
