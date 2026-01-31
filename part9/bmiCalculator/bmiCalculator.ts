function calculateBmi(height: number, weight: number): string {
  const bmi = (weight / ((height / 100) * (height / 100)));

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal range";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

function main() {
  try {
    const height = Number(process.argv[2]);
    const weight = Number(process.argv[3]);

    if (
      process.argv.length !== 4 ||
      isNaN(height) ||
      isNaN(weight) ||
      height < 1 || 
      weight < 1
    ) {
      throw new Error("Invalid arguments, please use the format 'npm run calculateBmi height_in_cm weight_in_kg'");
    } else {
      console.log(calculateBmi(height, weight));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

main();