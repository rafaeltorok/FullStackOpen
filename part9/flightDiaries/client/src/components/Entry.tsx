import type { DiaryEntry } from "../../../types/types";

interface EntryProps {
  entry: DiaryEntry;
}

export default function Entry(props: EntryProps) {
  return (
    <div>
      <table className="diary-entry">
        <tbody>
          <tr>
            <th>Date</th>
            <td>{props.entry.date}</td>
          </tr>
          <tr>
            <th>Weather</th>
            <td>{props.entry.weather}</td>
          </tr>
          <tr>
            <th>Visibility</th>
            <td>{props.entry.visibility}</td>
          </tr>
          <tr>
            <th>Comment</th>
            <td>{props.entry.comment}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}