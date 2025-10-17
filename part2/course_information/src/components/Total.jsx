export default function Total({ parts }) {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div className="total-exercises">
      <p>total of {totalExercises} exercises</p>
    </div>
  );
}