import type { CoursePartGroup } from "../../types";

type GroupProps = {
  part: CoursePartGroup;
}

export default function Group(props: GroupProps) {
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
          <th>Group Project Count</th>
          <td>{props.part.groupProjectCount}</td>
        </tr>
      </tbody>
    </table>
  );
}