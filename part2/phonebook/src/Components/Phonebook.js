import React from "react";
import Contact from "./Contact";

export const Phonebook = ({ persons, onDelete }) => {
  return (
    <>
      {persons.map((person) => (
        <Contact key={person.name} person={person} onDelete={onDelete} />
      ))}
    </>
  );
};

export default Phonebook;
