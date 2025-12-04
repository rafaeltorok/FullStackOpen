import { useSelector } from "react-redux"

export default function Notification() {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  return (
    <div style={style}>
      <p>{notification}</p>
    </div>
  )
}