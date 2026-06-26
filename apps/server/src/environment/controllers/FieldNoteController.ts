import { Request, Response, NextFunction } from 'express';
import { WeatherController } from './WeatherController';

interface FieldNoteDataPayload {
  current?: {
    temp_c?: string | number;
    wind_kph?: number;
    cloud?: number;
    humidity?: number;
    vis_km?: number;
    condition?: {
      text?: string;
    };
  };
}

export class FieldNoteController {
  public static async getFieldNoteData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const lat = res.locals.lat;
      const lon = res.locals.lon;

      // Cast the record through unknown into our specific weather payload interface
      const weather = (await WeatherController.getInternalWeatherData(
        lat,
        lon,
      )) as unknown as FieldNoteDataPayload;

      if (!weather || !weather.current) {
        res.json({
          title: 'Standard Field Conditions',
          body: 'Unable to retrieve real-time atmospheric data. Proceed with typical regional baselines.',
        });
        return;
      }

      // Map WeatherAPI properties safely with fallbacks
      const temp =
        weather.current.temp_c !== undefined ? parseFloat(String(weather.current.temp_c)) : 999;
      const wind = weather.current.wind_kph ?? 0;
      const clouds = weather.current.cloud ?? 0;
      const humidity = weather.current.humidity ?? 0;
      const visibility = weather.current.vis_km ?? 10;
      const description = (weather.current.condition?.text ?? '').toLowerCase();

      // Rules Evaluation Engine (Ordered by priority matching your PHP logic)

      // Rule 1: Storm / severe conditions
      if (description.includes('thunder') || description.includes('storm')) {
        res.json({
          title: 'Atmospheric Instability',
          body: 'Thunder activity suggests rapidly shifting atmospheric conditions. Field conditions may change quickly.',
        });
        return;
      }

      // Rule 2: Rain / precipitation
      if (
        description.includes('rain') ||
        description.includes('drizzle') ||
        description.includes('showers')
      ) {
        res.json({
          title: 'Moisture in the Air',
          body: 'Precipitation is actively shaping the landscape and reducing visibility in the field.',
        });
        return;
      }

      // Rule 3: Snow conditions
      if (
        description.includes('snow') ||
        description.includes('blizzard') ||
        description.includes('flurries')
      ) {
        res.json({
          title: 'Winter Surface Activity',
          body: 'Snowfall is altering terrain visibility and insulating the ground layer.',
        });
        return;
      }

      // Rule 4: Fog / low visibility
      if (description.includes('fog') || description.includes('mist') || visibility < 2) {
        res.json({
          title: 'Reduced Visibility Zone',
          body: 'Atmospheric moisture or fog is limiting long-range visual clarity in the field.',
        });
        return;
      }

      // Rule 5: Overcast / Heavy Cloud
      if (description.includes('overcast') || description.includes('cloudy') || clouds > 80) {
        if (description.includes('overcast') || clouds > 80) {
          res.json({
            title: 'Overcast Layer Present',
            body: 'Dense cloud cover is diffusing sunlight and flattening visual contrast.',
          });
          return;
        }
        res.json({
          title: 'Heavy Cloud Strata',
          body: 'Thickening cloud layers dominate the sky, significantly reducing direct sunlight.',
        });
        return;
      }

      // Rule 6: Partly Cloudy / Variable Sky Cover
      if (description.includes('partly') || (clouds > 10 && clouds <= 50)) {
        res.json({
          title: 'Variable Sky Cover',
          body: 'Broken cloud layers are creating shifting light conditions across the terrain.',
        });
        return;
      }

      // Rule 7: Clear skies
      if (clouds <= 10) {
        res.json({
          title: 'Open Sky Conditions',
          body: 'Minimal cloud cover allows for unobstructed atmospheric observation.',
        });
        return;
      }

      // Rule 8: Windy conditions
      if (wind >= 30) {
        res.json({
          title: 'High Wind Activity',
          body: 'Strong winds are actively influencing surface movement and air stability.',
        });
        return;
      }

      // Rule 9: Cold conditions
      if (temp !== 999 && temp <= 0) {
        res.json({
          title: 'Subzero Environment',
          body: 'Freezing temperatures dominate surface conditions and slow atmospheric dynamics.',
        });
        return;
      }

      // Rule 10: Hot / warm calm conditions
      if (temp !== 999 && temp >= 25 && wind < 15) {
        res.json({
          title: 'Stable Warm Air Mass',
          body: 'Warm, calm air conditions are supporting stable and comfortable field observation.',
        });
        return;
      }

      // Rule 11: Humid conditions
      if (humidity >= 80) {
        res.json({
          title: 'High Atmospheric Moisture',
          body: 'Elevated humidity is thickening the air and reducing evaporative clarity.',
        });
        return;
      }

      // Rule 12: Default fallback
      res.json({
        title: 'Standard Field Conditions',
        body: 'No significant atmospheric anomalies detected. Conditions remain within typical regional patterns.',
      });
    } catch (error) {
      next(error);
    }
  }
}
