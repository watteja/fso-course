import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const NOTIFICATION_DURATION = 3000;

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const filteredPersons = persons.filter((p) =>
    filter ? p.name.toLowerCase().includes(filter) : persons
  );

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
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
      setPersons(persons.map((p) => (p.id === person.id ? returnedPerson : p)));
      setNewName("");
      setNewNumber("");
      setFilter("");

      // temporarily display notification
      setMessage(`Changed number for ${returnedPerson.name}`);
      setTimeout(() => {
        setMessage(null);
      }, NOTIFICATION_DURATION);
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
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      setFilter("");

      // temporarily display notification
      setMessage(`Added ${returnedPerson.name}`);
      setTimeout(() => {
        setMessage(null);
      }, NOTIFICATION_DURATION);
    });
  };

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${personToDelete.name}?`)) {
      return;
    }
    personService.deletePerson(id).then((deleted) => {
      setPersons(persons.filter((p) => p.id !== deleted.id));
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
    setFilter(event.target.value.toLowerCase());
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter onFilterChange={handleFilterChange} />

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
