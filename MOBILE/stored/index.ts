import { combineReducers, configureStore } from '@reduxjs/toolkit'
import internalReducer from './internal'
import managerReducer from './manager'
import chapterReducer from './chapter'
import termReducer from './term'
import termLineReducer from './termLine'
import bookmarkReducer from './bookmark'
import userTermsReducer from './userTerms'
import logger from 'redux-logger'

const systemReducer = combineReducers({
  manager: managerReducer,
  internal: internalReducer,
})

const store = configureStore({
  reducer: {
    chapter: chapterReducer,
    terms: termReducer,
    termLine: termLineReducer,
    userTerms: userTermsReducer,
    bookmarks: bookmarkReducer,
    systems: systemReducer
  },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store
