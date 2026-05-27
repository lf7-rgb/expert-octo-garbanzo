const axios = require('axios');
const router = require('express').Router();

const BASE_URL      = 'https://api.openweathermap.org/data/2.5';
const TILE_BASE_URL = 'https://tile.openweathermap.org/map';
const API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Build OpenWeatherMap query params from the incoming request query.
 * Accepts either ?city=London or ?lat=51.5&lon=-0.12
 */
function buildParams(query) {
  const params = { appid: API_KEY, units: 'imperial' };
  if (query.city) {
    params.q = query.city;
  } else if (query.lat && query.lon) {
    params.lat = query.lat;
    params.lon = query.lon;
  }
  return params;
}

// GET /api/weather/current?city=London
// GET /api/weather/current?lat=51.5&lon=-0.12
router.get('/current', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: buildParams(req.query),
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      message: err.response?.data?.message || 'Failed to fetch current weather',
    });
  }
});

// GET /api/weather/forecast?city=London
// GET /api/weather/forecast?lat=51.5&lon=-0.12
router.get('/forecast', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: buildParams(req.query),
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      message: err.response?.data?.message || 'Failed to fetch forecast',
    });
  }
});

// GET /api/weather/air?lat=51.5&lon=-0.12
router.get('/air', async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat: req.query.lat, lon: req.query.lon, appid: API_KEY },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      message: err.response?.data?.message || 'Failed to fetch air quality',
    });
  }
});

// GET /api/weather/tiles/:layer/:z/:x/:y
// Proxies OWM map tiles so the API key is never exposed to the browser.
// Valid layers: temp_new, precipitation_new, clouds_new, wind_new, pressure_new
router.get('/tiles/:layer/:z/:x/:y', async (req, res) => {
  const { layer, z, x, y } = req.params;
  const url = `${TILE_BASE_URL}/${layer}/${z}/${x}/${y}.png`;
  try {
    const { data, headers } = await axios.get(url, {
      params: { appid: API_KEY },
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', headers['content-type'] || 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(data);
  } catch (err) {
    // Return a transparent 1×1 PNG on any tile error so the map doesn't break
    const TRANSPARENT_PNG = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    res.set('Content-Type', 'image/png');
    res.status(200).send(TRANSPARENT_PNG);
  }
});

module.exports = router;
