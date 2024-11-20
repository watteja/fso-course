import { createContext, useReducer, useContext } from "react";
import PropTypes from "prop-types";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserValue = () => {
  const [user] = useContext(UserContext);
  return user;
};

export const useUserDispatch = () => {
  const [, dispatch] = useContext(UserContext);
  return dispatch;
};

export default UserContext;
