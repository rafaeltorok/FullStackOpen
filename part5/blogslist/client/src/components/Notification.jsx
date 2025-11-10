export default function Notification({ messageType, message }) {
  return (
    <div>
      <h2 className={messageType}>{message}</h2>
    </div>
  )
}