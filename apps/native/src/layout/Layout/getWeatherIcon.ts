import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Maps WeatherAPI condition codes to MaterialCommunityIcons.
 * @param code Numeric condition code from WeatherAPI
 * @param isDay Optional 1 (day) or 0 (night) flag to toggle day/night variations
 */
export function getWeatherIcon(code: string | number, isDay: number = 1): IconName {
    const numericCode = Number(code);

    switch (numericCode) {
        // Clear / Sunny
        case 1000:
            return isDay ? 'weather-sunny' : 'weather-night';

        // Partly Cloudy
        case 1003:
            return isDay ? 'weather-partly-cloudy' : 'weather-night-partly-cloudy';

        // Cloudy / Overcast
        case 1006:
        case 1009:
            return 'weather-cloudy';

        // Mist / Fog / Freezing Fog
        case 1030:
        case 1135:
        case 1147:
            return 'weather-fog';

        // Patchy rain / Drizzle / Light Rain
        case 1063:
        case 1150:
        case 1153:
        case 1168:
        case 1171:
        case 1180:
        case 1183:
        case 1186:
            return isDay ? 'weather-partly-rainy' : 'weather-rainy';

        // Moderate or Heavy Rain / Showers / Torrential
        case 1189:
        case 1192:
        case 1195:
        case 1240:
        case 1243:
        case 1246:
            return 'weather-pouring';

        // Thunderstorms (with or without rain/hail)
        case 1087:
        case 1273:
        case 1276:
        case 1279:
        case 1282:
            return 'weather-lightning-rainy';

        // Snow / Sleet / Ice Pellets / Blizzards (All varieties)
        case 1066:
        case 1069:
        case 1072:
        case 1114:
        case 1117:
        case 1198:
        case 1201:
        case 1204:
        case 1207:
        case 1210:
        case 1213:
        case 1216:
        case 1219:
        case 1222:
        case 1225:
        case 1237:
        case 1249:
        case 1252:
        case 1255:
        case 1258:
        case 1261:
        case 1264:
            return 'weather-snowy';

        default:
            return 'weather-cloudy';
    }
}
