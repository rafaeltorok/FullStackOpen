import axios from 'axios';
const url = 'http://localhost:3001/persons';


export default async function getData() {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw new Error('Error fetching data from the server: ' + err.message);
  }
}
