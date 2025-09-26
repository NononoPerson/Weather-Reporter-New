# --- CONFIG ---
$WebsitePath = "C:\Users\chira\OneDrive\Desktop\weather-stylist-app"
$MainPage = "$WebsitePath\src\pages\WeatherPage.js"

# --- INLINE WEATHER DASHBOARD COMPONENT ---
$WeatherComponent = @"
const WeatherDashboard = () => {
  const [weather, setWeather] = React.useState(null);
  const API_KEY = 'd55972ac70bf43ecc3a0a6411a7be056';
  const CITY = 'Delhi';

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weather) return <p style={{ color: 'white' }}>Loading weather...</p>;

  return (
    <div style={{
      backgroundColor: 'rgba(0,123,255,0.2)',
      borderRadius: '10px',
      padding: '20px',
      width: '320px',
      margin: '20px auto',
      textAlign: 'center',
      color: 'white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }}>
      <h1>{weather.name}</h1>
      <p style={{ fontSize: '2em' }}>{weather.main.temp}°C</p>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} m/s</p>
    </div>
  );
};
"@

# --- STEP 1: Read WeatherPage.js ---
if (-Not (Test-Path $MainPage)) {
    Write-Host "❌ WeatherPage.js not found at $MainPage"
    exit
}
$Content = Get-Content $MainPage -Raw

# --- STEP 2: Remove any existing WeatherDashboard import ---
$Content = $Content -replace "import\s+WeatherDashboard.*?;", ""

# --- STEP 3: Add React import if missing ---
if ($Content -notmatch "import React") {
    $Content = "import React from 'react';`nimport axios from 'axios';`n`n" + $Content
} elseif ($Content -notmatch "import axios") {
    $Content = $Content -replace "(import React.*?;)", "`$1`nimport axios from 'axios';"
}

# --- STEP 4: Insert the inline component at the top ---
if ($Content -notmatch "const WeatherDashboard") {
    $Content = $WeatherComponent + "`n`n" + $Content
    Write-Host "✅ WeatherDashboard component added"
}

# --- STEP 5: Insert <WeatherDashboard /> inside first div in return ---
$Content = $Content -replace "(<div[^>]*>)", "`$1`n    <WeatherDashboard />"

# --- STEP 6: Save changes ---
Set-Content -Path $MainPage -Value $Content
Write-Host "✅ WeatherPage.js updated successfully. Run 'npm start'."
