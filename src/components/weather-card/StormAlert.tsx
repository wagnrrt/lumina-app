import { CloudLightning } from 'lucide-react'
import type { DailyWeather } from '@/types'
import { getSevereRiskLevel } from '@/utils/formatters'
import { Card } from '../ui/card'

interface StormAlertProps {
  selectedDay: DailyWeather
}

export const StormAlert = ({ selectedDay }: StormAlertProps) => {
  const riskLevel = getSevereRiskLevel(selectedDay.severeRisk)

  const getRiskMessage = (risk: number) => {
    if (risk < 30) return 'Condições normais esperadas'
    if (risk < 60) return 'Atenção para possíveis tempestades'
    return 'Alto risco de condições severas - mantenha-se atento'
  }

  return (
    <Card className="p-3 sm:p-4 md:p-6 relative overflow-hidden h-full">
      <div className="absolute -right-4 sm:-right-6 -bottom-4 sm:-bottom-6 opacity-[0.03] pointer-events-none">
        <CloudLightning className="w-24 h-24 sm:w-32 sm:h-32" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-1.5 sm:gap-2 pb-4 sm:pb-6">
          <CloudLightning className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] md:text-[12px] font-bold text-secondary-foreground uppercase tracking-widest">
            Alerta de Tempestade
          </span>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-[12px] sm:text-[14px] text-muted-foreground uppercase min-w-12 sm:min-w-16 md:min-w-24">
                Risco Severo
              </span>
              <div className="flex-1 min-w-0">
                <div className="w-full h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${riskLevel.bg}`}
                    style={{ width: `${selectedDay.severeRisk}%` }}
                  />
                </div>
              </div>
              <span className={`text-[12px] sm:text-xs md:text-xl font-medium text-right ${riskLevel.color}`}>
                {riskLevel.label}
              </span>
            </div>

            <p className="text-[8px] sm:text-[10px] md:text-[12px] text-muted-foreground uppercase leading-relaxed">
              {getRiskMessage(selectedDay.severeRisk)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
