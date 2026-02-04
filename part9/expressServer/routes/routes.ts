import { Router } from "express";
import calculateBmi from "../../bmiCalculator/bmiCalculator";
const router = Router();

interface BmiValues {
  height: string,
  weight: string
}

router.get('/hello', async (_req, res) => {
  res.send('Hello Full Stack!');
});

router.get('/bmi', async (req, res) => {
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

export default router;