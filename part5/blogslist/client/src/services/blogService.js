import axios from 'axios'
const baseUrl = '/api/blogs'

// GET all data
async function getData() {
  const response = await axios.get(baseUrl)
  return response.data
}

// GET item by id
async function getDataById(id) {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

// POST a new item
async function storeData(newObject) {
  const request = await axios.post(baseUrl, newObject)
  return request.data
}

// DELETE an item
async function removeData(id) {
  const request = await axios.delete(`${baseUrl}/${id}`)
  return request.data
}

// PUT updates an item
async function updateData(id, newObject) {
  const request = await axios.put(`${baseUrl}/${id}`, newObject)
  return request.data
}

export default { getData, getDataById, storeData, removeData, updateData }