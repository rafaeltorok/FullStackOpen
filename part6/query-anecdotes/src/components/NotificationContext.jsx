import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  
  let timeoutId
  
  const setNotification = (message, duration) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    notificationDispatch({ type: 'SHOW', payload: message })
    
    timeoutId = setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, duration * 1000)
  }
  
  return setNotification
}

export default NotificationContext