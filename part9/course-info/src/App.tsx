const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

interface HeaderProps {
  courseName: string;
}

const Header = ({ courseName }: HeaderProps) => <h1>{courseName}</h1>;

interface ContentProps {
  courseParts: { name: string; exerciseCount: number }[];
}

const Content = ({ courseParts }: ContentProps) => (
  <>
    {courseParts.map((part) => (
      <p key={part.name}>
        {part.name} {part.exerciseCount}
      </p>
    ))}
  </>
);

interface TotalProps {
  totalExercises: number;
}

const Total = ({ totalExercises }: TotalProps) => (
  <p>Number of exercises {totalExercises}</p>
);

export default App;
