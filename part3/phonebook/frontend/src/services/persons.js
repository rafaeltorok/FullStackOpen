import axios from 'axios';
const baseUrl = '/api/persons';


async function getData() {
  const response = await axios.get(baseUrl);
  return response.data;
}

async function getDataById(id) {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
}

async function storeData(newObject) {
  const request = await axios.post(baseUrl, newObject);
  return request.data;
}

async function removeData(id) {
  const request = await axios.delete(`${baseUrl}/${id}`);
  return request.data;
}

async function updateNumber(id, newObject) {
  const request = await axios.put(`${baseUrl}/${id}`, newObject);
  return request.data;
}

export default { getData, getDataById, storeData, removeData, updateNumber };