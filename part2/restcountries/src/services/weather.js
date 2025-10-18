import axios from 'axios';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeatherForecast(lat, lon, apiKey) {
  if (!lat || !lon) {
    throw new Error('Missing latitude or longitude');
  }
  const url = `${baseUrl}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${encodeURIComponent(apiKey)}&units=metric`;
  const response = await axios.get(url);
  return response.data;
}

export default { getWeatherForecast };