import type { CoursePartSpecial } from "../../types";

type SpecialProps = {
  part: CoursePartSpecial;
}

export default function Special(props: SpecialProps) {
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
        <tr>
          <th>Requirements</th>
          <td>{props.part.requirements.join(", ")}</td>
        </tr>
      </tbody>
    </table>
  );
}