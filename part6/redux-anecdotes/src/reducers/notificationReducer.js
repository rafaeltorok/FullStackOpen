import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',  // empty string = no notification
  reducers: {
    setNotification(state, action) {
      return action.payload  // the message to show
    },
    clearNotification() {
      return ''  // hide notification
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer