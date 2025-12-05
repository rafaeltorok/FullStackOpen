import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const { notification } = useContext(NotificationContext)

  if (!notification) {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification