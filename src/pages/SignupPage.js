import "../styles.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");      // ✅ new
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  const navigate = useNavigate();

  // Local Indian cities fallback
  const indianCities = [
    "Amaravati", "Visakhapatnam", "Vijayawada",
    "Itanagar", "Guwahati", "Dibrugarh",
    "Patna", "Gaya", "Raipur", "Bilaspur",
    "Panaji", "Margao", "Ahmedabad", "Surat",
    "Vadodara", "Chandigarh", "Gurugram",
    "Faridabad", "Shimla", "Dharamshala",
    "Ranchi", "Jamshedpur", "Bengaluru",
    "Mysuru", "Hubballi-Dharwad", "Thiruvananthapuram",
    "Kochi", "Kozhikode", "Bhopal", "Indore",
    "Gwalior", "Mumbai", "Pune", "Nagpur",
    "Imphal", "Shillong", "Aizawl", "Kohima",
    "Bhubaneswar", "Cuttack", "Puducherry",
    "Amritsar", "Ludhiana", "Jaipur", "Udaipur",
    "Jodhpur", "Gangtok", "Chennai", "Coimbatore",
    "Madurai", "Hyderabad", "Warangal", "Agartala",
    "Lucknow", "Kanpur", "Varanasi", "Agra",
    "Prayagraj", "Dehradun", "Haridwar", "Kolkata",
    "Siliguri", "Durgapur", "Port Blair", "Daman",
    "Diu", "Kavaratti", "New Delhi", "Old Delhi",
    "Leh", "Kargil", "Srinagar", "Jammu",
    "Manchirevula"
  ];

  // Fetch countries
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(res => res.json())
      .then(data => setCountries(data.data.map(c => c.name)))
      .catch(console.error);
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!country) return;
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    })
      .then(res => res.json())
      .then(data => setStates(data.data?.states.map(s => s.name) || []))
      .catch(() => setStates([]));
  }, [country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!country || !stateName) return;
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state: stateName }),
    })
      .then(res => res.json())
      .then(data => setCities(data.data || []))
      .catch(() => setCities([]));
  }, [country, stateName]);

  // Geolocation autofill
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        const addr = data.address || {};

        const cityName = addr.city || addr.town || addr.village || "";
        const dist = addr.suburb || addr.county || cityName || "";
        const state = addr.state || "";
        const countryName = addr.country || "";

        setCity(cityName);
        setDistrict(dist);
        setStateName(state);
        setCountry(countryName);
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    });
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    setCountryError("");
    setStateError("");
    setCityError("");

    let valid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format. Please enter a valid email.");
      valid = false;
    }

    if (!countries.includes(country)) {
      setCountryError("Invalid Country. Please enter a valid one.");
      valid = false;
    }

    if (!cities.includes(city) && !indianCities.includes(city)) {
      setCityError("Invalid City. Please select a valid city for the state.");
      valid = false;
    }

    if (!valid) return;

    const user = { name, email, password, country, state: stateName, city, district }; // ✅ added name
    localStorage.setItem("user", JSON.stringify(user));
    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="signup">
      <h1>Sign Up</h1>

      {city && stateName && district && country && (
        <p style={{ fontWeight: "bold" }}>
          Location: {city}, {district}, {stateName}, {country}
        </p>
      )}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"                 // ✅ new input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={e => setCountry(e.target.value)}
          required
        />
        {countryError && <p style={{ color: "red" }}>{countryError}</p>}

        <input
          type="text"
          placeholder="State"
          value={stateName}
          onChange={e => setStateName(e.target.value)}
          required
        />
        {stateError && <p style={{ color: "red" }}>{stateError}</p>}

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={e => setDistrict(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        {cityError && <p style={{ color: "red" }}>{cityError}</p>}

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
