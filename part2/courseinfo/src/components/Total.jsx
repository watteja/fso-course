const Total = ({ exercisesPerPart }) => {
  const total = exercisesPerPart.reduce((acc, curr) => acc + curr, 0);
  return <b>total of {total} exercises</b>;
};

export default Total;
