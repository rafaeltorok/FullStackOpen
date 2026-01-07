import axios from "axios";
const blogsUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// GET all data
async function getData() {
  const response = await axios.get(blogsUrl);
  return response.data;
}

// GET item by id
async function getDataById(id) {
  const response = await axios.get(`${blogsUrl}/${id}`);
  return response.data;
}

// POST a new item
async function storeData(newObject) {
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.post(blogsUrl, newObject, config);
  return request.data;
}

// DELETE an item
async function removeData(id) {
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.delete(`${blogsUrl}/${id}`, config);
  return request.data;
}

// PUT updates an item
async function updateData(newObject) {
  const request = await axios.put(`${blogsUrl}/${newObject.id}`, newObject);
  return request.data;
}

// POST a new comment
async function addComment(blogId, comment) {
  const request = await axios.post(`${blogsUrl}/${blogId}/comments`, comment);
  return request.data;
}

export default {
  getData,
  getDataById,
  storeData,
  removeData,
  updateData,
  setToken,
  addComment,
};
