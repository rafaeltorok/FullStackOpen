import { useDispatch } from "react-redux"
import { filterChange } from "../reducers/filterReducer"

export default function Filter() {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(filterChange(event.target.value))
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