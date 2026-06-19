import { config } from "~/config";
import { EndpointType } from "@northernexplorer/shared";

export type LunarCycleType = {
    phase_fraction: number;          // Position in cycle (0.0 to 1.0)
    moon_age_days: number;           // Days since last New Moon (0 to 29.53)
    illumination_percentage: number; // Visibility score (0% to 100%)
    phase_name: string;              // Text display
    is_waxing: boolean;              // True if growing, False if shrinking
};

export async function getLunarCycle(): Promise<LunarCycleType> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/api/${EndpointType.Lunar}`);

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Lunar fetch failed: ${res.status}`);
    }

    return res.json() as Promise<LunarCycleType>;
}