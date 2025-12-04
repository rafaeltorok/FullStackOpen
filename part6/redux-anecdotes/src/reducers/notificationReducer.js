import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

const { showNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    dispatch(showNotification(message))
    
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, duration * 1000)
  }
}

export default notificationSlice.reducer