import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {QuoteType} from "~/state/hooks/get/getQuote";

type QuoteState = {
    data: QuoteType | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
};

const initialState: QuoteState = {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const quoteSlice = createSlice({
    name: "quote",
    initialState,
    reducers: {
        setQuote(state, action: PayloadAction<QuoteType>) {
            state.data = action.payload;
            state.lastUpdated = Date.now();
        },
        setQuoteLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setQuoteError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const {
    setQuote,
    setQuoteLoading,
    setQuoteError,
} = quoteSlice.actions;

export default quoteSlice.reducer;