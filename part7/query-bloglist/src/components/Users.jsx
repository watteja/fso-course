import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";

const Users = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });
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
                <td>{user.name}</td>
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
