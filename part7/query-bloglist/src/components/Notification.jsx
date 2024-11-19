import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();
  if (!notification) {
    return null;
  }

  return (
    <div className={`notification ${notification.type}`}>
      {notification.text}
    </div>
  );
};

export default Notification;
