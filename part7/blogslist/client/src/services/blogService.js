import axios from "axios";
const baseUrl = "/api/blogs";
const loginUrl = "/api/login";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// GET all data
async function getData() {
  const response = await axios.get(baseUrl);
  return response.data;
}

// GET item by id
async function getDataById(id) {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
}

// POST a new item
async function storeData(newObject) {
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.post(baseUrl, newObject, config);
  return request.data;
}

// DELETE an item
async function removeData(id) {
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.delete(`${baseUrl}/${id}`, config);
  return request.data;
}

// PUT updates an item
async function updateData(newObject) {
  const request = await axios.put(`${baseUrl}/${newObject.id}`, newObject);
  return request.data;
}

// Login an user
async function userLogin(credentials) {
  const request = await axios.post(loginUrl, credentials);
  return request.data;
}

export default {
  getData,
  getDataById,
  storeData,
  removeData,
  updateData,
  userLogin,
  setToken,
};
