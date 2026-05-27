import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ── Layer definitions ──────────────────────────────────────
const WEATHER_LAYERS = [
  { id: 'temp_new',          label: '🌡 Temperature' },
  { id: 'precipitation_new', label: '🌧 Precipitation' },
  { id: 'clouds_new',        label: '☁️ Clouds' },
  { id: 'wind_new',          label: '💨 Wind' },
  { id: 'pressure_new',      label: '📊 Pressure' },
];

// ── AQI helpers ────────────────────────────────────────────
const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_COLORS = ['', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];
const AQI_BG     = ['', 'rgba(34,197,94,.12)', 'rgba(132,204,22,.12)',
                        'rgba(234,179,8,.12)', 'rgba(249,115,22,.12)', 'rgba(239,68,68,.12)'];

// ── Helper: fly to new center when coords change ───────────
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 6, { duration: 1.2 });
  }, [lat, lon, map]);
  return null;
}

// ── Main component ─────────────────────────────────────────
export default function WeatherMap({ coords, cityName }) {
  const [activeLayer, setActiveLayer] = useState('temp_new');
  const [showAQI, setShowAQI]         = useState(false);
  const [airData, setAirData]         = useState(null);
  const [aqiLoading, setAqiLoading]   = useState(false);
  const [aqiError, setAqiError]       = useState(null);

  // Fetch air quality whenever the coords change and AQI panel is open
  useEffect(() => {
    if (!coords || !showAQI) return;
    setAqiLoading(true);
    setAqiError(null);
    fetch(`/api/weather/air?lat=${coords.lat}&lon=${coords.lon}`)
      .then((r) => {
        if (!r.ok) throw new Error('Air quality data unavailable');
        return r.json();
      })
      .then((d) => { setAirData(d); setAqiLoading(false); })
      .catch((e) => { setAqiError(e.message); setAqiLoading(false); });
  }, [coords, showAQI]);

  if (!coords) return null;

  const aqi        = airData?.list?.[0]?.main?.aqi;
  const components = airData?.list?.[0]?.components;

  const pollutants = components
    ? [
        { label: 'PM2.5', value: components.pm2_5,  unit: 'μg/m³' },
        { label: 'PM10',  value: components.pm10,   unit: 'μg/m³' },
        { label: 'O₃',    value: components.o3,     unit: 'μg/m³' },
        { label: 'NO₂',   value: components.no2,    unit: 'μg/m³' },
        { label: 'SO₂',   value: components.so2,    unit: 'μg/m³' },
        { label: 'CO',    value: components.co,     unit: 'μg/m³' },
      ]
    : [];

  return (
    <div className="weather-map card">

      {/* ── Header ── */}
      <div className="weather-map__header">
        <h3>Weather Map</h3>
        <p className="weather-map__city">{cityName}</p>
      </div>

      {/* ── Layer toggles ── */}
      <div className="weather-map__controls">
        {WEATHER_LAYERS.map((layer) => (
          <button
            key={layer.id}
            className={`map-btn ${activeLayer === layer.id ? 'active' : ''}`}
            onClick={() => setActiveLayer(layer.id)}
          >
            {layer.label}
          </button>
        ))}
        <button
          className={`map-btn map-btn--aqi ${showAQI ? 'active' : ''}`}
          onClick={() => setShowAQI((v) => !v)}
        >
          🌿 Air Quality
        </button>
      </div>

      {/* ── Map ── */}
      <div className="weather-map__container">
        <MapContainer
          center={[coords.lat, coords.lon]}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: '340px', width: '100%', borderRadius: '10px' }}
        >
          {/* OpenStreetMap base tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* OWM weather overlay (proxied through Express to hide API key) */}
          <TileLayer
            key={activeLayer}
            url={`/api/weather/tiles/${activeLayer}/{z}/{x}/{y}`}
            opacity={0.65}
            attribution='Weather &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
          />

          {/* Fly to new city when coords change */}
          <RecenterMap lat={coords.lat} lon={coords.lon} />
        </MapContainer>
      </div>

      {/* ── AQI panel ── */}
      {showAQI && (
        <div
          className="aqi-panel"
          style={aqi ? {
            borderLeft: `4px solid ${AQI_COLORS[aqi]}`,
            background: AQI_BG[aqi],
          } : undefined}
        >
          {aqiLoading && <p className="aqi-loading">Loading air quality data…</p>}

          {aqiError && <p className="aqi-error">⚠️ {aqiError}</p>}

          {!aqiLoading && !aqiError && aqi && (
            <>
              <div className="aqi-header">
                <div>
                  <span className="aqi-badge" style={{ background: AQI_COLORS[aqi] }}>
                    AQI {aqi}
                  </span>
                  <span className="aqi-label" style={{ color: AQI_COLORS[aqi] }}>
                    {AQI_LABELS[aqi]}
                  </span>
                </div>
                <span className="aqi-subtitle">Air quality near {cityName}</span>
              </div>

              <div className="aqi-grid">
                {pollutants.map(({ label, value, unit }) => (
                  <div key={label} className="aqi-item">
                    <span className="aqi-item-label">{label}</span>
                    <span className="aqi-item-value">
                      {value != null ? value.toFixed(1) : '—'}
                      <span className="aqi-item-unit"> {unit}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* AQI scale legend */}
              <div className="aqi-legend">
                {AQI_LABELS.slice(1).map((label, i) => (
                  <div
                    key={label}
                    className={`aqi-legend-item ${aqi === i + 1 ? 'current' : ''}`}
                    style={{ background: AQI_COLORS[i + 1] }}
                    title={label}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
