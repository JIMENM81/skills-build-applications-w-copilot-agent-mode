import express, { Express, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  windSpeed: number;
  uvIndex: number;
  timestamp: string;
}

interface ForecastItem {
  timestamp: number;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface ForecastData {
  city: string;
  country: string;
  forecast: ForecastItem[];
}

interface ErrorResponse {
  error: string;
}

const app: Express = express();
const PORT = process.env.PORT || 5000;

// API Configuration
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Fetch current weather data for a city
 */
app.get('/api/weather', async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }

    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const weatherData: WeatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].main,
      windSpeed: response.data.wind.speed,
      uvIndex: response.data.clouds.all,
      timestamp: new Date().toISOString(),
    };

    res.json(weatherData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Weather API Error:', error.message);

      if (error.response?.status === 404) {
        res.status(404).json({ error: 'City not found' });
        return;
      }
    }

    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * Fetch weather forecast for a city
 */
app.get('/api/forecast', async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      res.status(400).json({ error: 'City parameter is required' });
      return;
    }

    const response = await axios.get(FORECAST_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const forecast: ForecastItem[] = response.data.list.slice(0, 8).map((item: any) => ({
      timestamp: item.dt,
      temperature: Math.round(item.main.temp),
      description: item.weather[0].main,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

    const forecastData: ForecastData = {
      city: response.data.city.name,
      country: response.data.city.country,
      forecast,
    };

    res.json(forecastData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Forecast API Error:', error.message);

      if (error.response?.status === 404) {
        res.status(404).json({ error: 'City not found' });
        return;
      }
    }

    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

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
  console.log(
    `📡 Weather API Key configured: ${WEATHER_API_KEY !== 'demo_key' ? 'Yes' : 'No (using demo key)'}`
  );
});

export default app;
