export interface WeatherData {
  resolvedAddress: string;
  temperature: number;
  feelslike: number;
  high: number;
  low: number;
  condition: string;
  description: string;
  icon: string;
  windSpeed: number;
  windGust: number;
  windDir: number;
  precip: number;
  precipProb: number;
  precipProbDay: number;
  precipType: string[] | null;
  snow: number;
  snowDepth: number;
  humidity: number;
  pressure: number;
  visibility: number;
  cloudCover: number;
  dew: number;
  uvIndex: number;
  solarRadiation: number;
  solarEnergy: number;
  sunrise: string;
  sunset: string;
  moonPhase: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  time: string;
  epoch?: number;
  temp: number;
  feelslike: number;
  condition: string;
  icon: string;
  precipProb: number;
  precipType: string[] | null;
  windSpeed: number;
  windGust: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
}

export interface DailyForecast {
  day: string;
  epoch: number;
  high: number;
  low: number;
  temp: number;
  feelslikeMax: number;
  feelslikeMin: number;
  condition: string;
  description: string;
  icon: string;
  precipProb: number;
  precipCover: number;
  precipType: string[] | null;
  snow: number;
  windSpeed: number;
  windGust: number;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  moonPhase: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  severeRisk: number;
  hours?: HourlyForecast[];
}

