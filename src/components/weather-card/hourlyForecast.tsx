import { Droplets } from 'lucide-react'
import { Card } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import type { DailyWeather } from '@/types'
import { getWeatherIcon } from '@/utils/weatherIcons'
import { formatTime } from '@/utils/formatters'

interface HourlyForecastProps {
  selectedDay: DailyWeather
}

export const HourlyForecast = ({ selectedDay }: HourlyForecastProps) => {
  const chartData = selectedDay?.hours?.map(h => ({
    time: formatTime(h.time),
    temperatura: Math.round(h.temp),
    sensacao: Math.round(h.feelslike)
  })) ?? []

  const chartConfig = {
    temperatura: {
      label: 'Temperatura',
      color: 'hsl(var(--chart-1))',
    },
    sensacao: {
      label: 'Sensação',
      color: 'hsl(var(--chart-2))',
    },
  }

  return (
    <Card className="p-4 sm:p-5 md:p-6 overflow-hidden relative">
      <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] sm:tracking-[0.3em] relative z-10 mb-3 sm:mb-4">
        Fluxo de Temperatura (24h)
      </h3>

      <div className="flex gap-4 sm:gap-6 md:gap-12 overflow-x-auto pb-3 sm:pb-4 px-1 scrollbar-hide relative z-10 touch-pan-x -mx-1">
        {selectedDay.hours && selectedDay.hours.length > 0 ? (
          selectedDay.hours.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2 group min-w-[3rem] sm:min-w-12">
              <span className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                {formatTime(h.time)}
              </span>
              <div className="transition-transform group-hover:scale-110">
                {getWeatherIcon(h.icon || selectedDay.icon, 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6')}
              </div>
              <span className="text-base sm:text-lg font-medium tracking-tighter">
                {Math.round(h.temp)}°
              </span>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Droplets className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-blue-400 flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] md:text-[12px] text-blue-400">
                  {Math.round(h.precipProb ?? 0)}%
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full py-6 sm:py-8">
            <p className="text-xs sm:text-sm text-muted-foreground">Dados horários não disponíveis</p>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="relative z-10 border-t border-border pt-3 sm:pt-4 mt-2 sm:mt-3">
          <ChartContainer config={chartConfig} className="h-40 sm:h-48 md:h-52 w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: -20, right: -20, top: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="sensacaoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ fontSize: 10 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" className="space-x-2 sm:space-x-4 md:space-x-8" />}
              />
              <Area
                type="monotone"
                dataKey="temperatura"
                stroke="var(--primary)"
                fill="transparent"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="sensacao"
                stroke="var(--chart-5)"
                fill="url(#sensacaoGradient)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}
    </Card>
  )
}
