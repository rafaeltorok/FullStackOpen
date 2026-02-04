import calculateExercises from "./exerciseCalculator";

function main() {
  const target: number = Number(process.argv[2]);
  const dailyExerciseHours: number[] = process.argv.slice(3).map(h => Number(h));
  if (!target || dailyExerciseHours.length < 1 || target < 0 ) {
    throw new Error('Invalid input, please add the target number as the first parameter followed by each daily hours');
  } 
  if (dailyExerciseHours.some(h => isNaN(h) || h < 0)) {
    throw new Error('Each daily hour must be represented by a positive number only');
  }
  console.log(calculateExercises(target, dailyExerciseHours));
}

main();