/**
 * Thin fetch wrappers for the Express API proxy.
 * The client never directly calls openweathermap.org — the API key
 * lives only on the server side.
 */

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    let message = 'Something went wrong';
    try {
      const err = await res.json();
      message = err.message || message;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

export const fetchCurrentByCity = (city) =>
  fetchJSON(`/api/weather/current?city=${encodeURIComponent(city)}`);

export const fetchCurrentByCoords = (lat, lon) =>
  fetchJSON(`/api/weather/current?lat=${lat}&lon=${lon}`);

export const fetchForecastByCity = (city) =>
  fetchJSON(`/api/weather/forecast?city=${encodeURIComponent(city)}`);

export const fetchForecastByCoords = (lat, lon) =>
  fetchJSON(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
