import { useDispatch } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

export default function Filter() {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }
  
  return (
    <div className="filter-bar">
      <label
        htmlFor="filter-input"
      >
        filter
      </label>
      <input
        id="filter-input"
        type="text"
        onChange={handleChange}
      ></input>
    </div>
  )
}