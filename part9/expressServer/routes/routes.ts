import { Router } from "express";
import calculateBmi from "../../bmiCalculator/bmiCalculator";
import calculateExercises from "../../exerciseCalculator/exerciseCalculator";
const router = Router();

interface BmiValues {
  height: string,
  weight: string
}

interface exercisesValues {
  daily_exercises: number[];
  target: number;
}

router.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

router.get('/bmi', (req, res) => {
  try {
    const { height, weight } = req.query as unknown as BmiValues;
    const h = Number(height);
    const w = Number(weight);
    
    if (isNaN(h) || isNaN(w) || h < 1 || w < 1) {
      throw new Error("malformatted parameters");
    }

    return res.status(200).json({ 
      height: h, 
      weight: w, 
      bmi: calculateBmi(h, w) 
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    } else {
      return res.status(500).end();
    }
  }
});

router.post('/exercises', (req, res) => {
  try {
    const { daily_exercises, target } = req.body as unknown as exercisesValues;

    if (
      daily_exercises === undefined ||
      target === undefined ||
      !Array.isArray(daily_exercises) ||
      daily_exercises.length < 1
    ) {
      throw new Error("parameters missing");
    }

    if (
      typeof target !== 'number' ||
      target < 0 ||
      Number.isNaN(target) ||
      daily_exercises.some(e => typeof e !== 'number' || Number.isNaN(e) || e < 0)
    ) {
      throw new Error("malformatted parameters");
    }

    const result = calculateExercises(target, daily_exercises);

    return res.status(200).json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    } else {
      return res.status(500).end();
    }
  }
});

export default router;