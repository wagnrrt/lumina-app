export interface HourlyWeather {
  time: string
  temp: number
  feelslike: number
  precipProb: number
  icon: string
}

export interface DailyWeather {
  icon: string
  condition: string
  description: string
  temp: number
  high: number
  low: number
  feelslikeMax: number
  feelslikeMin: number
  precipProb: number
  snow: number
  windSpeed: number
  windGust: number
  humidity: number
  uvIndex: number
  visibility: number
  pressure: number
  cloudCover: number
  sunrise: string
  sunset: string
  moonPhase: number
  severeRisk: number
  hours?: HourlyWeather[]
}

export interface WeatherData {
  resolvedAddress: string
  temperature: number
  feelslike: number
  icon: string
  visibility: number
  pressure: number
  cloudCover: number
  daily: DailyWeather[]
}
