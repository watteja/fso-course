const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal range";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
};

// console.log(calculateBmi(180, 74));

interface BmiInput {
  height: number;
  weight: number;
}

const getValidBmiArgs = (inputValues: string[]): BmiInput => {
  if (inputValues.length !== 2) {
    throw new Error("Wrong number of arguments");
  }

  if (isNaN(Number(inputValues[0])) || isNaN(Number(inputValues[1]))) {
    throw new Error("Invalid arguments");
  }

  return {
    height: Number(inputValues[0]),
    weight: Number(inputValues[1]),
  };
};

try {
  const { height, weight } = getValidBmiArgs(process.argv.slice(2));
  console.log(calculateBmi(height, weight));
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error("Error:", e.message);
  } else {
    console.error("Something went wrong");
  }
}
