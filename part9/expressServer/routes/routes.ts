import { Router } from "express";
import calculateBmi from "../../bmiCalculator/bmiCalculator";
import calculateExercises from "../../exerciseCalculator/exerciseCalculator";
const router = Router();

interface BmiValues {
  height: string,
  weight: string
}

interface exercisesValues {
  daily_exercises: (string | number)[];
  target: string | number;
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

    const t: number = Number(target);
    const eHours: number[] = daily_exercises.map(e => Number(e));

    if (
      isNaN(t) ||
      t < 0 ||
      eHours.some(e => isNaN(e) || e < 0)
    ) {
      throw new Error("malformatted parameters");
    }

    const result = calculateExercises(t, eHours);

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