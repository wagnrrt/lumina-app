import { type JSX } from 'react'
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  Cloudy
} from 'lucide-react'

export const getWeatherIcon = (condition: string, className: string = 'w-8 h-8'): JSX.Element => {
  const ICON_MAP: Record<string, JSX.Element> = {
    'clear-day': <Sun className={className} />,
    'clear-night': <Moon className={className} />,
    'partly-cloudy-day': <CloudSun className={className} />,
    'partly-cloudy-night': <CloudMoon className={className} />,
    'cloudy': <Cloudy className={className} />,
    'rain': <CloudRain className={className} />,
    'showers-day': <CloudRain className={className} />,
    'showers-night': <CloudDrizzle className={className} />,
    'thunder-rain': <CloudLightning className={className} />,
    'thunder': <CloudLightning className={className} />,
    'snow': <CloudSnow className={className} />,
    'fog': <CloudFog className={className} />,
    'wind': <Wind className={className} />
  }

  return ICON_MAP[condition] || <Cloud className={className} />
}
