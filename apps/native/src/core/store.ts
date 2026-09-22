import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locationReducer from '~/location/state/location/locationSlice';
import mapReducer from '~/location/state/map/mapSlice';
import weatherReducer from '~/environment/state/weather/weatherSlice';
import lunarReducer from '~/environment/state/lunar/lunarSlice';
import cityReducer from '~/location/state/city/citySlice';
import authenticationReducer from '~/user/state/authentication/authenticationSlice';

const rootReducer = combineReducers({
	location: locationReducer,
	weather: weatherReducer,
	lunar: lunarReducer,
	city: cityReducer,
	authentication: authenticationReducer,
	map: mapReducer,
});

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['city', 'weather', 'authentication'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
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
