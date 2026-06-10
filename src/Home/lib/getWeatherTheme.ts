export function getWeatherTheme(main: string) {
    switch (main.toLowerCase()) {
        case "rain":
        case "drizzle":
            return {
                overlay: "rgba(0,0,40,0.55)",
                tint: "#4a6fa5",
                image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
            };

        case "clouds":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#6b7c8f",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };

        case "clear":
            return {
                overlay: "rgba(0,0,0,0.25)",
                tint: "#f6c453",
                image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            };

        case "snow":
            return {
                overlay: "rgba(0,0,0,0.35)",
                tint: "#e8f0ff",
                image: "https://images.unsplash.com/photo-1608889175157-718b6205a1c7",
            };

        default:
            return {
                overlay: "rgba(0,0,0,0.5)",
                tint: "#999",
                image: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31",
            };
    }
}