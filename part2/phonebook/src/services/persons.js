import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';


async function getData() {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (err) {
    throw new Error('Error fetching data from the server: ' + err.message);
  }
}

async function storeData(newObject) {
  try {
    const request = await axios.post(baseUrl, newObject);
    return request.data;
  } catch (err) {
    throw new Error('Error storing new person to the server: ' + err.message);
  }
}

async function removeData(id) {
  try {
    const request = await axios.delete(`${baseUrl}/${id}`);
    return request.data;
  } catch (err) {
    throw new Error('Error removing person from the database: ' + err.message);
  }
}

async function updateNumber(id, newObject) {
  try {
    const request = await axios.put(`${baseUrl}/${id}`, newObject);
    return request.data;
  } catch (err) {
    throw new Error('Error updating the number: ' + err.message);
  }
}

export default { getData, storeData, removeData, updateNumber };