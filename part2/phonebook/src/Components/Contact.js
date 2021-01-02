import React from "react";

export const Contact = ({ person, onDelete }) => {
  return (
    <div>
      <div>
        {person.name} : {person.number}
      </div>
      <button onClick={() => onDelete(person.id)}>Delete</button>
    </div>
  );
};

export default Contact;
