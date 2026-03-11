import type { CoursePartBasic } from "../../types";

type BasicProps = {
  part: CoursePartBasic;
}

export default function Basic(props: BasicProps) {
  return (
    <table className="part-info-table">
      <thead>
        <tr>
          <th colSpan={2}>{props.part.name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Exercises</th>
          <td>{props.part.exerciseCount}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{props.part.description}</td>
        </tr>
      </tbody>
    </table>
  );
}