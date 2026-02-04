import calculateBmi from "./bmiCalculator";

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