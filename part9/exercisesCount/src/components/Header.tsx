type CourseName = {
  courseName: string;
};

export default function Header(props: CourseName) {
  return (
    <div>
      <h1>{props.courseName}</h1>
    </div>
  );
}