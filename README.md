# 🌤 Weather App

A simple weather app built with **React + Vite** (frontend) and **Node.js/Express** (backend), powered by the [OpenWeatherMap API](https://openweathermap.org/api).

## Features

- 🌡 **Current conditions** — temperature, feels-like, humidity, wind speed, weather icon
- 📅 **5-day forecast** — one card per day with high/low temps
- 📍 **Geolocation** — auto-detects your location on first load
- 🕒 **Search history** — remembers your last 5 searched cities (stored in `localStorage`)

## Project Structure

```
.
├── server/          # Express API proxy (hides your API key)
│   ├── index.js
│   └── routes/weather.js
└── client/          # Vite + React frontend
    └── src/
        ├── App.jsx
        ├── api/weather.js
        ├── hooks/useSearchHistory.js
        └── components/
            ├── SearchBar.jsx
            ├── SearchHistory.jsx
            ├── CurrentWeather.jsx
            └── Forecast.jsx
```

## Getting Started

### 1. Get a free API key

Sign up at [openweathermap.org](https://home.openweathermap.org/users/sign_up) and copy your API key.

> **Note:** New free-tier keys can take up to **2 hours** to activate.

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure your API key

```bash
cp .env.example server/.env
# Then edit server/.env and set:
# OPENWEATHER_API_KEY=your_key_here
```

### 4. Start the dev servers

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

The browser will prompt for location permission on first load — allow it to see your local weather automatically.

## Available Scripts

| Command | Description |
|---|---|
| `npm run install:all` | Install dependencies for both server and client |
| `npm run dev` | Start both servers concurrently (dev mode) |
| `npm start` | Start only the Express server (production) |

## Environment Variables

Copy `.env.example` to `server/.env`:

```
OPENWEATHER_API_KEY=your_api_key_here
PORT=3001
```

> ⚠️ Never commit `server/.env` — it is gitignored by default.
