export type LunarCyclePayload = {
    phase_fraction: number;          // Position in cycle (0.0 to 1.0)
    moon_age_days: number;           // Days since last New Moon (0 to 29.53)
    illumination_percentage: number; // Visibility score (0% to 100%)
    phase_name: string;              // Text display
    is_waxing: boolean;              // True if growing, False if shrinking
};

export async function getLunarCycle(): Promise<LunarCyclePayload> {
    const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("EXPO_PUBLIC_SERVER_URL is not defined.");
    }

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("type", "lunar");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Lunar fetch failed: ${res.status}`);
    }

    return res.json() as Promise<LunarCyclePayload>;
}