const axios = require('axios');
const router = require('express').Router();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
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

module.exports = router;
