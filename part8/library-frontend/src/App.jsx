import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqueByTitle = (arr) => {
    let seen = new Set();
    return arr.filter((item) => {
      let title = item.title;
      return seen.has(title) ? false : seen.add(title);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByTitle(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      window.alert(`Book added: ${data.data.bookAdded.title}`);

      updateCache(client.cache, { query: ALL_BOOKS }, data.data.bookAdded);
    },
  });

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors
        show={page === "authors"}
        loggedIn={!!token}
        showError={notify}
      />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} showError={notify} />

      <Recommended show={page === "recommend"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
        showError={notify}
      />
    </div>
  );
};

export default App;
