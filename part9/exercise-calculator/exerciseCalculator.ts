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
  daily_exercise_hours: number[],
  target: number
): Result => {
  const average =
    daily_exercise_hours.reduce((acc, el) => acc + el, 0) /
    daily_exercise_hours.length;

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
    days: daily_exercise_hours.length,
    trainingDays: daily_exercise_hours.filter((d) => d > 0).length,
    target,
    average,
    targetReached: average >= target,
    rating,
    ratingDescription,
  };
};

const daily_exercise_hours = [3, 0, 2, 4.5, 0, 3, 1];
const target = 2;
console.log(calculateExercises(daily_exercise_hours, target));
