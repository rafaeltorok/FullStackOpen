import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

async function getAll() {
  try {
    const response = await axios.get(`${baseUrl}/all`);
    return response.data;
  } catch (err) {
    throw new Error('Error fetching countries list: ' + err.message);
  }
}

async function getCountry(countryName) {
  try {
    const response = await axios.get(`${baseUrl}/name/${countryName}`);
    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch data for ${countryName}: ` + err.message);
  }
}

export default { getAll, getCountry };