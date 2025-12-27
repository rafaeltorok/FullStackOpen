import { useState, useEffect } from "react";

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return

      try {
        const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${name.trim().toLowerCase()}`)
        const data = await response.json()
        setCountry({ 
          found: true, 
          data: {
            name: data.name.common, 
            capital: data.capital[0], 
            population: data.population, 
            flag: data.flags.png
          }
        })
      } catch (error) {
        setCountry({ found: false, data: null })
      }
    }
    fetchData()
  }, [name])

  return country
}

export default useCountry