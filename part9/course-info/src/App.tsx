interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
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

interface PartProps {
  name: string;
  exerciseCount: number;
  description?: string;
  groupProjectCount?: number;
  backgroundMaterial?: string;
  requirements?: string[];
}

const Part = ({
  name,
  exerciseCount,
  description,
  groupProjectCount,
  backgroundMaterial,
  requirements,
}: PartProps) => (
  <>
    <div>
      <b>
        {name} {exerciseCount}
      </b>
    </div>
    {description && (
      <div>
        <i>{description}</i>
      </div>
    )}
    {groupProjectCount && <div>project exercises {groupProjectCount}</div>}
    {backgroundMaterial && <div>see the following: {backgroundMaterial}</div>}
    {requirements && <div>required skills: {requirements.join(", ")}</div>}
    <br />
  </>
);

interface ContentProps {
  courseParts: CoursePart[];
}

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Content = ({ courseParts }: ContentProps) => {
  return courseParts.map((part) => {
    switch (part.kind) {
      case "basic":
        return (
          <Part
            name={part.name}
            exerciseCount={part.exerciseCount}
            description={part.description}
          />
        );
      case "group":
        return (
          <Part
            name={part.name}
            exerciseCount={part.exerciseCount}
            groupProjectCount={part.groupProjectCount}
          />
        );
      case "background":
        return (
          <Part
            name={part.name}
            exerciseCount={part.exerciseCount}
            description={part.description}
            backgroundMaterial={part.backgroundMaterial}
          />
        );
      case "special":
        return (
          <Part
            name={part.name}
            exerciseCount={part.exerciseCount}
            description={part.description}
            requirements={part.requirements}
          />
        );
      default:
        return assertNever(part);
    }
  });
};

interface TotalProps {
  totalExercises: number;
}

const Total = ({ totalExercises }: TotalProps) => (
  <p>Number of exercises {totalExercises}</p>
);

export default App;

// alternative solution, with switch statement in Part component

// interface PartProps {
//   part: CoursePart;
// }

// const Part = ({ part }: PartProps) => {
//   // all parts have name and exerciseCount
//   const shared = (
//     <div>
//       <b>
//         {part.name} {part.exerciseCount}
//       </b>
//     </div>
//   );

//   // Only CoursePartGroup doesn't have description
//   const description =
//     part.kind === "group" ? null : (
//       <div>
//         <i>{part.description}</i>
//       </div>
//     );

//   // Helper function for exhaustive type checking
//   const assertNever = (value: never): never => {
//     throw new Error(
//       `Unhandled discriminated union member: ${JSON.stringify(value)}`
//     );
//   };

//   switch (part.kind) {
//     case "basic":
//       return (
//         <>
//           {shared}
//           {description}
//         </>
//       );
//     case "group":
//       return (
//         <>
//           {shared}
//           <div>project exercises {part.groupProjectCount}</div>
//         </>
//       );
//     case "background":
//       return (
//         <>
//           {shared}
//           {description}
//           <div>see the following: {part.backgroundMaterial}</div>
//         </>
//       );
//     case "special":
//       return (
//         <>
//           {shared}
//           {description}
//           <div>required skills: {part.requirements.join(", ")}</div>
//         </>
//       );
//     default:
//       return assertNever(part);
//   }
// };

// interface ContentProps {
//   courseParts: CoursePart[];
// }

// const Content = ({ courseParts }: ContentProps) => (
//   <>
//     {courseParts.map((part) => (
//       <div key={part.name}>
//         <Part part={part} />
//         <br />
//       </div>
//     ))}
//   </>
// );
