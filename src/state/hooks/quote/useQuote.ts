import { useAppSelector } from "~/state/storeHooks";

export function useQuote() {
    return useAppSelector((s) => s.quote.data);
}