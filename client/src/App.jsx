import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherMap from './components/WeatherMap';
import { useSearchHistory } from './hooks/useSearchHistory';
import {
  fetchCurrentByCity,
  fetchCurrentByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
} from './api/weather';
import './index.css';

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, addToHistory] = useSearchHistory();

  // Fetch by city name (from search bar or history click)
  async function handleCitySearch(city) {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecastData] = await Promise.all([
        fetchCurrentByCity(city),
        fetchForecastByCity(city),
      ]);
      setCurrentWeather(weather);
      setForecast(forecastData);
      addToHistory(city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Fetch by GPS coordinates (geolocation on mount)
  async function handleGeolocation(lat, lon) {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecastData] = await Promise.all([
        fetchCurrentByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ]);
      setCurrentWeather(weather);
      setForecast(forecastData);
      // Use the resolved city name for history, not raw coordinates
      addToHistory(weather.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Request geolocation once on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => handleGeolocation(pos.coords.latitude, pos.coords.longitude),
        () => setError('Location access denied. Search for a city above.')
      );
    } else {
      setError('Geolocation not supported by your browser. Search for a city above.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <header className="app__header">
        <h1>🌤 Weather App</h1>
      </header>

      <main className="app__main">
        <SearchBar onSubmit={handleCitySearch} disabled={loading} />

        <SearchHistory history={searchHistory} onSelect={handleCitySearch} />

        {loading && (
          <div className="status-message">
            <div className="spinner" />
            <p>Loading weather data…</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-banner">⚠️ {error}</div>
        )}

        {!loading && currentWeather && (
          <>
            <CurrentWeather data={currentWeather} />
            <Forecast data={forecast} />
            <WeatherMap
              coords={currentWeather.coord}
              cityName={currentWeather.name}
            />
          </>
        )}
      </main>
    </div>
  );
}
