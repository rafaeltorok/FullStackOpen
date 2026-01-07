import axios from "axios";
const usersUrl = '/api/users';

// GET all users
async function getUsers() {
  const response = await axios.get(usersUrl);
  return response.data;
}

// GET item by id
async function getUserById(id) {
  const response = await axios.get(`${usersUrl}/${id}`);
  return response.data;
}

export default {
  getUsers,
  getUserById,
};