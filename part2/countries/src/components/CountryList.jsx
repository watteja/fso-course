const CountryList = ({ countries, onShowCountry }) => {
  return (
    <>
      {countries.map((country) => (
        <div key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => onShowCountry(country)}>show</button>
        </div>
      ))}
    </>
  );
};

export default CountryList;
