import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
      setFilteredPersons(persons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    // check if the person is already in the phonebook
    if (persons.map((person) => person.name).includes(newName)) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };
    // send new person to the server
    personService.createPerson(personObject).then((returnedPerson) => {
      // update frontend state
      const newPersons = persons.concat(returnedPerson);
      setPersons(newPersons);
      setFilteredPersons(newPersons);
      setNewName("");
      setNewNumber("");
      setFilter("");
    });
  };

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${personToDelete.name}?`)) {
      return;
    }
    personService.deletePerson(id).then((deleted) => {
      const updatedPersons = persons.filter((p) => p.id !== deleted.id);
      setPersons(updatedPersons);
      setFilteredPersons(updatedPersons);
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value.toLowerCase();
    setFilter(newFilter);
    setFilteredPersons(
      persons.filter((person) => person.name.toLowerCase().includes(newFilter))
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} onFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        onAddPerson={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
