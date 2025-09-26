import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const WeatherDashboard = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const API_KEY = "d55972ac70bf43ecc3a0a6411a7be056";

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (err) {
        console.error(err);
        setWeather(null); // reset if city invalid
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather,60 * 1000); // refresh every 1 min
    return () => clearInterval(interval);
  }, [city]);

  if (!weather) return <p style={{ color: "black" }}>Loading weather for {city || "your city"}...</p>;

  return (
    <div
      style={{
        backgroundColor: "rgba(199, 241, 255, 1)",
        borderRadius: "15px",
        padding: "20px",
        width: "350px",
        margin: "20px auto",
        textAlign: "center",
        color: "black",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}
    >
      <h2>{weather.name}</h2>
      <p style={{ fontSize: "2.5em", margin: "10px 0" }}>
        {Math.round(weather.main.temp)}°C
      </p>
      <p style={{ textTransform: "capitalize" }}>
        {weather.weather[0].description}
      </p>

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
          <strong>UV Index:</strong>
          <p>{weather.clouds.all}</p> {/* Placeholder for UV */}
        </div>
      </div>

      <div style={{ marginTop: "20px", fontSize: "0.9em" }}>
        <p>Precipitation: 0%</p>
        <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
      </div>

      <div
        style={{
          marginTop: "20px",
          height: "60px",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          padding: "0 5px"
        }}
      >
        {[31, 29, 28, 26, 29, 34, 36, 33].map((temp, idx) => (
          <div
            key={idx}
            style={{
              width: "10px",
              height: `${temp}px`,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "3px"
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard;
