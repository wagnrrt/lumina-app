import { Droplets, CloudSnow, ChevronUp, ChevronDown } from 'lucide-react'
import { Card } from '../ui/card'
import type { DailyWeather } from '@/types'
import { formatDateBR } from '@/utils/formatters'
import { getWeatherIcon } from '@/utils/weatherIcons'

interface ForecastSidebarProps {
  daily: DailyWeather[]
  selectedDayIndex: number
  onSelectDay: (index: number) => void
  weatherIcon: string
}

export const ForecastSidebar = ({ daily, selectedDayIndex, onSelectDay, weatherIcon }: ForecastSidebarProps) => {
  return (
    <div className="w-full lg:w-80 xl:w-96">
      <Card className="px-4 sm:px-6 flex flex-col h-full">
        <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em]">
          Previsão 15 Dias
        </h3>

        <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 pt-3 sm:pt-4 overflow-y-auto pr-1 sm:pr-2 pb-4 sm:pb-6">
          {daily.map((d, i) => (
            <div
              key={i}
              onClick={() => onSelectDay(i)}
              className={`
                flex items-center justify-between group py-2 px-2 sm:px-3 md:px-6 rounded-lg transition-all cursor-pointer
                ${selectedDayIndex === i
                  ? 'bg-primary/20 border-l-2 border-primary'
                  : 'hover:bg-accent/5'
                }
              `}
            >
              <div className="space-y-0.5 min-w-0 flex-shrink">
                <p className={`
                  text-[10px] sm:text-xs md:text-[14px] font-bold uppercase tracking-tight transition-colors truncate
                  ${selectedDayIndex === i
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-white'
                  }
                `}>
                  {i === 0 ? 'Hoje' : formatDateBR(i)}
                </p>
                <div className="flex items-center gap-1">
                  <Droplets className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-400 flex-shrink-0" />
                  <span className="text-[9px] sm:text-[10px] md:text-[12px] text-blue-400">
                    {Math.round(d.precipProb)}%
                  </span>
                </div>
                {d.snow > 0 && (
                  <div className="flex items-center gap-1">
                    <CloudSnow className="w-2 h-2 sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                    <span className="text-[7px] sm:text-[8px] text-cyan-400">{d.snow} cm</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0">
                {getWeatherIcon(d.icon || weatherIcon, 'w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5')}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 w-12 sm:w-14 md:w-16 justify-end">
                  <div className="flex items-center gap-0.5">
                    <ChevronUp className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-400 flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold">
                      {Math.round(d.high)}°
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <ChevronDown className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-blue-400 flex-shrink-0" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                      {Math.round(d.low)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
