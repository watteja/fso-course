import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const capital = country.capital[0];

  // fetch weather data only when country changes
  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng;
    weatherService.getWeatherCity(lat, lon).then((data) => {
      setWeather(data);
    });
  }, [country]);

  const renderedLanguages = [];
  for (const [key, value] of Object.entries(country.languages)) {
    renderedLanguages.push(<li key={key}>{value}</li>);
  }

  return (
    <>
      <h2>{country.name.common}</h2>
      <div>capital {capital}</div>
      <div>area {country.area}</div>
      <h4>languages:</h4>
      <ul>{renderedLanguages}</ul>
      <img
        src={country.flags.svg}
        height="150"
        alt={`flag of ${country.name.common}`}
      />

      {weather && (
        <>
          <h3>Weather in {capital}</h3>
          <div>temperature {weather.main.temp} Celsius</div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
            alt={`weather icon for ${capital}`}
          />
          <div>wind {weather.wind?.speed} m/s</div>
        </>
      )}
    </>
  );
};

export default Country;
