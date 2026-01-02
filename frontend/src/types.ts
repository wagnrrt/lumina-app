export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface LocationSuggestion {
  address: string
  city?: string
  state?: string
  country: string
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
}
