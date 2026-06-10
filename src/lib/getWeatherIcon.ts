import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {ComponentProps} from "react";
type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function getWeatherIcon(iconCode: string): IconName {
    switch (iconCode) {
        // Clear sky
        case "01d": return "weather-sunny";
        case "01n": return "weather-night";

        // Few clouds
        case "02d": return "weather-partly-cloudy";
        case "02n": return "weather-night-partly-cloudy";

        // Scattered / Broken clouds
        case "03d":
        case "03n":
        case "04d":
        case "04n": return "weather-cloudy";

        // Shower rain
        case "09d":
        case "09n": return "weather-pouring";

        // Rain
        case "10d": return "weather-partly-rainy";
        case "10n": return "weather-rainy";

        // Thunderstorm
        case "11d":
        case "11n": return "weather-lightning-rainy";

        // Snow
        case "13d":
        case "13n": return "weather-snowy";

        // Atmosphere (Mist, Smoke, Haze, Fog, etc.)
        case "50d":
        case "50n": return "weather-fog";

        default: return "weather-cloudy";
    }
}