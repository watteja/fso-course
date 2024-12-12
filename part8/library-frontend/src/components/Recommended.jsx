import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS, ME } from "../queries";

const Recommended = ({ show }) => {
  const allBooksResult = useQuery(ALL_BOOKS);
  const currentUserResult = useQuery(ME);

  if (!show) {
    return null;
  }

  if (allBooksResult.loading || currentUserResult.loading) {
    return <div>loading...</div>;
  }

  const favoriteGenre = currentUserResult.data.me.favoriteGenre;
  const books = allBooksResult.data.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre)
  );

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Recommended.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Recommended;
