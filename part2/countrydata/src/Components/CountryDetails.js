import React from "react";

export const CountryDetails = ({ country }) => {
  return (
    <div key={country.name}>
      <h1>{country.name}</h1>
      <img src={country.flag} alt="country flag" />
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <div>
        Spoken Languages:
        {country.languages.map((language) => (
          <div>{language.name}</div>
        ))}
      </div>
    </div>
  );
};

export default CountryDetails;
