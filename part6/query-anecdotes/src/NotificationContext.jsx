/* eslint-disable react-refresh/only-export-components */
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
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export const showNotification = (dispatch, content, duration) => {
  dispatch({ type: "SET_NOTIFICATION", payload: content });
  setTimeout(() => {
    dispatch({ type: "CLEAR_NOTIFICATION" });
  }, duration * 1000);
};

export default NotificationContext;
