require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const weatherRouter = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// In dev, allow the Vite dev server. In production, same-origin so no CORS needed.
if (isDev) {
  app.use(cors({ origin: 'http://localhost:5173' }));
}

app.use(express.json());
app.use('/api/weather', weatherRouter);

// In production, serve the Vite build and handle client-side routing
if (!isDev) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
