interface Results {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export default function calculateExercises(target: number, dailyExerciseHours: number[]): Results {
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
  } else if (average <= target / 2) {
    // If the student only achieved less than 10% the target, give the lowest rating
    ratingDescription = 'bad';
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
