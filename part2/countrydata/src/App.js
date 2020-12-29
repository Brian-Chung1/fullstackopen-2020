import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Country } from "./Components/Country";

function App() {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      console.log(response.data);
      setCountries(response.data);
    });
  }, []);

  const handleInput = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div>
        find countries: <input onChange={handleInput} value={filter} />
      </div>
      {filter !== "" && (
        <Country
          countries={countries.filter((country) =>
            country.name.toLowerCase().includes(filter.toLowerCase())
          )}
        />
      )}
    </>
  );
}

export default App;
