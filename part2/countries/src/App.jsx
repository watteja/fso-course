import { useState, useEffect } from "react";
import countryService from "./services/countries";
import CountryList from "./components/CountryList";
import Country from "./components/Country";

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countryService.getAll().then((countries) => {
      setCountries(countries);
    });
  }, []);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);

    // if filter is empty, show nothing
    if (!newFilter) {
      setFilteredCountries([]);
      return;
    }

    // find matching country names
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(newFilter.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const handleShowCountry = (country) => {
    setFilteredCountries([country]);
    setFilter(country.name.common);
  };

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      {filteredCountries.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : filteredCountries.length > 1 ? (
        <CountryList
          countries={filteredCountries}
          onShowCountry={handleShowCountry}
        />
      ) : (
        filteredCountries.length === 1 && (
          <Country country={filteredCountries[0]} />
        )
      )}
    </div>
  );
}

export default App;
