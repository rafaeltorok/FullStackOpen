export default function Country({ country, weatherForecast }) {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital(s): <strong>{country.capital.join(', ')}</strong></p>
      <p>Area: <strong>{country.area}</strong></p>
      <h2><strong>Languages:</strong></h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => {
          return <li key={key}>{value}</li>
        })}
      </ul>
      <div>
        <img src={country.flags.svg} alt={country.flags.alt} className="country-flag" />
      </div>
      <h2>Weather in {country.capital[0]}</h2>
      {weatherForecast ? (
        <>
          <p>Temperature {weatherForecast.main.temp} Celsius</p>
          {weatherForecast.weather && weatherForecast.weather[0] && (
            <img
              src={`https://openweathermap.org/img/wn/${weatherForecast.weather[0].icon}@2x.png`}
              alt={weatherForecast.weather[0].description}
              title={weatherForecast.weather[0].description}
              className="weather-icon"
            />
          )}
          <p>Wind {weatherForecast.wind.speed} m/s</p>
        </>
      ) : <p>No weather data available</p>}
    </div>
  );
}
