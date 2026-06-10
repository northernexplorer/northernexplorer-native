export interface WeatherTheme {
    overlay: string;
    tint: string;
    image: string;
}

export function getWeatherTheme(main: string): WeatherTheme {
    switch (main.toLowerCase()) {
        case "thunderstorm":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "images/thunderstorm.png",
            };
        case "rain":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "images/rain.png",
            };
        case "drizzle":
            return {
                overlay: "rgba(0,0,40,0.55)",
                tint: "#4a6fa5",
                image: "images/drizzle.png",
            };

        case "snow":
            return {
                overlay: "rgba(0,0,0,0.35)",
                tint: "#e8f0ff",
                image: "images/snow.png",
            };

        case "clear":
            return {
                overlay: "rgba(0,0,0,0.25)",
                tint: "#f6c453",
                image: "images/clear.png",
            };

        case "clouds":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#6b7c8f",
                image: "images/clouds.png",
            };

        case "mist":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "images/mist.png",
            };
        case "smoke":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "images/smoke.png",
            };
        case "haze":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "images/haze.png",
            };
        case "dust":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };
        case "fog":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };
        case "sand":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };
        case "ash":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };
        case "squall":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };
        case "tornado":
            return {
                overlay: "rgba(0,0,0,0.45)",
                tint: "#7f8c8d",
                image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
            };

        default:
            return {
                overlay: "rgba(0,0,0,0.5)",
                tint: "#999",
                image: "images/clear.png",
            };
    }
}