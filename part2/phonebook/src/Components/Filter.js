import React from "react";

export const Filter = ({ handleFilterChange, filter }) => {
  return (
    <div>
      filter shown with: <input onChange={handleFilterChange} value={filter} />
    </div>
  );
};

export default Filter;
