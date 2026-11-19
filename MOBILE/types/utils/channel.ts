import { PayloadAction } from '@reduxjs/toolkit'
import { Channel, ChannelAPI, StoreAPI } from '../store'

export function setLocalAndStateReducer<T>(sliceName: string) {
  return (_: any, action: PayloadAction<T>) => {
    StoreAPI.send(Channel.setStoreValue, { key: sliceName, state: action.payload })
    return action.payload
  }
}

export const getFailChannel = (channel: ChannelAPI) => `${channel}-fail`
export const getSuccessChannel = (channel: ChannelAPI) => `${channel}-success`
