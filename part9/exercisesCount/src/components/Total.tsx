type TotalExercises = {
  totalExercises: number;
};

export default function Total(props: TotalExercises) {
  return (
    <div>
      <h3>
        Total number of exercises {props.totalExercises}
      </h3>
    </div>
  );
}