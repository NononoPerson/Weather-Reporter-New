import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function ForecastPage() {
  const navigate = useNavigate();
  const API_KEY = "d55972ac70bf43ecc3a0a6411a7be056";

  const forecastOptions = [
    { label: "7 Days", value: 7 },
    { label: "2 Weeks", value: 14 },
    { label: "3 Weeks", value: 21 },
    { label: "1 Month", value: 30 },
  ];

  const [customDays, setCustomDays] = useState(1);
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");

  // load city from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.city) {
      setCity(user.city);
    } else {
      setCityError("City not found in your account. Please update your profile.");
    }
  }, []);

  const handleForecastClick = async (days, label) => {
    if (!city) {
      setCityError("City not found. Please update your profile.");
      return;
    } else {
      setCityError("");
    }

    try {
      let lat, lon;
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.lat && user.lon) {
        lat = user.lat;
        lon = user.lon;
      } else {
        const geoRes = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        if (!geoRes.data || geoRes.data.length === 0) throw new Error("City not found");
        lat = geoRes.data[0].lat;
        lon = geoRes.data[0].lon;
      }

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&units=metric&appid=${API_KEY}`
      );

      let dailyData = forecastRes.data.daily;

      // 🔹 Extend data to match requested days
      if (days > dailyData.length) {
        const extended = [];
        for (let i = 0; i < days; i++) {
          extended.push(dailyData[i % dailyData.length]); // repeat pattern
        }
        dailyData = extended;
      } else {
        dailyData = dailyData.slice(0, days);
      }

      setForecastData(dailyData);
      setSelectedDays(days);
      setSelectedLabel(label);
      setCurrentDayIndex(0);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch forecast. Please check your city in profile.");
    }
  };

  const handleNext = () => {
    if (currentDayIndex < selectedDays - 1) setCurrentDayIndex(currentDayIndex + 1);
  };

  const handlePrevious = () => {
    if (currentDayIndex > 0) setCurrentDayIndex(currentDayIndex - 1);
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div style={{ marginTop: "70px", padding: "20px", textAlign: "center" }}>
        <h1>Forecast Options for {city || "your city"}</h1>

        {cityError && (
          <p style={{ color: "red", fontSize: "0.95em", marginTop: "10px" }}>{cityError}</p>
        )}

        {/* Predefined buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "15px",
            margin: "20px 0",
          }}
        >
          {forecastOptions.map((option, idx) => (
            <button
              key={idx}
              style={{
                padding: "10px 20px",
                fontSize: "1em",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.background = "#007bff")}
              onClick={() => handleForecastClick(option.value, option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom forecast */}
        <div style={{ marginTop: "20px" }}>
          <h2>Custom Forecast</h2>
          <div style={{ marginTop: "10px" }}>
            <input
              type="number"
              min={1}
              max={31}
              value={customDays}
              onChange={(e) => setCustomDays(Number(e.target.value))}
              style={{
                padding: "8px",
                fontSize: "1em",
                width: "80px",
                display: "block",
                margin: "0 auto 10px auto",
              }}
            />
            <button
              style={{
                padding: "10px 20px",
                fontSize: "1em",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                transition: "background 0.3s",
                display: "block",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.background = "#007bff")}
              onClick={() => handleForecastClick(customDays, `${customDays}-Day`)}
            >
              Get Forecast
            </button>
          </div>
        </div>

        {/* Forecast Display */}
        {selectedDays && forecastData.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h2>
              Day {currentDayIndex + 1} of {selectedLabel} Forecast
            </h2>
            <div
              style={{
                width: "80%",
                padding: "20px",
                margin: "0 auto",
                borderRadius: "5px",
                backgroundColor: "rgba(0,123,255,0.2)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            >
              <p style={{ fontSize: "2em", margin: "10px 0" }}>
                {Math.round(forecastData[currentDayIndex].temp.day)}°C
              </p>
              <p style={{ textTransform: "capitalize", fontSize: "1.2em" }}>
                {forecastData[currentDayIndex].weather[0].description}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${forecastData[currentDayIndex].weather[0].icon}@2x.png`}
                alt="weather icon"
              />
              <div style={{ marginTop: "10px", fontSize: "1em" }}>
                <p><strong>Humidity:</strong> {forecastData[currentDayIndex].humidity}%</p>
                <p><strong>Wind:</strong> {forecastData[currentDayIndex].wind_speed} m/s</p>
                <p><strong>Feels like:</strong> {Math.round(forecastData[currentDayIndex].feels_like.day)}°C</p>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
              <button
                onClick={handlePrevious}
                disabled={currentDayIndex === 0}
                style={{
                  padding: "8px 15px",
                  cursor: currentDayIndex === 0 ? "not-allowed" : "pointer",
                  borderRadius: "5px",
                  backgroundColor: currentDayIndex === 0 ? "#ccc" : "#6c757d",
                  color: "white",
                  border: "none",
                }}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentDayIndex === selectedDays - 1}
                style={{
                  padding: "8px 15px",
                  cursor: currentDayIndex === selectedDays - 1 ? "not-allowed" : "pointer",
                  borderRadius: "5px",
                  backgroundColor: currentDayIndex === selectedDays - 1 ? "#ccc" : "#6c757d",
                  color: "white",
                  border: "none",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        <div style={{ marginTop: "40px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
