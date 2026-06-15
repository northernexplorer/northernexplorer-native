import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Coords {
    lat: number;
    lon: number;
}

interface LocationState {
    coords: Coords | null;
}

const initialState: LocationState = {
    coords: null,
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setCoords(state, action: PayloadAction<Coords>) {
            state.coords = action.payload;
        },
    },
});

export const { setCoords } = locationSlice.actions;
export default locationSlice.reducer;