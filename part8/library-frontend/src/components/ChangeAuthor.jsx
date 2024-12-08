import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import PropTypes from "prop-types";

import { EDIT_AUTHOR } from "../queries";

const ChangeAuthor = ({ showError }) => {
  const [name, setName] = useState("");
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

    editAuthor({ variables: { name, setBornTo: parseInt(born) } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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
  showError: PropTypes.func.isRequired,
};

export default ChangeAuthor;
