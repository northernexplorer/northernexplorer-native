import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldNoteType } from '@northernexplorer/types';

type FieldNoteState = {
    data: FieldNoteType | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
};

const initialState: FieldNoteState = {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const fieldNoteSlice = createSlice({
    name: 'fieldNote',
    initialState,
    reducers: {
        setFieldNote(state, action: PayloadAction<FieldNoteType>) {
            state.data = action.payload;
            state.lastUpdated = Date.now();
        },
        setFieldNoteLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setFieldNoteError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setFieldNote, setFieldNoteLoading, setFieldNoteError } = fieldNoteSlice.actions;

export default fieldNoteSlice.reducer;
