import React from "react";

export const Form = ({
  handleSubmit,
  handleNameChange,
  handleNumberChange,
  nameVal,
  numVal,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={nameVal} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={numVal} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default Form;
