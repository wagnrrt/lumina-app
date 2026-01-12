import { MapPin, ChevronUp, ChevronDown, Droplets, Snowflake } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { formatFullDate } from '../../utils/formatters'
import { getWeatherIcon } from '@/utils/weatherIcons'
import type { DailyWeather, WeatherData } from '@/types'

interface MainWeatherCardProps {
  weather: WeatherData
  selectedDay: DailyWeather
  selectedDayIndex: number
}

export const MainWeatherCard = ({ weather, selectedDay, selectedDayIndex }: MainWeatherCardProps) => {
  return (
    <Card className="p-4 sm:p-5 md:p-6 relative overflow-hidden flex flex-col">
      <div className="absolute -right-8 sm:-right-12 -top-8 sm:-top-12 opacity-[0.03] pointer-events-none">
        {getWeatherIcon(
          selectedDay.icon || selectedDay.icon,
          'w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80'
        )}
      </div>

      <CardTitle className="relative z-10 flex justify-between items-start">
        <div className="w-full space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-4">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
              {formatFullDate(selectedDayIndex)}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate">
                {weather.resolvedAddress}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tighter">
              {Math.round(selectedDay.temp)}°
            </h2>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 flex-shrink-0" />
                <span className="text-lg sm:text-xl md:text-2xl font-light text-red-400">
                  {Math.round(selectedDay.high)}°
                </span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 flex-shrink-0" />
                <span className="text-lg sm:text-xl md:text-2xl font-light text-blue-400">
                  {Math.round(selectedDay.low)}°
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardTitle>

      <div className="space-y-1 relative z-10 mt-3 sm:mt-4">
        <p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight">{selectedDay.condition}</p>
        <p className="text-xs sm:text-sm line-clamp-2 md:line-clamp-none">{selectedDay.description}</p>
        <div className="flex items-center gap-3 sm:gap-4 pt-1.5 sm:pt-2 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-blue-400 whitespace-nowrap">
              {Math.round(selectedDay.precipProb)}% precipitação
            </span>
          </div>
          {selectedDay.snow > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Snowflake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-cyan-400 whitespace-nowrap">
                {selectedDay.snow} cm neve
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
