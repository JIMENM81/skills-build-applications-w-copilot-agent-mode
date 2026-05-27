import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('San Francisco');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather?city=${cityName}`);
      setWeatherData(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌦️ OctoFit Weather Dashboard</h1>
        <p>Stay informed about the weather while tracking your fitness goals</p>
      </header>

      <div className="container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {loading && <div className="loading">Loading weather data...</div>}

        {error && <div className="error">{error}</div>}

        {weatherData && (
          <div className="weather-card">
            <h2>{weatherData.city}, {weatherData.country}</h2>
            <div className="weather-main">
              <div className="temperature">
                <span className="temp-value">{weatherData.temperature}°</span>
                <span className="temp-unit">C</span>
              </div>
              <div className="weather-info">
                <p className="description">{weatherData.description}</p>
                <p className="feels-like">Feels like: {weatherData.feelsLike}°C</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="label">Humidity</span>
                <span className="value">{weatherData.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Wind Speed</span>
                <span className="value">{weatherData.windSpeed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="label">Pressure</span>
                <span className="value">{weatherData.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">UV Index</span>
                <span className="value">{weatherData.uvIndex}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
