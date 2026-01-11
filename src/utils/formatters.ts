import { DAYS_OF_WEEK, DAYS_OF_WEEK_FULL, MONTHS, MONTHS_FULL, UV_LEVELS, SEVERE_RISK_LEVELS } from './constants'

export const formatDateBR = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)

  const dayName = DAYS_OF_WEEK[date.getDay()]
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]

  return `${dayName}, ${day} ${month}`
}

export const formatFullDate = (dayIndex: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + dayIndex)

  const dayName = DAYS_OF_WEEK_FULL[date.getDay()]
  const day = date.getDate()
  const month = MONTHS_FULL[date.getMonth()]

  return `${dayName}, ${day} de ${month}`
}

export const getUVLevel = (uv: number): string => {
  if (uv < UV_LEVELS.LOW.max) return UV_LEVELS.LOW.label
  if (uv < UV_LEVELS.MODERATE.max) return UV_LEVELS.MODERATE.label
  if (uv < UV_LEVELS.HIGH.max) return UV_LEVELS.HIGH.label
  if (uv < UV_LEVELS.VERY_HIGH.max) return UV_LEVELS.VERY_HIGH.label
  return UV_LEVELS.EXTREME.label
}

export const getMoonPhase = (phase: number): string => {
  if (phase === 0) return 'Nova'
  if (phase < 0.25) return 'Crescente'
  if (phase === 0.25) return 'Quarto Crescente'
  if (phase < 0.5) return 'Crescente'
  if (phase === 0.5) return 'Cheia'
  if (phase < 0.75) return 'Minguante'
  if (phase === 0.75) return 'Quarto Minguante'
  return 'Minguante'
}

export const getSevereRiskLevel = (risk: number) => {
  if (risk < SEVERE_RISK_LEVELS.LOW.threshold) return SEVERE_RISK_LEVELS.LOW
  if (risk < SEVERE_RISK_LEVELS.MODERATE.threshold) return SEVERE_RISK_LEVELS.MODERATE
  return SEVERE_RISK_LEVELS.HIGH
}

export const formatTime = (time: string): string => {
  return time.slice(0, 5) // "14:00:00" -> "14:00"
}
