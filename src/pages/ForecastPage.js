import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function ForecastPage() {
  const navigate = useNavigate();
  const API_KEY = "d55972ac70bf43ecc3a0a6411a7be056";

  const forecastOptions = [
    { label: "Tomorrow", value: 1 },
    { label: "3 Days", value: 3 },
    { label: "4 Days", value: 4 },
    { label: "5 Days", value: 5 },
  ];

  const [customDays, setCustomDays] = useState(1);
  const [selectedDays, setSelectedDays] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [limitError, setLimitError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.city && user.city.trim() !== "") {
      setCity(user.city);
      setCityError("");
    } else {
      setCityError("City not found in your account. Please update your profile.");
    }
  }, []);

  // Unified function to fetch forecast and scroll
  const handleForecastClick = async (days, label) => {
    if (!city || city.trim() === "") {
      setCityError("City not found. Please update your profile.");
      return;
    } else {
      setCityError("");
    }

    if (days > 5) {
      setForecastData([]);
      setSelectedDays(null);
      setLimitError(" OpenWeather free API only supports up to 5-day forecast.");
      return;
    }

    try {
      let lat, lon;
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.data || geoRes.data.length === 0) throw new Error("City not found");
      lat = geoRes.data[0].lat;
      lon = geoRes.data[0].lon;

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      const byDay = [];
      for (let i = 0; i < forecastRes.data.list.length; i += 8) {
        byDay.push(forecastRes.data.list[i]);
      }

      const dailyData = byDay.slice(0, days).map((d) => ({
        temp: { day: d.main.temp },
        feels_like: { day: d.main.feels_like },
        humidity: d.main.humidity,
        wind_speed: d.wind.speed,
        weather: d.weather,
      }));

      setForecastData(dailyData);
      setSelectedDays(days);
      setSelectedLabel(label);
      setCurrentDayIndex(0);
      setLimitError("");

      // Scroll to bottom after data is set
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setCityError("Could not fetch forecast. Try another city.");
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
      {/* Ribbon */}
      <div style={{ marginTop: "100px", padding: "20px", textAlign: "center" }}>
        <h1>Forecast Options for {city || "your city"}</h1>

        {cityError && (
          <div
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              fontWeight: "bold",
              margin: "10px auto",
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚠️ {cityError}
          </div>
        )}
        {limitError && (
          <div
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              fontWeight: "bold",
              margin: "10px auto",
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚠️ {limitError}
          </div>
        )}
      </div>

      {/* All content pushed down */}
      <div style={{ marginTop: "10px", padding: "20px", textAlign: "center" }}>
        {/* Predefined buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "15px",
            margin: "0px 0",
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
              max={5}
              value={customDays}
              onChange={(e) => setCustomDays(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleForecastClick(customDays, `${customDays}-Day`);
              }}
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

        {/* Single-day forecast display */}
        {selectedDays && forecastData.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h2>
              {selectedDays === 1
                ? "Tomorrow's Forecast"
                : `Day ${currentDayIndex + 1} of ${selectedLabel} Forecast`}
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
                <p>
                  <strong>Humidity:</strong> {forecastData[currentDayIndex].humidity}%
                </p>
                <p>
                  <strong>Wind:</strong> {forecastData[currentDayIndex].wind_speed} m/s
                </p>
                <p>
                  <strong>Feels like:</strong>{" "}
                  {Math.round(forecastData[currentDayIndex].feels_like.day)}°C
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
              <button
                onClick={handlePrevious}
                disabled={currentDayIndex === 0}
                style={{
                  padding: "8px 15px",
                  cursor: currentDayIndex === 0 ? "not-allowed" : "pointer",
                  borderRadius: "5px",
                  backgroundColor: currentDayIndex === 0 ? "#6c757d" : "#0008ffff",
                  color: "white",
                  border: "none",
                }}
              >
                ⬅️Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentDayIndex === selectedDays - 1}
                style={{
                  padding: "8px 15px",
                  cursor: currentDayIndex === selectedDays - 1 ? "not-allowed" : "pointer",
                  borderRadius: "5px",
                  backgroundColor: currentDayIndex === selectedDays - 1 ? "#6c757d" : "#0008ffff",
                  color: "white",
                  border: "none",
                }}
              >
                Next➡️
              </button>
            </div>
          </div>
        )}

        {/* Back button */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#0008ffff",
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
