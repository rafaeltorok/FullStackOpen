export default function Notification({ messageType, notification }){
  if (!notification) return null;
  return (
    <div role="alert">
      <p className={messageType}>{notification}</p>
    </div>
  );
}