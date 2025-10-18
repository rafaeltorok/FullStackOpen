import { useState, useEffect } from 'react';
import countriesService from './services/countries.js';
import weatherService from './services/weather.js';
import Search from './components/Search.jsx';
import Notification from './components/Notification.jsx';
import List from './components/List.jsx';
import Country from './components/Country.jsx';


function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countriesFound, setCountriesFound] = useState([]);
  const [displayData, setDisplayData] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState(null);

  const apiKey = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
  
  // Starter effect to fetch all data available on the remote server
  useEffect(() => {
    const fetchList = async () => {
      const countries = await countriesService.getAll();
      setCountries(countries);
    }
    fetchList();
  }, []);

  // Effect to handle the search term change at every user input
  useEffect(() => {
    if (searchTerm) {
      const filteredCountries = (countries.filter(
        c => c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setCountriesFound(filteredCountries);
      setDisplayData(filteredCountries.length <= 10);
    } else {
      setCountriesFound([]);
      setDisplayData(false);
    }
  }, [countries, searchTerm]);

  // Clear weather when searchTerm changes to avoid stale data
  useEffect(() => {
    setWeatherForecast(null);
  }, [searchTerm]);

  // Fetch weather when the search reduces results to exactly one country
  useEffect(() => {
    if (countriesFound.length === 1) {
      // fetch automatically for the single result
      fetchWeatherForecast(countriesFound[0]);
      setDisplayData(true);
    } else {
      // clear weather when there is not exactly one country shown
      setWeatherForecast(null);
    }
  }, [countriesFound]);

  const handleSearchCountry = (event) => {
    setSearchTerm(event.target.value.toLowerCase().trim());
  };

  const fetchWeatherForecast = async (country) => {
    setWeatherForecast(null);

    if (!apiKey) {
      console.error('OpenWeather API key missing. Make sure VITE_OPEN_WEATHER_MAP_API_KEY is set.');
      return;
    }

    const capCoords = country?.capitalInfo?.latlng;
    const fallbackCoords = country?.latlng;

    const coords = (Array.isArray(capCoords) && capCoords.length === 2) ? capCoords
                 : (Array.isArray(fallbackCoords) && fallbackCoords.length === 2) ? fallbackCoords
                 : null;

    if (!coords) {
      console.warn(`No coordinates for ${country.name?.common}. Skipping weather fetch.`);
      return;
    }

    try {
      const [lat, lon] = coords;
      const weather = await weatherService.getWeatherForecast(lat, lon, apiKey);
      setWeatherForecast(weather);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setWeatherForecast(null); // ensure UI shows "no data"
    }
  };

  const handleButtonClick = async (country) => {
    setCountriesFound([country]);
    setDisplayData(true);
    // Fetch weather for clicked country
    await fetchWeatherForecast(country);
  };

  return (
    <>
      <Search
        onChange={handleSearchCountry}
      />
      <Notification
        displayData={displayData}
        listSize={countriesFound.length}
      />
      {displayData && (
        <ul>
          {countriesFound.map(country => (
            <List
              key={country.cca3}
              country={country.name.common}
              listSize={countriesFound.length}
              handleButtonClick={() => handleButtonClick(country)}
            />
          ))}
        </ul>
      )}{displayData && countriesFound.length === 1 && (
        <Country
          country={countriesFound.length === 1 ? countriesFound[0] : null}
          weatherForecast={weatherForecast}
        />
      )}
    </>
  );
}

export default App;
