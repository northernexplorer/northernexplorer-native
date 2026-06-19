import { useAppSelector } from "~/state/storeHooks";

export function useLunar() {
    return useAppSelector((s) => s.lunar.data);
}