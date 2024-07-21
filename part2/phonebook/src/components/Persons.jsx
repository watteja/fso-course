const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.name} person={person} onDelete={onDelete} />
      ))}
    </div>
  );
};

const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={() => onDelete(person.id)}>delete</button>
    </div>
  );
};

export default Persons;
