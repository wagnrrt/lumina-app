export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'

export const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const DAYS_OF_WEEK_FULL = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]

export const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

export const MONTHS_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export const UV_LEVELS = {
  LOW: { max: 3, label: 'Baixo' },
  MODERATE: { max: 6, label: 'Moderado' },
  HIGH: { max: 8, label: 'Alto' },
  VERY_HIGH: { max: 11, label: 'Muito Alto' },
  EXTREME: { label: 'Extremo' }
}

export const SEVERE_RISK_LEVELS = {
  LOW: { threshold: 30, label: 'Baixo', color: 'text-green-400', bg: 'bg-green-400' },
  MODERATE: { threshold: 60, label: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-400' },
  HIGH: { label: 'Alto', color: 'text-red-400', bg: 'bg-red-400' }
}
