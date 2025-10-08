import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ChatBotLogin from "./pages/ChatBotLogin";
import ChatBotSignup from "./pages/ChatBotSignup";
import ChatBotLandingPage from "./pages/ChatbotLandingPage";
import WeatherPage from "./pages/WeatherPage";
import ForecastPage from "./pages/ForecastPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AccountPage from "./pages/AccountPage";
import NotificationPage from "./pages/NotificationPage";
import PrivacyPage from "./pages/PrivacyPage";
import SecurityPage from "./pages/SecurityPage";
import PreferencesPage from "./pages/PreferencesPage";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import { useState } from "react";
import LogoutPage from "./pages/LogoutPage";
import QuizDifficulty from "./pages/QuizDifficulty";
import QuizCards from "./pages/QuizCards";
import VerificationPage from "./pages/VerificationPage"; // NEW

function App() {
  const [userTrigger, setUserTrigger] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Landing Page without ribbon */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages without ribbon */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verification-page" element={<VerificationPage />} /> {/* NEW */}
        <Route path="/chatbot-landing" element={<ChatBotLandingPage />} />
        <Route path="/chatbot-signup" element={<ChatBotSignup />} />

        {/* Chatbot Login WITH ribbon */}
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

        {/* Quiz routes */}
        <Route
          path="/quiz-difficulty"
          element={
            <Layout>
              <QuizDifficulty />
            </Layout>
          }
        />
        <Route
          path="/quiz-cards"
          element={
            <Layout>
              <QuizCards />
            </Layout>
          }
        />

        {/* Logout page without ribbon */}
        <Route path="/logout" element={<LogoutPage />} />

        {/* Default fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
