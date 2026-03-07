type TotalExercises = {
  totalExercises: number;
};

export default function Total(props: TotalExercises) {
  return (
    <div>
      <p>
        Number of exercises {props.totalExercises}
      </p>
    </div>
  );
}