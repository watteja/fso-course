const Country = ({ country }) => {
  const renderedLanguages = [];
  for (const [key, value] of Object.entries(country.languages)) {
    renderedLanguages.push(<li key={key}>{value}</li>);
  }

  return (
    <>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h4>languages:</h4>
      <ul>{renderedLanguages}</ul>
      <img
        src={country.flags.svg}
        height="150"
        alt={`flag of ${country.name.common}`}
      />
    </>
  );
};

export default Country;
