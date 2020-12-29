import "./App.css";
import React, { useState, useEffect } from "react";
import Phonebook from "./Components/Phonebook";
import Form from "./Components/Form";
import Filter from "./Components/Filter";
import personService from "./Services/person";
import Notification from "./Components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const successNotification = (message) => {
    setMessage(message);
    setStatus(true);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const errorNotification = (message) => {
    setMessage(message);
    setStatus(false);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() === "" || newNumber.trim() === "") {
      errorNotification("Please fill both fields");
      return;
    }
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phone book, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        const newPerson = { ...person, number: newNumber };
        personService.update(person.id, newPerson).then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          );
          successNotification(`Updated ${person.name}'s number`);
          setNewName("");
          setNewNumber("");
        });

        return;
      } else {
        return;
      }
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      successNotification(`Added ${returnedPerson.name}`);
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (id) => {
    const name = persons.find((person) => person.id === id).name;
    personService
      .deleteDB(id)
      .then((returnedPersons) => {
        successNotification(`Deleted ${name}`);
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => {
        errorNotification(
          `Information of ${name} has already been removed from the server`
        );
        console.log(error);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {message !== "" && <Notification message={message} status={status} />}
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h2>Add a new contact</h2>
      <Form
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        nameVal={newName}
        numVal={newNumber}
      />
      <div>debug name: {newName}</div>
      <h2>Numbers</h2>
      {filter === "" && (
        <Phonebook deletePerson={deletePerson} persons={persons} />
      )}
      {filter !== "" && (
        <Phonebook
          deletePerson={deletePerson}
          persons={persons.filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )}
        />
      )}
    </div>
  );
};

export default App;
