import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './slices/nodesSlice';
import paletteReducer from './slices/paletteSlice';

export const store = configureStore({
  reducer: {
    workflow: nodesReducer,
    palette: paletteReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;