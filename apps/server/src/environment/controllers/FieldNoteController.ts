import { Request, Response } from 'express';
import { Repositories } from '../../core/typeHelpers';

export class FieldNoteController {
  constructor(private repos: Repositories) {}

  public async getFieldNoteData(req: Request, res: Response) {
    const lat = res.locals.lat;
    const lon = res.locals.lon;

    const weather = await this.repos.weather.getWeatherCache(lat, lon);
    if (!weather.current) throw new Error('Weather data not found');

    const temp =
      weather.current?.temp_c !== undefined ? parseFloat(String(weather.current.temp_c)) : 999;
    const wind = weather.current.wind_kph ?? 0;
    const clouds = weather.current.cloud ?? 0;
    const humidity = weather.current.humidity ?? 0;
    const visibility = weather.current.vis_km ?? 10;
    const description = (weather.current.condition?.text ?? '').toLowerCase();

    // Rule 1: Storm / severe conditions
    if (description.includes('thunder') || description.includes('storm')) {
      return {
        title: 'Atmospheric Instability',
        body: 'Thunder activity suggests rapidly shifting atmospheric conditions. Field conditions may change quickly.',
      };
    }

    // Rule 2: Rain / precipitation
    if (
      description.includes('rain') ||
      description.includes('drizzle') ||
      description.includes('showers')
    ) {
      return {
        title: 'Moisture in the Air',
        body: 'Precipitation is actively shaping the landscape and reducing visibility in the field.',
      };
    }

    // Rule 3: Snow conditions
    if (
      description.includes('snow') ||
      description.includes('blizzard') ||
      description.includes('flurries')
    ) {
      return {
        title: 'Winter Surface Activity',
        body: 'Snowfall is altering terrain visibility and insulating the ground layer.',
      };
    }

    // Rule 4: Fog / low visibility
    if (description.includes('fog') || description.includes('mist') || visibility < 2) {
      return {
        title: 'Reduced Visibility Zone',
        body: 'Atmospheric moisture or fog is limiting long-range visual clarity in the field.',
      };
    }

    // Rule 5: Overcast / Heavy Cloud
    if (description.includes('overcast') || description.includes('cloudy') || clouds > 80) {
      if (description.includes('overcast') || clouds > 80) {
        return {
          title: 'Overcast Layer Present',
          body: 'Dense cloud cover is diffusing sunlight and flattening visual contrast.',
        };
      }
      return {
        title: 'Heavy Cloud Strata',
        body: 'Thickening cloud layers dominate the sky, significantly reducing direct sunlight.',
      };
    }

    // Rule 6: Partly Cloudy / Variable Sky Cover
    if (description.includes('partly') || (clouds > 10 && clouds <= 50)) {
      return {
        title: 'Variable Sky Cover',
        body: 'Broken cloud layers are creating shifting light conditions across the terrain.',
      };
    }

    // Rule 7: Clear skies
    if (clouds <= 10) {
      return {
        title: 'Open Sky Conditions',
        body: 'Minimal cloud cover allows for unobstructed atmospheric observation.',
      };
    }

    // Rule 8: Windy conditions
    if (wind >= 30) {
      return {
        title: 'High Wind Activity',
        body: 'Strong winds are actively influencing surface movement and air stability.',
      };
    }

    // Rule 9: Cold conditions
    if (temp !== 999 && temp <= 0) {
      return {
        title: 'Subzero Environment',
        body: 'Freezing temperatures dominate surface conditions and slow atmospheric dynamics.',
      };
    }

    // Rule 10: Hot / warm calm conditions
    if (temp !== 999 && temp >= 25 && wind < 15) {
      return {
        title: 'Stable Warm Air Mass',
        body: 'Warm, calm air conditions are supporting stable and comfortable field observation.',
      };
    }

    // Rule 11: Humid conditions
    if (humidity >= 80) {
      return {
        title: 'High Atmospheric Moisture',
        body: 'Elevated humidity is thickening the air and reducing evaporative clarity.',
      };
    }

    // Rule 12: Default fallback
    return {
      title: 'Standard Field Conditions',
      body: 'No significant atmospheric anomalies detected. Conditions remain within typical regional patterns.',
    };
  }
}
