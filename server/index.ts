import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// System health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', system: 'AntarcticNav AI Core Engine', timestamp: new Date().toISOString() });
});

// Real Data proxy route for Weather (Open-Meteo REST API)
app.get('/api/weather', async (req: Request, res: Response) => {
  const lat = req.query.lat ? Number(req.query.lat) : 0;
  const lng = req.query.lng ? Number(req.query.lng) : 0;

  if (!lat || !lng) {
    res.status(400).json({ status: 'UNAVAILABLE', message: 'Valid latitude and longitude required.' });
    return;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`;
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`Open-Meteo error ${apiRes.status}`);
    const data = await apiRes.json();
    res.json({ status: 'LIVE', data });
  } catch (err) {
    res.status(503).json({ status: 'UNAVAILABLE', message: 'Live weather API unavailable.' });
  }
});

// Real Data proxy route for Marine (Open-Meteo Marine REST API)
app.get('/api/ocean', async (req: Request, res: Response) => {
  const lat = req.query.lat ? Number(req.query.lat) : 0;
  const lng = req.query.lng ? Number(req.query.lng) : 0;

  if (!lat || !lng) {
    res.status(400).json({ status: 'UNAVAILABLE', message: 'Valid latitude and longitude required.' });
    return;
  }

  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wave_direction,ocean_current_velocity`;
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`Open-Meteo Marine error ${apiRes.status}`);
    const data = await apiRes.json();
    res.json({ status: 'LIVE', data });
  } catch (err) {
    res.status(503).json({ status: 'UNAVAILABLE', message: 'Live marine ocean API unavailable.' });
  }
});

app.listen(PORT, () => {
  console.log(`[AntarcticNav AI Server] Core API running on port ${PORT}`);
});
