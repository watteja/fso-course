import PropTypes from "prop-types";

const Todo = ({ todo, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo);
  };

  const onClickComplete = (todo) => () => {
    completeTodo(todo);
  };

  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={onClickDelete(todo)}> Delete </button>
      </span>
    </>
  );

  const notDoneInfo = (
    <>
      <span>This todo is not done</span>
      <span>
        <button onClick={onClickDelete(todo)}> Delete </button>
        <button onClick={onClickComplete(todo)}> Set as done </button>
      </span>
    </>
  );

  return (
    <div
      key={todo._id}
      className="todo"
      style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "70%",
        margin: "auto",
      }}
    >
      <span>{todo.text}</span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  );
};

Todo.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired,
};

export default Todo;
