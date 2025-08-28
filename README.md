# WeatherApp_ReactJS
# Create a README file for the user's React Weather App
readme_content = r"""# React Weather App (Open-Meteo) — with “Use My Location”

A simple React app that shows **current weather** for a searched city and lets the user **use current device location** (HTML5 Geolocation). No API keys required.

> Stack: React + Fetch + Open-Meteo APIs. Tailwind CSS is optional for styling.

---

## Features (current scope)

- Search by **city name** → geocode to latitude/longitude
- Fetch **current weather** (temperature & weather code → human label + emoji)
- **Use My Location** button (HTML5 Geolocation + reverse geocoding)
- Robust **loading** and **error** states
- Optional **Tailwind CSS** styling (+ quick check that Tailwind is working)

---

## APIs Used (no key required)

- **Open-Meteo Geocoding API** (forward):  
  `https://geocoding-api.open-meteo.com/v1/search?name=<CITY>&count=1`
- **Open-Meteo Reverse Geocoding API** (for “Use My Location”):  
  `https://geocoding-api.open-meteo.com/v1/reverse?latitude=<LAT>&longitude=<LON>&count=1`
- **Open-Meteo Forecast API (current weather)**:  
  `https://api.open-meteo.com/v1/forecast?latitude=<LAT>&longitude=<LON>&current=temperature_2m,weather_code&timezone=auto`

> These endpoints support CORS and require no API key.

---

## Getting Started

### 1) Prerequisites
- **Node.js 18+** and **npm** installed
- A terminal (PowerShell, cmd, or Git Bash on Windows)

### 2) Create the app (Vite – recommended)
```bash
# create
npm create vite@latest weather-app -- --template react
cd weather-app

# install deps
npm install

# start dev server
npm run dev
