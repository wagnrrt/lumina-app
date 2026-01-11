import * as React from 'react'
import { type JSX } from 'react'
import { Card } from '../ui/card'

interface MetricCardProps {
  icon: JSX.Element
  label: string
  value: string
  unit?: string
  sub: string
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, unit, sub }) => (
  <Card className="p-3 sm:p-4 md:p-6 flex flex-col justify-between relative overflow-hidden min-h-[100px] sm:min-h-[110px] md:min-h-[120px]">
    <div className="absolute -right-3 -bottom-3 sm:-right-4 sm:-bottom-4 md:-right-6 md:-bottom-6 opacity-[0.03] pointer-events-none">
      {React.cloneElement(icon, { className: 'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32' })}
    </div>

    <div className="space-y-0.5 relative z-10">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="text-primary flex-shrink-0">{icon}</div>
        <span className="text-[9px] sm:text-[10px] md:text-[12px] font-bold text-secondary-foreground uppercase tracking-widest truncate">
          {label}
        </span>
      </div>
      <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground uppercase leading-relaxed line-clamp-1">
        {sub}
      </p>
    </div>
    <div className="flex items-baseline gap-0.5 sm:gap-1 mt-2 sm:mt-3 md:mt-4 relative z-10">
      <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight">{value}</span>
      {unit && (
        <span className="text-[7px] sm:text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase">
          {unit}
        </span>
      )}
    </div>
  </Card>
)

interface MetricSubProps {
  icon: JSX.Element
  label: string
  value: string
}

export const MetricSub: React.FC<MetricSubProps> = ({ icon, label, value }) => (
  <Card className="p-2 sm:p-3 md:p-4 text-center relative overflow-hidden flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] md:min-h-[90px]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
      {React.cloneElement(icon, { className: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20' })}
    </div>

    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1 md:mb-2 relative z-10 w-full">
      <div className="text-primary scale-75 sm:scale-90 md:scale-100 flex-shrink-0">{icon}</div>
      <p className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate max-w-full">
        {label}
      </p>
    </div>
    <p className="text-xs sm:text-sm md:text-lg font-light tracking-tight relative z-10 whitespace-nowrap">
      {value}
    </p>
  </Card>
)
