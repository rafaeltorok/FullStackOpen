import type { CoursePartBackground } from "../../types";

type BackgroundProps = {
  part: CoursePartBackground;
}

export default function Background(props: BackgroundProps) {
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
          <th>Background material</th>
          <td>{props.part.backgroundMaterial}</td>
        </tr>
      </tbody>
    </table>
  );
}