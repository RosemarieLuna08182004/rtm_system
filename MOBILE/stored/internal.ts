import { createSlice } from '@reduxjs/toolkit'
import { APP_INTERNAL } from '../constants'
import { Internal } from '../types'

const initialState: Internal = {
  storeLoaded: false
}

const internal = createSlice({
  name: APP_INTERNAL,
  initialState,
  reducers: {
    setStoreLoadedTrue: (state) => {
      state.storeLoaded = true
    }
  }
})

export const { setStoreLoadedTrue } = internal.actions
export default internal.reducer
