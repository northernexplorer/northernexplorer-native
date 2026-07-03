export type ROUTES = {
  authentication: object;
  environment: {
    FieldNoteController: {
      getFieldNoteData: {
        params: {
          lat: number;
          lon: number;
        };
        response: {
          title: string;
          body: string;
        };
      };
    };
    ForecastController: {
      getForecastData: {
        params: {
          lat: number;
          lon: number;
        };
        response: unknown;
      };
    };
    LunarController: {
      getLunarData: {
        params: object;
        response: {
          phase_fraction: number;
          moon_age_days: number;
          illumination_percentage: number;
          phase_name: string;
          is_waxing: boolean;
        };
      };
    };
    WeatherController: {
      getWeatherData: {
        params: {
          lat: number;
          lon: number;
        };
        response: unknown;
      };
    };
  };
  location: {
    CityController: {
      getCityData: {
        params: {
          lat: number;
          lon: number;
        };
        response: unknown;
      };
    };
    HistoricSiteController: {
      getNearbyHistoricSites: {
        params: {
          lat: number;
          lon: number;
        };
        response: unknown;
      };
      getHistoricSiteById: {
        params: {
          id: string;
        };
        response: unknown;
      };
    };
  };
  system: object;
};
