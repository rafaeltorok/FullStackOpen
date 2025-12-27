import { useState, useEffect } from "react"
import axios from "axios"

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // fetch all resources once
  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    })
  }, [baseUrl])

  // create new resource
  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setResources(resources.concat(response.data))
    return response.data
  }

  return [
    resources,
    { create }
  ]
}

export default useResource
