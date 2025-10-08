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

  // ✅ Expanded Best Time Mapping
  const bestTimes = {
    // North India
    Delhi: "October – March (pleasant winter, avoid May–July heat, July–Sept rains).",
    Haryana: "October – March (pleasant winter, avoid May–July heat, July–Sept rains).",
    Punjab: "October – March (pleasant winter, avoid May–July heat, July–Sept rains).",
    "Uttar Pradesh": "October – March (pleasant winter, avoid May–July heat, July–Sept rains).",
    Rajasthan: "October – March (pleasant winter, avoid May–July heat, July–Sept rains).",

    "Himachal Pradesh": "March – June (cool, trekking, sightseeing). September – November (clear skies).",
    Uttarakhand: "March – June (cool, trekking, sightseeing). September – November (clear skies).",
    "Jammu & Kashmir": "Kashmir Valley → March – October (spring to autumn). Winter (Dec – Feb) → skiing in Gulmarg.",
    Ladakh: "June – September (roads open, adventure).",

    // West India
    Maharashtra: "October – February (cool & dry).",
    Mumbai: "October – February (cool & dry).",
    Pune: "October – February (cool & dry).",
    Nashik: "October – February (cool & dry).",
    Aurangabad: "October – February (cool & dry).",
    Nagpur: "October – February (cool & dry).",

    Goa: "November – February (beach weather, festivals).",
    Gujarat: "November – February (pleasant, ideal for Gir, Kutch Rann Utsav).",

    // South India
    Karnataka: "October – February.",
    Bengaluru: "October – February.",
    Mysuru: "October – February.",
    Hampi: "October – February.",
    Mangaluru: "October – February.",

    Kerala: "November – February (cool, dry, best for backwaters).",
    Kochi: "November – February (cool, dry, best for backwaters).",
    Munnar: "November – February (cool, dry, best for backwaters).",
    Alleppey: "November – February (cool, dry, best for backwaters).",
    Kovalam: "November – February (cool, dry, best for backwaters).",

    TamilNadu: "Plains (Chennai, Madurai) → Nov – Feb. Hill stations (Ooty, Kodaikanal) → Apr – Jun.",
    Chennai: "November – February (pleasant winter).",
    Madurai: "November – February (pleasant winter).",
    Ooty: "April – June (summer escape).",
    Kodaikanal: "April – June (summer escape).",

    Telangana: "October – February.",
    Hyderabad: "October – February.",
    Warangal: "October – February.",

    // East India
    "West Bengal": "October – March (pleasant in plains & Kolkata). March – May (hill stations like Darjeeling).",
    Kolkata: "October – March (pleasant in plains).",
    Darjeeling: "March – May (hill stations).",
    Sundarbans: "October – March (best time).",
    Digha: "October – March (pleasant for beaches).",

    Odisha: "October – February (avoid summer heat).",
    Bhubaneswar: "October – February.",
    Puri: "October – February.",
    Konark: "October – February.",
    Cuttack: "October – February.",

    Jharkhand: "October – March.",
    Ranchi: "October – March.",
    Jamshedpur: "October – March.",
    Dhanbad: "October – March.",

    Bihar: "October – March (winter pilgrimage season).",
    Patna: "October – March.",
    "Bodh Gaya": "October – March.",
    Nalanda: "October – March.",
    Rajgir: "October – March.",

    // North-East India
    Assam: "November – April (cool, Kaziranga open).",
    Guwahati: "November – April.",
    Kaziranga: "November – April.",
    Tezpur: "November – April.",
    Dibrugarh: "November – April.",

    "Arunachal Pradesh": "October – April (avoid heavy monsoon).",
    Itanagar: "October – April.",
    Tawang: "October – April.",
    Ziro: "October – April.",
    Pasighat: "October – April.",

    Meghalaya: "October – April (green & pleasant).",
    Shillong: "October – April.",
    Cherrapunji: "October – April.",
    Tura: "October – April.",

    Nagaland: "November – March (Hornbill Festival in Dec!).",
    Kohima: "November – March.",
    Dimapur: "November – March.",
    Mokokchung: "November – March.",

    Manipur: "October – March.",
    Imphal: "October – March.",
    "Loktak Lake": "October – March.",

    Mizoram: "October – March.",
    Aizawl: "October – March.",
    Lunglei: "October – March.",

    Tripura: "October – March.",
    Agartala: "October – March.",
    Udaipur: "October – March.",
    Kailashahar: "October – March.",

    Sikkim: "March – June (spring flowers), September – November (clear skies).",
    Gangtok: "March – June, Sept – Nov.",
    Pelling: "March – June, Sept – Nov.",
    Yumthang: "March – June, Sept – Nov.",
    Nathula: "March – June, Sept – Nov.",

    // Union Territories
    "Andaman & Nicobar": "November – April (beaches, diving).",
    "Port Blair": "November – April.",
    "Havelock": "November – April.",
    "Neil Island": "November – April.",

    Lakshadweep: "October – March (island weather).",
    Kavaratti: "October – March.",
    Minicoy: "October – March.",
    Agatti: "October – March.",

    Chandigarh: "October – March.",
    "Dadra & Nagar Haveli": "October – March.",
    "Daman & Diu": "October – March.",
    Puducherry: "October – February.",
    Pondicherry: "October – February.",
    Auroville: "October – February."
  };

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

  // Outfit recommendation logic
  const getOutfitRecommendation = (temp, condition) => {
    if (temp < 10) return "Wear a heavy jacket, sweater, and warm boots 🧥🧤";
    if (temp >= 10 && temp < 20) return "A light jacket or sweater with jeans is perfect 🧥👖";
    if (temp >= 20 && temp < 30) return "T-shirt and jeans/shorts should be fine 👕🩳";
    if (temp >= 30) return "Stay cool with light cotton clothes and sunglasses 😎👕";

    if (condition.includes("rain")) return "Don't forget an umbrella or raincoat ☔";
    if (condition.includes("cloud")) return "A light hoodie or casual outfit 👕☁️";
    if (condition.includes("clear")) return "Enjoy the sun! Sunglasses recommended 🕶️";

    return "Dress comfortably based on your preference.";
  };

  if (!weather && !error)
    return <p style={{ color: "black" }}>Loading weather for {city}...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <div
        style={{
          backgroundColor: "rgba(0,123,255,0.2)",
          borderRadius: "15px",
          padding: "20px",
          width: "350px",
          margin: "20px auto 70px",
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
            <strong>Clouds:</strong>
            <p>{weather.clouds.all}%</p>
          </div>
        </div>

        <div style={{ marginTop: "20px", fontSize: "0.9em" }}>
          <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
        </div>

        {/* Outfit Recommendation */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "1em",
            fontWeight: "bold",
            color: "black"
          }}
        >
          <p>
            Outfit Recommendation:{" "}
            {getOutfitRecommendation(
              weather.main.temp,
              weather.weather[0].description.toLowerCase()
            )}
          </p>
        </div>

        {/* Best Time to Visit */}
        {bestTimes[city] && (
          <div
            style={{
              marginTop: "15px",
              fontSize: "0.95em",
              color: "black",
              fontWeight: "600"
            }}
          >
            🌍 Best Time to Visit {city}: {bestTimes[city]}
          </div>
        )}
      </div>
    </div>
  );
}
