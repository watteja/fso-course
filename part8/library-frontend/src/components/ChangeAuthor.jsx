import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import Select from "react-select";

import { EDIT_AUTHOR } from "../queries";

const ChangeAuthor = ({ authors, showError }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [born, setBorn] = useState("");

  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      showError(messages);
    },
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      showError("author not found");
    }
  }, [result.data, showError]);

  const submit = async (event) => {
    event.preventDefault();

    editAuthor({
      variables: { name: selectedAuthor.value, setBornTo: parseInt(born) },
    });

    setSelectedAuthor(null);
    setBorn("");
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedAuthor}
          onChange={setSelectedAuthor}
          options={authors}
        />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

ChangeAuthor.propTypes = {
  authors: PropTypes.array.isRequired,
  showError: PropTypes.func.isRequired,
};

export default ChangeAuthor;
