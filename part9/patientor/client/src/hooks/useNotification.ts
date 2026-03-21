import { useState } from "react";

interface Notification {
  message: string;
  type: "success" | "info" | "warning" | "error" | null;
}

export default function useNotification() {
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: null,
  });

  function notifySuccess(message: string) {
    setNotification({ message: message, type: "success" });
    setTimeout(() => {
      setNotification({ message: "", type: null });
    }, 6000);
  }

  function notifyError(message: string) {
    setNotification({ message: message, type: "error" });
    setTimeout(() => {
      setNotification({ message: "", type: null });
    }, 6000);
  }

  return {
    notification,
    notifySuccess,
    notifyError,
  };
}
