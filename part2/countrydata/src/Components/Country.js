import React, { useState } from "react";
import Weather from "./Weather";
import CountryDetails from "./CountryDetails";

//if countries > 10 'Too many matches, specify another filter'
//if 1 < countries < 10 Show all matching countries
//if countries === 1 Show basic data of country (Country name, flag, population, languages spoke, etc...)
export const Country = ({ countries }) => {
  const [show, setShow] = useState(false);
  const [currentCountry, setCurrentCountry] = useState([]);

  const handleClick = (country) => {
    setShow(!show);
    console.log({ country });
    setCurrentCountry([country]);
  };
  return (
    <>
      {countries.length > 10 && (
        <div>'Too many matches, specify another filter'</div>
      )}
      {countries.length < 10 &&
        countries.length > 1 &&
        countries.map((country) => (
          <div key={country.name} className="country">
            <div>{country.name}</div>{" "}
            <button onClick={() => handleClick(country)}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
        ))}
      {countries.length === 1 && (
        <>
          <CountryDetails key={countries[0].name} country={countries[0]} />{" "}
          <Weather country={countries[0]} />
        </>
      )}
      {show && (
        <>
          <Country countries={currentCountry} />
          <Weather country={currentCountry[0]} />
        </>
      )}
    </>
  );
};

export default Country;
