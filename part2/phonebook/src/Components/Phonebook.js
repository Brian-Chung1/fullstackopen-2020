import React from "react";
import Contact from "./Contact";
import personService from "../Services/person";

export const Phonebook = ({ persons, deletePerson }) => {
  return (
    <>
      {persons.map((person) => (
        <Contact
          key={person.name}
          name={person.name}
          number={person.number}
          deletePerson={() => {
            if (window.confirm(`Delete ${person.name}`)) {
              deletePerson(person.id);
            } else {
              return;
            }
          }}
        />
      ))}
    </>
  );
};

export default Phonebook;
