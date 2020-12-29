import axios from "axios";
import React, { useState, useEffect } from "react";

export const Weather = ({ country }) => {
  const apikey = process.env.REACT_APP_API_KEY;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${apikey}&query=${country.capital}`
      )
      .then((response) => setWeather(response.data.current));
  }, [country]);
  console.log(weather);

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      {weather ? (
        <>
          <p>Tempature: {weather.temperature}</p>
          <p>
            Wind: {weather.wind_speed} mph Direction: {weather.wind_dir}
          </p>
        </>
      ) : (
        <p>Loading weather data....</p>
      )}
    </div>
  );
};

export default Weather;
