import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import commentReducer from './commentSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, commentReducer);

export const store = configureStore({
  reducer: {
    comments: persistedReducer,
  },
});

export const persistor = persistStore(store);
