import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind
} from 'lucide-react'

export const ICON_MAP: Record<string, JSX.Element> = {
  'clear-day': <Sun className="w-8 h-8" />,
  'clear-night': <Moon className="w-8 h-8" />,

  'partly-cloudy-day': <Cloud className="w-8 h-8" />,
  'partly-cloudy-night': <Cloud className="w-8 h-8" />,

  cloudy: <Cloud className="w-8 h-8" />,

  rain: <CloudRain className="w-8 h-8" />,
  'showers-day': <CloudRain className="w-8 h-8" />,
  'showers-night': <CloudRain className="w-8 h-8" />,

  'thunder-rain': <CloudLightning className="w-8 h-8" />,

  snow: <CloudSnow className="w-8 h-8" />,

  fog: <CloudFog className="w-8 h-8" />,

  wind: <Wind className="w-8 h-8" />
}

