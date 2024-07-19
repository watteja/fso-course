const Course = ({ course }) => {
  const total = course.parts.reduce((acc, curr) => acc + curr.exercises, 0);
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total sum={total} />
    </div>
  );
};

const Header = ({ name }) => <h2>{name}</h2>;

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Total = ({ sum }) => {
  return <b>total of {sum} exercises</b>;
};

export default Course;
