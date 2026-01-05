import axios from "axios";
const loginUrl = "/api/login";

// Login an user
async function userLogin(credentials) {
  const request = await axios.post(loginUrl, credentials);
  return request.data;
}

export default {
  userLogin
};