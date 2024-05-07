// store.ts

import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';

const rootReducer = {
  search: searchReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;