export default function Notification({ messageType, message }) {
  return (
    <div className={messageType}>
      <h2>{message}</h2>
    </div>
  )
}