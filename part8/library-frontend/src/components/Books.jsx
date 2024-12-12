import { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre === "all genres" ? null : genre },
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  let books = result.data.allBooks;
  if (genre && genre !== "all genres") {
    books = books.filter((book) => book.genres.includes(genre));
  }

  const genres = books.reduce((acc, book) => {
    book.genres?.forEach((genre) => {
      // add genre if it's not already included
      if (!acc.includes(genre)) {
        acc.push(genre);
      }
    });
    return acc;
  }, []);
  genres.push("all genres");

  const handleGenreClick = (genre) => {
    setGenre(genre);
    // refetch data in case new book has been added
    // source: https://www.apollographql.com/docs/react/data/queries#refetching
    result.refetch({ genre: genre === "all genres" ? null : genre });
  };

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <div>
          in genre <strong>{genre}</strong>
        </div>
      )}

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

      {genres.map((genre) => (
        <button key={genre} onClick={() => handleGenreClick(genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

Books.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Books;
