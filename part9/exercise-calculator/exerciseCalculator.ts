type Rating = 1 | 2 | 3;

type Description =
  | "not good enough"
  | "not too bad but could be better"
  | "you're overdoing it"
  | "something went wrong";

interface Result {
  days: number;
  trainingDays: number;
  target: number;
  average: number;
  targetReached: boolean;
  rating: Rating;
  ratingDescription: Description;
}

const calculateExercises = (
  deh: number[], // daily exercise hours
  target: number
): Result => {
  const average =
    Math.round((deh.reduce((acc, el) => acc + el, 0) / deh.length) * 100) / 100;

  let ratingDescription: Description;
  let rating: Rating;
  if (average < 0.95 * target) {
    rating = 1;
    ratingDescription = "not good enough";
  } else if (average <= 1.25 * target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "you're overdoing it";
  }

  return {
    days: deh.length,
    trainingDays: deh.filter((d) => d > 0).length,
    target,
    average,
    targetReached: average >= target,
    rating,
    ratingDescription,
  };
};

// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));

interface ExerciseInput {
  target: number;
  deh: number[]; // daily exercise hours
}

const getValidExerciseArgs = (inputValues: string[]): ExerciseInput => {
  if (inputValues.length < 2) {
    throw new Error("Not enough arguments");
  }

  if (inputValues.some((a) => isNaN(Number(a)))) {
    throw new Error("One or more invalid arguments");
  }

  return {
    target: Number(inputValues[0]),
    deh: inputValues.slice(1).map((a) => Number(a)),
  };
};

try {
  const { target, deh } = getValidExerciseArgs(process.argv.slice(2));
  console.log(calculateExercises(deh, target));
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error("Error:", e.message);
  } else {
    console.error("Something went wrong");
  }
}
