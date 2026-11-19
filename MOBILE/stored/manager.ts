import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { APP_MANAGER } from '@/constants'
import { appManagerInitialState } from '@/shared'
import { Channel, StoreAPI, Manager } from '@/types/store'
import { setLocalAndStateReducer } from '@/types'

const manager = createSlice({
    name: APP_MANAGER,
    initialState: appManagerInitialState,
    reducers: {
        setHasOnboarded: ( state: Manager, { payload: hasOnboarded }: PayloadAction<boolean>  ) => { state.hasOnboarded = hasOnboarded;},
        setManager: setLocalAndStateReducer<Manager>(APP_MANAGER)
    }
})

export const { setHasOnboarded } = manager.actions
export default manager.reducer
  