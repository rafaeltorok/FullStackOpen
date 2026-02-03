interface Results {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

function calculateExercises(target: number, dailyExerciseHours: number[]): Results {
  let ratingDescription: string;
  let success: boolean;
  let rating: number;
  const average = dailyExerciseHours.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0) / dailyExerciseHours.length;
  const trainingDays: number = dailyExerciseHours.filter(h => h > 0).length;

  if (average >= target) {
    // Reaching ot surpassing the target awards with the highest rating
    ratingDescription = 'you reached your target, well done!';
    success = true;
    rating = 3;
  } else if (average <= target / 10) {
    // If the student only achieved less than 10% the target, give the lowest rating
    ratingDescription = 'you need to dedicate more time for your exercises';
    success = false;
    rating = 1;
  } else {
    ratingDescription = 'not too bad but could be better';
    success = false;
    rating = 2;
  }

  const results: Results = {
    periodLength: dailyExerciseHours.length,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average
  };
  return results;
}


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