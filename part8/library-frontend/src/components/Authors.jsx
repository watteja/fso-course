import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";

import { ALL_AUTHORS } from "../queries";
import ChangeAuthor from "./ChangeAuthor";

const Authors = ({ show, loggedIn, showError }) => {
  const result = useQuery(ALL_AUTHORS);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const authorOptions = authors.map((a) => ({
    value: a.name,
    label: a.name,
  }));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loggedIn && (
        <ChangeAuthor authors={authorOptions} showError={showError} />
      )}
    </div>
  );
};

Authors.propTypes = {
  show: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  showError: PropTypes.func.isRequired,
};

export default Authors;
