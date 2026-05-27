import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import {
  fetchWeatherFromAPI,
  saveWeatherToDatabase,
  getWeatherHistory,
  fetchForecastFromAPI,
} from './services/weatherService.js';

dotenv.config();

interface WeatherQuery {
  city?: string;
  limit?: string;
}

interface ErrorResponse {
  error: string;
}

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB().catch((error: Error) => {
  console.error('Failed to connect to database:', error.message);
  process.exit(1);
});

/**
 * Fetch current weather data for a city and save to DB
 */
app.get('/api/weather', async (req: Request<{}, {}, {}, WeatherQuery>, res: Response): Promise<void> => {
  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }

    // Fetch from API
    const weatherData = await fetchWeatherFromAPI(city);

    // Save to database
    await saveWeatherToDatabase(weatherData);

    res.json(weatherData);
  } catch (error) {
    if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
      return;
    }

    console.error('Weather fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * Get weather history for a city
 */
app.get(
  '/api/weather/history/:city',
  async (req: Request<{ city: string }, {}, {}, WeatherQuery>, res: Response): Promise<void> => {
    try {
      const { city } = req.params;
      const limit = Math.min(parseInt(req.query.limit || '10'), 100);

      if (!city || typeof city !== 'string') {
        res.status(400).json({ error: 'City parameter is required' });
        return;
      }

      const history = await getWeatherHistory(city, limit);

      if (history.length === 0) {
        res.status(404).json({ error: 'No weather history found for this city' });
        return;
      }

      res.json({
        city,
        count: history.length,
        records: history,
      });
    } catch (error) {
      console.error('Weather history error:', error);
      res.status(500).json({ error: 'Failed to fetch weather history' });
    }
  }
);

/**
 * Fetch weather forecast for a city
 */
app.get(
  '/api/forecast',
  async (req: Request<{}, {}, {}, WeatherQuery>, res: Response): Promise<void> => {
    try {
      const { city } = req.query;

      if (!city || typeof city !== 'string') {
        res.status(400).json({ error: 'City parameter is required' });
        return;
      }

      const forecastData = await fetchForecastFromAPI(city);
      res.json(forecastData);
    } catch (error) {
      if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
        res.status(404).json({ error: 'City not found' });
        return;
      }

      console.error('Forecast fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
  }
);

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response): void => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OctoFit Weather API Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit-weather'}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

export default app;
