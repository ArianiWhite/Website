import { useState } from 'react'
import './App.css'

const API_KEY = '2c054b1725d368a23d1a35d0ead8ade1'

const weatherBackgrounds = {
  Clear: 'linear-gradient(135deg, #880044, #ffb6c1)',
  Clouds: 'linear-gradient(135deg, #6d0038, #f48fb1)',
  Rain: 'linear-gradient(135deg, #4a0028, #f8bbd0)',
  Drizzle: 'linear-gradient(135deg, #7b0045, #fce4ec)',
  Thunderstorm: 'linear-gradient(135deg, #3b0022, #e91e8c)',
  Snow: 'linear-gradient(135deg, #c2185b, #fce4ec)',
  Mist: 'linear-gradient(135deg, #880044, #f48fb1)',
  Default: 'linear-gradient(135deg, #4a0028, #ffb6c1)',
}

function getBackground(condition) {
  return weatherBackgrounds[condition] || weatherBackgrounds.Default
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchWeather = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)
    setForecast([])

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      )
      if (!currentRes.ok) throw new Error('City not found')
      const currentData = await currentRes.json()

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
      )
      const forecastData = await forecastRes.json()

      // Get one entry per day (every 8th item = 24hrs apart)
      const daily = forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5)

      setWeather(currentData)
      setForecast(daily)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather()
  }

  const condition = weather?.weather[0]?.main || 'Default'
  const bg = getBackground(condition)

  return (
    <div className="app" style={{ background: bg }}>
      <div className="container">
        <h1 className="title">Weather Dashboard</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {loading && <p className="status">Loading...</p>}
        {error && <p className="status error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p className="temp">{Math.round(weather.main.temp)}°F</p>
            <p className="desc">{weather.weather[0].description}</p>
            <div className="details">
              <span>Humidity: {weather.main.humidity}%</span>
              <span>Wind: {Math.round(weather.wind.speed)} mph</span>
              <span>Feels like: {Math.round(weather.main.feels_like)}°F</span>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast">
            {forecast.map((day, i) => (
              <div key={i} className="forecast-card">
                <p className="day">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°F</p>
                <p className="day-desc">{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App