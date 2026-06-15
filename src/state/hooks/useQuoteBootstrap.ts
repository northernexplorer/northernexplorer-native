import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/state/storeHooks";
import {
    setQuote,
    setQuoteLoading,
    setQuoteError,
} from "~/state/slices/quoteSlice";
import { getQuote } from "./get/getQuote";

const STALE_TIME = 1000 * 60 * 60; // 1 hour (quotes change rarely)

export function useQuoteBootstrap() {
    const dispatch = useAppDispatch();
    const { data, lastUpdated } = useAppSelector((s) => s.quote);

    useEffect(() => {
        const isStale =
            !lastUpdated ||
            Date.now() - lastUpdated > STALE_TIME;

        if (data && !isStale) return;

        let cancelled = false;

        async function run() {
            try {
                dispatch(setQuoteLoading(true));

                const result = await getQuote();

                if (cancelled) return;

                dispatch(setQuote(result));
            } catch (e) {
                if (!cancelled) {
                    dispatch(setQuoteError("Failed to fetch quote"));
                }
            } finally {
                if (!cancelled) {
                    dispatch(setQuoteLoading(false));
                }
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [data, lastUpdated, dispatch]);
}