import { useEffect, useState } from "react";
import { getLunarCycle, type LunarCyclePayload } from "./getLunarCycle";

export function useLunarCycle() {
    const [data, setData] = useState<LunarCyclePayload | null>(null);

    useEffect(() => {
        (async () => {
            const lunar = await getLunarCycle();
            setData(lunar);
        })();
    }, []);

    return data;
}