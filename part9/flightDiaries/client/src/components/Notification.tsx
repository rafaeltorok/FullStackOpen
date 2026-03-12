interface NotificationProps {
  notification: {
    message: string;
    type: string;
  }
}

export default function Notification(props: NotificationProps) {
  return (
    <div className={props.notification.type}>
      <p>{props.notification.message}</p>
    </div>
  );
}