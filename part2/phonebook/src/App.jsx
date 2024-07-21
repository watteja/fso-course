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

  const handleAddBtnClick = (event) => {
    event.preventDefault();

    // check if the person is already in the phonebook
    const match = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );
    if (match) {
      if (
        window.confirm(
          `${match.name} is already added to the phonebook.` +
            ` Replace the old number with a new one?`
        )
      )
        updateNumber(match);
    } else {
      addNewPerson();
    }
  };

  const updateNumber = (person) => {
    const changedPerson = { ...person, number: newNumber };
    personService.updatePerson(changedPerson).then((returnedPerson) => {
      // update frontend state
      const newPersons = persons.map((p) =>
        p.id === person.id ? returnedPerson : p
      );
      setPersons(newPersons);
      setFilteredPersons(newPersons);
      setNewName("");
      setNewNumber("");
      setFilter("");
    });
  };

  const addNewPerson = () => {
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
      setFilter("");
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
        onAddPerson={handleAddBtnClick}
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
