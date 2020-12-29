import React from "react";

export const Contact = ({ name, number, deletePerson }) => {
  return (
    <div>
      <div>
        {name} : {number}
      </div>
      <button onClick={deletePerson}>Delete</button>
    </div>
  );
};

export default Contact;
