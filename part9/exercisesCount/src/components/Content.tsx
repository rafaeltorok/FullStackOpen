type CourseParts = {
  courseParts: Part[];
};

type Part = {
  name: string;
  exerciseCount: number
};

export default function Content(props: CourseParts) {
  return (
    <div>
      {props.courseParts.map((part: Part) => (
        <p>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
}