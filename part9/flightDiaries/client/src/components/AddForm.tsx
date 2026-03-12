import { useState } from "react";
import { Visibility, Weather, type NewDiaryEntry } from "../../../types/types";

interface AddFormProps {
  addEntry: (entry: NewDiaryEntry) => Promise<void>;
}

export default function AddForm(props: AddFormProps) {
  const [entry, setEntry] = useState<NewDiaryEntry>({
    date: "",
    weather: Weather.Sunny,
    visibility: Visibility.Good,
    comment: ""
  });

  async function newEntry(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !entry.date ||
      !entry.comment
    ) {
      alert("All fields are required");
    } else {
      await props.addEntry(entry);
      setEntry({
        date: "",
        weather: Weather.Sunny,
        visibility: Visibility.Good,
        comment: ""
      });
    }
  }

  return (
    <div>
      <form 
        id="add-entry-form"
        onSubmit={newEntry}
      >
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={entry.date}
            placeholder="2001-01-01"
            min={"1900-01-01"}
            max={"2099-12-31"}
            onChange={(e) => setEntry({ ...entry, date: e.target.value }) }
          ></input>
        </div>
        <div>
          <label htmlFor="weather">Weather</label>
          <select 
            name="weather" 
            id="weather" 
            value={entry.weather}
            onChange={(e) => setEntry({ ...entry, weather: e.target.value as Weather }) }
          >
              <option value={Weather.Sunny}>Sunny</option>
              <option value={Weather.Rainy}>Rainy</option>
              <option value={Weather.Cloudy}>Cloudy</option>
              <option value={Weather.Stormy}>Stormy</option>
              <option value={Weather.Windy}>Windy</option>
          </select>
        </div>
        <div>
          <label htmlFor="visibility">Visibility</label>
          <select 
            name="visibility"
            id="visibility"
            value={entry.visibility} 
            onChange={(e) => setEntry({ ...entry, visibility: e.target.value as Visibility }) }
          >
              <option value={Visibility.Great}>Great</option>
              <option value={Visibility.Good}>Good</option>
              <option value={Visibility.Ok}>Ok</option>
              <option value={Visibility.Poor}>Poor</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            placeholder="Insert comment in here..."
            rows={5}
            value={entry.comment}
            onChange={(e) => setEntry({ ...entry, comment: e.target.value })}
          ></textarea>
        </div>
        <div>
          <button
            id="add-submit-button"
            type="submit"
          >Add</button>
        </div>
      </form>
    </div>
  );
}