// src/WeatherApp.jsx
import { useEffect, useState } from "react";

const WEATHER_CODE_MAP = {
  0: { label: "Clear sky", emoji: "☀️" },
  1: { label: "Mainly clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Fog", emoji: "🌫️" },
  48: { label: "Depositing rime fog", emoji: "🌫️" },
  51: { label: "Light drizzle", emoji: "🌦️" },
  53: { label: "Drizzle", emoji: "🌦️" },
  55: { label: "Dense drizzle", emoji: "🌧️" },
  61: { label: "Light rain", emoji: "🌧️" },
  63: { label: "Rain", emoji: "🌧️" },
  65: { label: "Heavy rain", emoji: "🌧️" },
  // …add more as needed
};

//Thi is a dictionary (object) that translate weather_code numbers (from API) into human-friendly text + emoji

export default function WeatherApp() {
  const [query, setQuery] = useState("Atlanta");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(null); // { temperature_2m, weather_code, time }
  const [place, setPlace] = useState(null); // { name, country, lat, lon }
  // query : what city you're searching for (default = "Atlanta")
  // loading: Show if data is being fetched right now.
  // error : hold any error messages (City not found)
  // Current: hold the weather info (temperature, code, time)
  // place: hold city details (name, country, lat/lon)

  const [unit, setUnit] = useState("c"); // "c" or "f"

  async function fetchWeather(city) {
    try {
      setLoading(true);
      setError("");

      // 1) Geocode the city name → lat/lon
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );
      const geo = await geoRes.json();
      if (!geo?.results?.length) {
        throw new Error("City not found.");
      }
      const { name, country, latitude, longitude } = geo.results[0];
      setPlace({ name, country, lat: latitude, lon: longitude });

      // 2) Fetch current weather by lat/lon
      const wxRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
      );
      const wx = await wxRes.json();
      setCurrent(wx.current);
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setCurrent(null);
      setPlace(null);
    } finally {
      setLoading(false);
    }
  }

  async function useMyLocation() {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // reverse geocode just for display (optional)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`
        );
        const geo = await geoRes.json();
        const display = geo?.results?.[0];
        setPlace({
          name: display?.name ?? "Your location",
          country: display?.country ?? "",
          lat: latitude,
          lon: longitude,
        });

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        const wx = await wxRes.json();
        setCurrent(wx.current);
      },
      (err) => setError(err.message || "Could not get location.")
    );
  }

  function formatTemp(celsius) {
    return unit === "c"
      ? `${Math.round(celsius)}°C`
      : `${Math.round((celsius * 9) / 5 + 32)}°F`;
  }

  // 1. start loading, get lat/long from geocoding API
  // Fetch actual weather from Open-Meteo using lat/lo
  // Save results in state (place, current)
  // Handle errors (if city not found)
  // Stop loadin

  useEffect(() => {
    fetchWeather(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Run once when component first load
  //Fetches weather for default city (Atlanta)

  const codeInfo =
    current && WEATHER_CODE_MAP[current.weather_code]
      ? WEATHER_CODE_MAP[current.weather_code]
      : { label: "Unknown", emoji: "❓" };
  //Look up the correct emoji & label from WEATHER_CDDE_MAP
  //if no match is found -> use "unknown" ?

  return (
    <div
      style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "system-ui" }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Weather App</h1>

      {/*  Search form   */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather(query);
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city (e.g., Atlanta)"
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button type="submit" style={{ padding: "8px 12px", borderRadius: 8 }}>
          Search
        </button>
        <button
          type="button"
          onClick={() => setUnit((u) => (u === "c" ? "f" : "c"))}
        >
          Switch to °{unit === "c" ? "F" : "C"}
        </button>
        <button type="button" onClick={useMyLocation}>
          Use My Location
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && current && place && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {place.name}, {place.country}
          </div>
          <div style={{ fontSize: 36 }}>
            {codeInfo.emoji} {codeInfo.label}
          </div>
          <div style={{ fontSize: 28 }}>
            {formatTemp(current.temperature_2m)}
          </div>

          <div style={{ color: "#6b7280" }}>
            As of {new Date(current.time).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

//Forms -> let you type a city and submit to update the weather
//Conditional rendering: if loading -> show "Loading..."
// If error -> show the error message
// Otherwise -> show city + weather details.
