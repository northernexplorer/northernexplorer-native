import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// This adapter handles Android, iOS, and Web fallback transparently
import AsyncStorage from '@react-native-async-storage/async-storage';

import locationReducer from './slices/locationSlice';
import weatherReducer from './slices/weatherSlice';
import forecastReducer from './slices/forecastSlice';
import fieldNoteReducer from './slices/fieldNoteSlice';
import lunarReducer from './slices/lunarSlice';
import cityReducer from './slices/citySlice';

const rootReducer = combineReducers({
  location: locationReducer,
  weather: weatherReducer,
  forecast: forecastReducer,
  fieldNote: fieldNoteReducer,
  lunar: lunarReducer,
  city: cityReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['fieldNote', 'city', 'weather', 'forecast'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 64,
      },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
