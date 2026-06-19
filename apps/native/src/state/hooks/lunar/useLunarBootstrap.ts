import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/state/storeHooks";
import {
    setLunar,
    setLunarLoading,
    setLunarError,
} from "~/state/slices/lunarSlice";
import { getLunarCycle } from "./getLunarCycle";

const STALE_TIME = 1000 * 60 * 60 * 6; // lunar data changes rarely

export function useLunarBootstrap() {
    const dispatch = useAppDispatch();
    const { data, lastUpdated } = useAppSelector((s) => s.lunar);

    useEffect(() => {
        const isStale =
            !lastUpdated ||
            Date.now() - lastUpdated > STALE_TIME;

        if (data && !isStale) return;

        let cancelled = false;

        async function run() {
            try {
                dispatch(setLunarLoading(true));

                const result = await getLunarCycle();

                if (cancelled) return;

                dispatch(setLunar(result));
            } catch {
                if (!cancelled) {
                    dispatch(setLunarError("Failed to fetch lunar data"));
                }
            } finally {
                if (!cancelled) {
                    dispatch(setLunarLoading(false));
                }
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [data, lastUpdated, dispatch]);
}