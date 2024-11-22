import { Link } from "react-router-dom";

const Users = ({ result }) => {
  const users = result?.data || [];

  return (
    <>
      <h2>Users</h2>

      {result.isPending && <div>loading users...</div>}

      {result.isError && (
        <div>user service not available due to problems in server</div>
      )}

      {users && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Users;
