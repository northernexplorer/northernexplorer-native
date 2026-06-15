import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationSlice";
import weatherReducer from "./slices/weatherSlice";
import forecastReducer from "./slices/forecastSlice";
import quoteReducer from "./slices/quoteSlice";
import lunarReducer from "./slices/lunarSlice";
import cityReducer from "./slices/citySlice"; // 👈 ADD THIS

export const store = configureStore({
    reducer: {
        location: locationReducer,
        weather: weatherReducer,
        forecast: forecastReducer,
        quote: quoteReducer,
        lunar: lunarReducer,
        city: cityReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;