import { Alert } from "@mui/material";
import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();
  if (!notification) {
    return null;
  }

  return (
    <Alert severity={notification.type} sx={{ mt: 2, mb: 2 }}>
      {notification.text}
    </Alert>
  );
};

export default Notification;
