import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function WeatherPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const city = user.city || "Hyderabad"; // default fallback
  const countryCode = "IN"; // force India for OpenWeatherMap

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const API_KEY = "d55972ac70bf43ecc3a0a6411a7be056";

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setWeather(null);
        setError(`Could not fetch weather for "${city}". Try another city.`);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  if (!weather && !error)
    return <p style={{ color: "black" }}>Loading weather for {city}...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Removed ribbon here */}

      <div
        style={{
          backgroundColor: "rgba(0,123,255,0.2)",
          borderRadius: "15px",
          padding: "20px",
          width: "350px",
          margin: "100px auto 20px",
          textAlign: "center",
          color: "black",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >
        <h1>Welcome, {user.name || "User"}!</h1>
        <h2>{weather.name}</h2>
        <p style={{ fontSize: "2.5em", margin: "10px 0" }}>
          {Math.round(weather.main.temp)}°C
        </p>
        <p style={{ textTransform: "capitalize" }}>{weather.weather[0].description}</p>

        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px" }}>
          <div>
            <strong>Humidity:</strong>
            <p>{weather.main.humidity}%</p>
          </div>
          <div>
            <strong>Wind:</strong>
            <p>{weather.wind.speed} m/s</p>
          </div>
          <div>
            <strong>Clouds:</strong>
            <p>{weather.clouds.all}%</p>
          </div>
        </div>

        <div style={{ marginTop: "20px", fontSize: "0.9em" }}>
          <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
        </div>
      </div>
    </div>
  );
}
