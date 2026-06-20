export interface WeatherTheme {
  overlay: string;
  tint: string;
  image: string;
}

export function getWeatherTheme(code: number): WeatherTheme {
  // Clear / Sunny
  if (code === 1000) {
    return {
      overlay: 'rgba(0,0,0,0.25)',
      tint: '#f6c453',
      image: '/images/weather/clear.png',
    };
  }

  // Clouds (Partly Cloudy, Cloudy, Overcast)
  if ([1003, 1006, 1009].includes(code)) {
    return {
      overlay: 'rgba(0,0,0,0.45)',
      tint: '#6b7c8f',
      image: '/images/weather/clouds.png',
    };
  }

  // Mist / Fog / Freezing Fog
  if ([1030, 1135, 1147].includes(code)) {
    return {
      overlay: 'rgba(0,0,0,0.45)',
      tint: '#7f8c8d',
      image: '/images/weather/fog.png',
    };
  }

  // Thunderstorms (Thundery outbreaks, Rain/Snow with thunder)
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return {
      overlay: 'rgba(0,0,0,0.45)',
      tint: '#7f8c8d',
      image: '/images/weather/thunderstorm.png',
    };
  }

  // Drizzle / Light Rain / Freezing Drizzle
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186].includes(code)) {
    return {
      overlay: 'rgba(0,0,40,0.55)',
      tint: '#4a6fa5',
      image: '/images/weather/drizzle.png',
    };
  }

  // Moderate / Heavy / Torrential Rain
  if ([1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
    return {
      overlay: 'rgba(0,0,0,0.45)',
      tint: '#7f8c8d',
      image: '/images/weather/rain.png',
    };
  }

  // Snow / Sleet / Blizzards / Ice Pellets
  if (
    [
      1066, 1069, 1072, 1114, 1117, 1198, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225,
      1237, 1249, 1252, 1255, 1258, 1261, 1264,
    ].includes(code)
  ) {
    return {
      overlay: 'rgba(0,0,0,0.35)',
      tint: '#e8f0ff',
      image: '/images/weather/snow.png',
    };
  }

  // Default Fallback
  return {
    overlay: 'rgba(0,0,0,0.5)',
    tint: '#999',
    image: '/images/weather/clear.png',
  };
}
