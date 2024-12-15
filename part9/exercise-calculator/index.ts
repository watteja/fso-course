import express from "express";
const app = express();

import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

// automatically parse JSON data in the request body
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.json({ error: "malformatted parameters" });
  } else {
    res.json({
      weight,
      height,
      bmi: calculateBmi(height, weight),
    });
  }
});

interface ExerciseRequestBody {
  daily_exercises: unknown[];
  target: unknown;
}

const areValidParams = ({
  daily_exercises,
  target,
}: ExerciseRequestBody): boolean => {
  if (isNaN(Number(target))) {
    return false;
  }

  if (daily_exercises.some((d) => isNaN(Number(d)))) {
    return false;
  }

  return true;
};

app.post("/exercises", (req, res) => {
  const body = req.body as ExerciseRequestBody;

  if (!body.daily_exercises || !body.target) {
    res.status(400).json({ error: "parameters missing" });
  }
  if (!areValidParams(body)) {
    res.status(400).json({ error: "malformatted parameters" });
  }

  const target = Number(body.target);
  const dailyExercises = body.daily_exercises.map((d) => Number(d));
  res.json(calculateExercises(dailyExercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
