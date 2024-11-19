import { createContext, useReducer, useContext } from "react";
import PropTypes from "prop-types";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext);
  return notification;
};

export const useNotify = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  const dispatch = notificationAndDispatch[1];

  return (content, duration = 5) => {
    dispatch({ type: "SET_NOTIFICATION", payload: content });
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" });
    }, duration * 1000);
  };
};

export default NotificationContext;
